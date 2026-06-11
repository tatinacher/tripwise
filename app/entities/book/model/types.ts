export type BookStatus = 'read' | 'unread'

export interface Book {
  id: string
  title: string
  author: string
  isbn: string
  description: string
  status: BookStatus
  createdAt: number
}

export type BookDraft = Pick<Book, 'title' | 'author' | 'isbn' | 'description' | 'status'>
