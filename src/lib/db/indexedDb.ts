const DB_NAME = 'still-journal'
const DB_VERSION = 1
const STORE = 'meta'

export type StoredRecord = { id: string; payload: string }

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onerror = () => reject(req.error ?? new Error('IDB open failed'))
    req.onsuccess = () => resolve(req.result)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' })
      }
    }
  })
}

export async function idbGet(id: string): Promise<string | null> {
  try {
    const db = await openDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const store = tx.objectStore(STORE)
      const r = store.get(id)
      r.onerror = () => reject(r.error)
      r.onsuccess = () => {
        const row = r.result as StoredRecord | undefined
        resolve(row?.payload ?? null)
      }
    })
  } catch {
    return null
  }
}

export async function idbSet(id: string, payload: string): Promise<void> {
  const db = await openDb()
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    const store = tx.objectStore(STORE)
    const r = store.put({ id, payload })
    r.onerror = () => reject(r.error)
    r.onsuccess = () => resolve()
  })
}

export async function idbRemove(id: string): Promise<void> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      const store = tx.objectStore(STORE)
      const r = store.delete(id)
      r.onerror = () => reject(r.error)
      r.onsuccess = () => resolve()
    })
  } catch {
    /* ignore */
  }
}

export function idbSupported(): boolean {
  return typeof indexedDB !== 'undefined'
}
