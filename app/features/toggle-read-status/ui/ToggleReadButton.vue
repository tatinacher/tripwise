<script setup lang="ts">
import { useBooks } from '~/entities/book'

const props = defineProps<{ id: string; isRead: boolean }>()

const { toggleStatus } = useBooks()
</script>

<template>
  <button
    class="grid place-items-center w-10 h-10 rounded-xl border-2 border-primary text-primary-ink text-xl font-extrabold"
    :class="isRead ? 'bg-primary' : 'bg-transparent'"
    :aria-pressed="isRead"
    :aria-label="isRead ? 'Mark as unread' : 'Mark as read'"
    @click="toggleStatus(props.id)"
  >
    <span v-if="isRead">✓</span>
  </button>
</template>
