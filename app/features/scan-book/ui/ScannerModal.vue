<script setup lang="ts">
import { useScanner } from '../model/use-scanner'

const emit = defineEmits<{ detected: [isbn: string]; close: [] }>()

const videoRef = ref<HTMLVideoElement | null>(null)
const { error, startScan, stopScan } = useScanner()

onMounted(() => {
  if (!videoRef.value) return
  startScan(videoRef.value)
    .then((isbn) => emit('detected', isbn))
    .catch(() => {
      /* error message is exposed via `error` */
    })
})

onUnmounted(stopScan)
</script>

<template>
  <div class="fixed inset-0 z-50 flex flex-col bg-black">
    <header class="flex items-center justify-between px-4 pt-[calc(16px+env(safe-area-inset-top))] pb-3">
      <h2 class="m-0 text-lg font-bold text-content">Scan barcode</h2>
      <button
        type="button"
        aria-label="Close scanner"
        class="grid place-items-center w-10 h-10 rounded-xl bg-surface-2 text-content text-xl"
        @click="stopScan(); emit('close')"
      >
        ✕
      </button>
    </header>

    <div class="relative grow overflow-hidden">
      <video ref="videoRef" class="absolute inset-0 w-full h-full object-cover" muted playsinline autoplay />
      <div class="pointer-events-none absolute inset-x-10 top-1/2 h-32 -translate-y-1/2 rounded-card border-2 border-primary"></div>
    </div>

    <p
      class="px-6 py-5 text-center text-[15px]"
      :class="error ? 'text-danger' : 'text-muted'"
    >
      {{ error || 'Point the camera at the book’s barcode (ISBN)' }}
    </p>
  </div>
</template>
