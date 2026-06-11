<script setup lang="ts">
import { useBooks, BookCard } from '~/entities/book'
import { ToggleReadButton } from '~/features/toggle-read-status'
import { DeleteBookButton } from '~/features/delete-book'

const { books, ready, total, readCount } = useBooks()
</script>

<template>
  <section>
    <header class="mb-5">
      <h1 class="m-0 text-[28px] font-extrabold">📚 Bookshelf</h1>
      <p v-if="total" class="mt-1 text-muted">{{ readCount }} of {{ total }} read</p>
    </header>

    <ClientOnly>
      <div v-if="ready && books.length" class="flex flex-col gap-3">
        <BookCard v-for="book in books" :key="book.id" :book="book">
          <template #leading="{ isRead }">
            <ToggleReadButton :id="book.id" :is-read="isRead" />
          </template>
          <template #actions>
            <DeleteBookButton :id="book.id" />
          </template>
        </BookCard>
      </div>

      <div v-else-if="ready" class="mt-[18vh] text-center text-muted">
        <p class="m-0 text-[56px]">🪧</p>
        <p class="text-[17px]">Your shelf is empty.<br />Add your first book.</p>
      </div>

      <template #fallback>
        <div class="mt-[18vh] text-center text-muted">
          <p class="text-[17px]">Loading…</p>
        </div>
      </template>
    </ClientOnly>
  </section>
</template>
