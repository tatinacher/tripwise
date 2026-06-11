<script setup lang="ts">
import { useBooks } from '~/entities/book'

const props = defineProps<{ id: string }>()

const { removeBook } = useBooks()

function onClick() {
  if (import.meta.client && !confirm('Delete this item?')) return
  removeBook(props.id)
}
</script>

<template>
  <button
    class="w-9 h-9 rounded-xl bg-transparent text-muted text-base active:bg-surface-2 active:text-danger"
    aria-label="Delete item"
    @click="onClick"
  >
    ✕
  </button>
</template>
