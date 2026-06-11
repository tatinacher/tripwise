<script setup lang="ts">
import { BookForm } from '~/features/book-form'

const route = useRoute()
const editId = computed(() => (route.query.id as string) || undefined)
const isEdit = computed(() => Boolean(editId.value))

useHead(() => ({ title: isEdit.value ? 'Edit item' : 'Add item' }))
</script>

<template>
  <main
    class="max-w-[560px] mx-auto px-4 pt-[calc(20px+env(safe-area-inset-top))] pb-[calc(32px+env(safe-area-inset-bottom))]"
  >
    <header class="flex items-center gap-2 mb-5">
      <NuxtLink
        to="/"
        aria-label="Back"
        class="grid place-items-center w-10 h-10 rounded-xl bg-surface-2 text-3xl leading-none"
      >
        ‹
      </NuxtLink>
      <h1 class="m-0 text-2xl font-extrabold">{{ isEdit ? 'Edit item' : 'Add item' }}</h1>
    </header>

    <BookForm :id="editId" />
  </main>
</template>
