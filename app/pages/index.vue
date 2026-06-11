<script setup lang="ts">
import { Bookshelf } from '~/widgets/bookshelf'

useHead({ title: 'Bookshelf' })
</script>

<template>
  <main
    class="max-w-[560px] mx-auto px-4 pt-[calc(20px+env(safe-area-inset-top))] pb-[calc(110px+env(safe-area-inset-bottom))]"
  >
    <Bookshelf />

    <div
      class="fixed inset-x-0 bottom-[calc(20px+env(safe-area-inset-bottom))] z-40 flex justify-center gap-3 px-4"
    >
      <NuxtLink
        to="/add?scan=1"
        aria-label="Scan book barcode"
        class="inline-flex items-center gap-2 h-14 px-6 rounded-[28px] bg-surface-2 text-content text-[17px] font-bold active:scale-[0.97]"
      >
        <span class="text-xl leading-none">📷</span>
        Scan
      </NuxtLink>
      <NuxtLink
        to="/add"
        aria-label="Add item"
        class="inline-flex items-center gap-2 h-14 px-[26px] rounded-[28px] bg-primary text-primary-ink text-[17px] font-bold shadow-[0_12px_30px_rgba(45,212,191,0.35)] active:scale-[0.97]"
      >
        <span class="text-2xl leading-none">＋</span>
        Add item
      </NuxtLink>
    </div>
  </main>
</template>
