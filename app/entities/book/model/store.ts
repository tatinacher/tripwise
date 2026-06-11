import { BOOKS_STORAGE_KEY } from '~/shared/config'
import { createId, readJson, writeJson } from '~/shared/lib'
import type { Book, BookDraft } from './types'

// Module-level singleton state — every consumer shares one source of truth
// (lightweight alternative to Pinia for a single-entity app).
const books = ref<Book[]>([])
const ready = ref(false)

function hydrate() {
  if (ready.value || !import.meta.client) return
  books.value = readJson<Book[]>(BOOKS_STORAGE_KEY, [])
  ready.value = true
  // Persist on every mutation.
  watch(books, (value) => writeJson(BOOKS_STORAGE_KEY, value), { deep: true })
}

export function useBooks() {
  hydrate()

  const total = computed(() => books.value.length)
  const readCount = computed(
    () => books.value.filter((b) => b.status === 'read').length,
  )

  /** Newest first. */
  const sorted = computed(() =>
    [...books.value].sort((a, b) => b.createdAt - a.createdAt),
  )

  function getById(id: string): Book | undefined {
    return books.value.find((b) => b.id === id)
  }

  function addBook(draft: BookDraft): Book {
    const book: Book = {
      id: createId(),
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: draft.status,
      createdAt: Date.now(),
    }
    books.value.push(book)
    return book
  }

  function updateBook(id: string, draft: BookDraft): void {
    const book = getById(id)
    if (!book) return
    book.title = draft.title.trim()
    book.description = draft.description.trim()
    book.status = draft.status
  }

  function removeBook(id: string): void {
    books.value = books.value.filter((b) => b.id !== id)
  }

  function toggleStatus(id: string): void {
    const book = getById(id)
    if (!book) return
    book.status = book.status === 'read' ? 'unread' : 'read'
  }

  return {
    books: sorted,
    ready,
    total,
    readCount,
    getById,
    addBook,
    updateBook,
    removeBook,
    toggleStatus,
  }
}
