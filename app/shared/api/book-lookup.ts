export interface BookLookupResult {
  title: string
  author: string
  description: string
}

interface OpenLibraryAuthor {
  name: string
}

interface OpenLibraryEntry {
  title?: string
  authors?: OpenLibraryAuthor[]
  notes?: string | { value: string }
  excerpts?: { text: string }[]
}

interface GoogleVolumeInfo {
  title?: string
  authors?: string[]
  description?: string
}

/** Looks up book details by ISBN, trying Open Library then Google Books. */
export async function lookupBookByIsbn(isbn: string): Promise<BookLookupResult | null> {
  return (await fetchFromOpenLibrary(isbn)) ?? (await fetchFromGoogleBooks(isbn))
}

async function fetchFromOpenLibrary(isbn: string): Promise<BookLookupResult | null> {
  try {
    const res = await fetch(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`,
    )
    if (!res.ok) return null

    const data = (await res.json()) as Record<string, OpenLibraryEntry>
    const entry = data[`ISBN:${isbn}`]
    if (!entry?.title) return null

    const notes = typeof entry.notes === 'string' ? entry.notes : entry.notes?.value

    return {
      title: entry.title,
      author: (entry.authors ?? []).map((a) => a.name).join(', '),
      description: notes ?? entry.excerpts?.[0]?.text ?? '',
    }
  } catch {
    return null
  }
}

async function fetchFromGoogleBooks(isbn: string): Promise<BookLookupResult | null> {
  try {
    const res = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`)
    if (!res.ok) return null

    const data = (await res.json()) as { items?: { volumeInfo?: GoogleVolumeInfo }[] }
    const info = data.items?.[0]?.volumeInfo
    if (!info?.title) return null

    return {
      title: info.title,
      author: (info.authors ?? []).join(', '),
      description: info.description ?? '',
    }
  } catch {
    return null
  }
}
