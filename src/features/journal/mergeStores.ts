import type { JournalEntry, JournalStore } from '../../types/journal'

function pickNewer(a: JournalEntry, b: JournalEntry): JournalEntry {
  return new Date(a.updatedAt) >= new Date(b.updatedAt) ? a : b
}

/** Merges entries; on conflict, keeps the newer `updatedAt`. */
export function mergeJournalStores(base: JournalStore, incoming: JournalStore): JournalStore {
  const entries: Record<string, JournalEntry> = { ...base.entries }
  for (const [date, inc] of Object.entries(incoming.entries)) {
    const cur = entries[date]
    if (!cur) entries[date] = inc
    else entries[date] = pickNewer(cur, inc)
  }
  return {
    version: base.version,
    entries,
  }
}
