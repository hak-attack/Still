export type JournalEntry = {
  date: string
  content: string
  createdAt: string
  updatedAt: string
}

export type JournalStore = {
  version: number
  entries: Record<string, JournalEntry>
}

export const JOURNAL_STORE_VERSION = 1

export function createEmptyJournalStore(): JournalStore {
  return { version: JOURNAL_STORE_VERSION, entries: {} }
}
