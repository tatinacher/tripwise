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
      <p v-if="book.author" class="mt-0.5 text-muted text-[14px] break-words">
        {{ book.author }}
      </p>
      <p v-if="book.description" class="mt-1 text-muted text-[15px] break-words">
        {{ book.description }}
      </p>
      <div class="mt-2 flex flex-wrap items-center gap-2">
        <span class="inline-block text-[13px] font-semibold text-primary">
          {{ isRead ? 'Read' : 'Not read' }}
        </span>
        <span v-if="book.isbn" class="inline-block text-[12px] text-muted">
          ISBN {{ book.isbn }}
        </span>
      </div>
    </NuxtLink>

    <!-- `actions` slot is filled by the delete-book feature -->
    <div class="shrink-0">
      <slot name="actions" />
    </div>
  </article>
</template>
