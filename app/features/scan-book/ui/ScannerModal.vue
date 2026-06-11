<script setup lang="ts">
import { useScanner } from '../model/use-scanner'

const emit = defineEmits<{ detected: [isbn: string]; close: [] }>()

const elementId = `scanner-${useId()}`
const videoRef = ref<HTMLVideoElement | null>(null)
const { error, mode, onResult, startScanner, stopScanner } = useScanner()

onResult((isbn) => emit('detected', isbn))

onMounted(() => {
  startScanner({ videoElement: videoRef.value, elementId }).catch(() => {
    /* error message is exposed via `error` */
  })
})

onUnmounted(stopScanner)

function close() {
  void stopScanner()
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-black">
    <header class="flex items-center justify-between px-4 pt-[calc(16px+env(safe-area-inset-top))] pb-3">
      <h2 class="m-0 text-lg font-bold text-content">Scan barcode</h2>
      <button
        type="button"
        aria-label="Close scanner"
        class="grid place-items-center w-10 h-10 rounded-xl bg-surface-2 text-content text-xl"
        @click="close"
      >
        ✕
      </button>
    </header>

    <div class="relative grow overflow-hidden">
      <video
        v-show="mode === 'detector'"
        ref="videoRef"
        class="absolute inset-0 w-full h-full object-cover"
        muted
        playsinline
        autoplay
      ></video>
      <div
        v-show="mode === 'html5'"
        :id="elementId"
        class="absolute inset-0 w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover"
      ></div>
      <div
        v-if="mode === 'detector'"
        class="pointer-events-none absolute inset-x-10 top-1/2 h-32 -translate-y-1/2 rounded-card border-2 border-primary"
      ></div>
    </div>

    <p
      class="px-6 py-5 text-center text-[15px]"
      :class="error ? 'text-danger' : 'text-muted'"
    >
      {{ error || 'Point the camera at the book’s barcode (ISBN)' }}
    </p>
  </div>
</template>
