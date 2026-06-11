<script setup lang="ts">
import { Bookshelf } from '~/widgets/bookshelf'

useHead({ title: 'Bookshelf' })
</script>

<template>
  <main
    class="max-w-[560px] mx-auto px-4 pt-[calc(20px+env(safe-area-inset-top))] pb-[calc(110px+env(safe-area-inset-bottom))]"
  >
    <Bookshelf />

    <NuxtLink
      to="/add"
      aria-label="Add item"
      class="fixed left-1/2 -translate-x-1/2 bottom-[calc(20px+env(safe-area-inset-bottom))] z-40 inline-flex items-center gap-2 h-14 px-[26px] rounded-[28px] bg-primary text-primary-ink text-[17px] font-bold shadow-[0_12px_30px_rgba(45,212,191,0.35)] active:scale-[0.97]"
    >
      <span class="text-2xl leading-none">＋</span>
      Add item
    </NuxtLink>
  </main>
</template>
