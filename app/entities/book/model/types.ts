export type BookStatus = 'read' | 'unread'

export interface Book {
  id: string
  title: string
  description: string
  status: BookStatus
  createdAt: number
}

export type BookDraft = Pick<Book, 'title' | 'description' | 'status'>
