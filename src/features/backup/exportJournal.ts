import type { JournalStore } from '../../types/journal'
import { encryptJournalStore } from '../../lib/crypto/encrypt'
import { getSessionCrypto } from '../../lib/crypto/session'

export async function buildExportPayload(store: JournalStore): Promise<string> {
  const session = getSessionCrypto()
  if (!session) throw new Error('NOT_UNLOCKED')
  const envelope = await encryptJournalStore(session.key, session.salt, store)
  return JSON.stringify(envelope, null, 0)
}
