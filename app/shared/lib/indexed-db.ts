/**
 * Minimal promise-based wrapper around IndexedDB for storing JSON-serializable
 * values under string keys in a single object store.
 */
export function createIdbStore(dbName: string, storeName: string, version = 1) {
  let dbPromise: Promise<IDBDatabase> | null = null

  function getDb(): Promise<IDBDatabase> {
    if (!dbPromise) {
      dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(dbName, version)
        request.onupgradeneeded = () => {
          if (!request.result.objectStoreNames.contains(storeName)) {
            request.result.createObjectStore(storeName)
          }
        }
        request.onsuccess = () => resolve(request.result)
        request.onerror = () => reject(request.error)
      })
    }
    return dbPromise
  }

  async function get<T>(key: string): Promise<T | undefined> {
    if (!import.meta.client || !('indexedDB' in window)) return undefined
    try {
      const db = await getDb()
      return await new Promise<T | undefined>((resolve, reject) => {
        const request = db.transaction(storeName, 'readonly').objectStore(storeName).get(key)
        request.onsuccess = () => resolve(request.result as T | undefined)
        request.onerror = () => reject(request.error)
      })
    } catch {
      return undefined
    }
  }

  async function set(key: string, value: unknown): Promise<void> {
    if (!import.meta.client || !('indexedDB' in window)) return
    try {
      const db = await getDb()
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction(storeName, 'readwrite')
        tx.objectStore(storeName).put(value, key)
        tx.oncomplete = () => resolve()
        tx.onerror = () => reject(tx.error)
      })
    } catch {
      /* quota exceeded / unsupported — ignore */
    }
  }

  return { get, set }
}
