<script setup lang="ts">
import type { Book } from '../model/types'

const props = defineProps<{ book: Book }>()

const isRead = computed(() => props.book.status === 'read')
</script>

<template>
  <article
    class="flex items-start gap-3 p-4 bg-surface border border-line rounded-card"
    :class="{ 'opacity-65': isRead }"
  >
    <!-- `leading` slot is filled by the toggle-read-status feature -->
    <div class="shrink-0 mt-0.5">
      <slot name="leading" :is-read="isRead" />
    </div>

    <NuxtLink :to="`/add?id=${book.id}`" class="grow min-w-0">
      <h3
        class="m-0 text-lg font-bold break-words"
        :class="{ 'line-through': isRead }"
      >
        {{ book.title }}
      </h3>
      <p v-if="book.description" class="mt-1 text-muted text-[15px] break-words">
        {{ book.description }}
      </p>
      <span class="inline-block mt-2 text-[13px] font-semibold text-primary">
        {{ isRead ? 'Read' : 'Not read' }}
      </span>
    </NuxtLink>

    <!-- `actions` slot is filled by the delete-book feature -->
    <div class="shrink-0">
      <slot name="actions" />
    </div>
  </article>
</template>
