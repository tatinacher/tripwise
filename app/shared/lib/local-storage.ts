/**
 * Tiny SSR-safe JSON wrapper around localStorage.
 * Returns the fallback on the server, on parse errors, or in private mode.
 */
export function readJson<T>(key: string, fallback: T): T {
  if (!import.meta.client) return fallback
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}
