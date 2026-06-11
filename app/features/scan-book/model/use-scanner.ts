import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser'
import { BarcodeFormat, DecodeHintType, NotFoundException } from '@zxing/library'

const hints = new Map([[DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.EAN_13, BarcodeFormat.EAN_8]]])

export function useScanner() {
  const error = ref<string | null>(null)
  let controls: IScannerControls | null = null

  function stopScan(): void {
    controls?.stop()
    controls = null
  }

  /** Resolves with the decoded ISBN once a barcode is found. */
  function startScan(videoElement: HTMLVideoElement): Promise<string> {
    error.value = null
    const reader = new BrowserMultiFormatReader(hints)

    return new Promise<string>((resolve, reject) => {
      reader
        .decodeFromConstraints(
          { video: { facingMode: 'environment' } },
          videoElement,
          (result, err, ctrl) => {
            controls = ctrl
            if (result) {
              stopScan()
              resolve(result.getText())
              return
            }
            if (err && !(err instanceof NotFoundException)) {
              error.value = 'Unable to read the barcode. Try again.'
            }
          },
        )
        .catch((err: unknown) => {
          error.value =
            err instanceof Error && err.name === 'NotAllowedError'
              ? 'Camera access denied. Allow camera permission and try again.'
              : 'No camera available on this device.'
          reject(err)
        })
    })
  }

  return { error, startScan, stopScan }
}
