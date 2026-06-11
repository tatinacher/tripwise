import { Html5Qrcode, Html5QrcodeSupportedFormats, type Html5QrcodeCameraScanConfig } from 'html5-qrcode'

interface BarcodeDetectorResult {
  rawValue: string
}

interface BarcodeDetectorInstance {
  detect: (source: CanvasImageSource) => Promise<BarcodeDetectorResult[]>
}

interface BarcodeDetectorConstructor {
  new (options: { formats: string[] }): BarcodeDetectorInstance
  getSupportedFormats?: () => Promise<string[]>
}

const DETECT_INTERVAL_MS = 250

const html5ScanConfig: Html5QrcodeCameraScanConfig = {
  fps: 12,
  qrbox: { width: 280, height: 120 },
}

function getBarcodeDetectorCtor(): BarcodeDetectorConstructor | null {
  if (typeof window === 'undefined' || !('BarcodeDetector' in window)) return null
  return (window as unknown as { BarcodeDetector: BarcodeDetectorConstructor }).BarcodeDetector
}

/** Confirms the detector can decode EAN-13, falling back if it can't. */
async function supportsEan13(Detector: BarcodeDetectorConstructor): Promise<boolean> {
  try {
    if (typeof Detector.getSupportedFormats !== 'function') return true
    const formats = await Detector.getSupportedFormats()
    return formats.includes('ean_13')
  } catch {
    return true
  }
}

export type ScannerMode = 'detector' | 'html5' | null

export interface ScannerTargets {
  /** <video> element used by the BarcodeDetector path. */
  videoElement: HTMLVideoElement | null
  /** Container element id used by the html5-qrcode fallback. */
  elementId: string
}

export function useScanner() {
  const error = ref<string | null>(null)
  const isScanning = ref(false)
  const mode = ref<ScannerMode>(null)

  let stream: MediaStream | null = null
  let videoEl: HTMLVideoElement | null = null
  let detectTimer: ReturnType<typeof setInterval> | null = null
  let html5Scanner: Html5Qrcode | null = null
  let resultCallback: ((isbn: string) => void) | null = null
  let settled = false

  /** Registers the callback invoked with the decoded ISBN. */
  function onResult(callback: (isbn: string) => void): void {
    resultCallback = callback
  }

  /** Reports a decoded ISBN exactly once, then releases the camera. */
  function emitResult(isbn: string): void {
    if (settled) return
    settled = true
    resultCallback?.(isbn)
    void stopScanner()
  }

  /** Starts scanning, preferring BarcodeDetector and falling back to html5-qrcode. */
  async function startScanner(targets: ScannerTargets): Promise<void> {
    error.value = null
    settled = false

    const Detector = getBarcodeDetectorCtor()
    if (Detector && targets.videoElement && (await supportsEan13(Detector))) {
      await startWithBarcodeDetector(Detector, targets.videoElement)
    } else {
      await startWithHtml5Qrcode(targets.elementId)
    }
  }

  /** Reads frames from `getUserMedia` and polls them with BarcodeDetector. */
  async function startWithBarcodeDetector(Detector: BarcodeDetectorConstructor, video: HTMLVideoElement): Promise<void> {
    mode.value = 'detector'

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      })
    } catch (err) {
      error.value =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Camera access denied. Allow camera permission and try again.'
          : 'No camera available on this device.'
      mode.value = null
      throw err
    }

    videoEl = video
    video.srcObject = stream
    try {
      await video.play()
    } catch {
      // Autoplay may be blocked momentarily; the video element will still render frames.
    }

    const detector = new Detector({ formats: ['ean_13'] })
    detectTimer = setInterval(() => {
      void detectFrame(detector)
    }, DETECT_INTERVAL_MS)

    isScanning.value = true
  }

  /** Runs a single BarcodeDetector pass over the current video frame. */
  async function detectFrame(detector: BarcodeDetectorInstance): Promise<void> {
    if (!videoEl || settled || videoEl.readyState < videoEl.HAVE_ENOUGH_DATA) return

    try {
      const results = await detector.detect(videoEl)
      const match = results.find((result) => result.rawValue)
      if (match) emitResult(match.rawValue)
    } catch {
      // Transient decode errors are ignored; scanning continues on the next tick.
    }
  }

  /** Starts the html5-qrcode camera scanner as a fallback. */
  async function startWithHtml5Qrcode(elementId: string): Promise<void> {
    mode.value = 'html5'
    html5Scanner = new Html5Qrcode(elementId, {
      formatsToSupport: [Html5QrcodeSupportedFormats.EAN_13, Html5QrcodeSupportedFormats.EAN_8],
      verbose: false,
    })

    try {
      await html5Scanner.start(
        { facingMode: 'environment' },
        html5ScanConfig,
        (decodedText) => emitResult(decodedText),
        undefined,
      )
      isScanning.value = true
    } catch (err) {
      error.value =
        err instanceof Error && err.name === 'NotAllowedError'
          ? 'Camera access denied. Allow camera permission and try again.'
          : 'No camera available on this device.'
      html5Scanner = null
      mode.value = null
      throw err
    }
  }

  /** Stops scanning and releases all camera resources. */
  async function stopScanner(): Promise<void> {
    isScanning.value = false

    if (detectTimer !== null) {
      clearInterval(detectTimer)
      detectTimer = null
    }

    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      stream = null
    }

    if (videoEl) {
      videoEl.srcObject = null
      videoEl = null
    }

    const active = html5Scanner
    html5Scanner = null
    if (active) {
      try {
        if (active.isScanning) await active.stop()
        active.clear()
      } catch {
        // Camera may already be stopped/released; nothing to do.
      }
    }

    mode.value = null
  }

  return { error, isScanning, mode, onResult, startScanner, stopScanner }
}
