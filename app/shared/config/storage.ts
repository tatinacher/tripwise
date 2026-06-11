/** Versioned storage key — bump the suffix on breaking schema changes. */
export const BOOKS_STORAGE_KEY = 'bookshelf:books:v1'

/** IndexedDB database/store that holds the bookshelf data on-device. */
export const BOOKS_DB_NAME = 'bookshelf'
export const BOOKS_DB_STORE = 'books'
export const BOOKS_DB_VERSION = 1
