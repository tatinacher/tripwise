<script setup lang="ts">
import { UiButton } from '~/shared/ui'

// Surfaces the install prompt and "new version" toast from @vite-pwa/nuxt.
const { $pwa } = useNuxtApp()

const bar =
  'pointer-events-auto w-full max-w-[480px] flex items-center justify-between gap-3 py-3 pl-4 pr-3 bg-surface border border-line rounded-card shadow-[0_12px_30px_rgba(0,0,0,0.4)] text-[15px]'
</script>

<template>
  <ClientOnly>
    <div
      v-if="$pwa"
      class="fixed inset-x-0 z-50 flex justify-center px-4 pointer-events-none bottom-[calc(12px+env(safe-area-inset-bottom))]"
    >
      <div v-if="$pwa.showInstallPrompt && !$pwa.needRefresh" :class="bar">
        <span>Install Bookshelf on your device</span>
        <div class="flex shrink-0 gap-2 [&_a]:min-h-10 [&_button]:min-h-10 [&_a]:px-3.5 [&_button]:px-3.5 [&_a]:text-[15px] [&_button]:text-[15px]">
          <UiButton variant="primary" @click="$pwa.install()">Install</UiButton>
          <UiButton variant="ghost" @click="$pwa.cancelInstall()">Later</UiButton>
        </div>
      </div>

      <div v-if="$pwa.needRefresh" :class="bar">
        <span>A new version is available</span>
        <div class="flex shrink-0 gap-2 [&_button]:min-h-10 [&_button]:px-3.5 [&_button]:text-[15px]">
          <UiButton variant="primary" @click="$pwa.updateServiceWorker()">Reload</UiButton>
        </div>
      </div>
    </div>
  </ClientOnly>
</template>
