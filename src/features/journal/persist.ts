import { encryptJournalStore } from '../../lib/crypto/encrypt'
import { getSessionCrypto } from '../../lib/crypto/session'
import { saveEncryptedEnvelope } from '../../lib/db/storage'
import type { JournalStore } from '../../types/journal'

export async function persistJournalStore(store: JournalStore): Promise<void> {
  const session = getSessionCrypto()
  if (!session) throw new Error('NOT_UNLOCKED')
  const env = await encryptJournalStore(session.key, session.salt, store)
  await saveEncryptedEnvelope(JSON.stringify(env))
}
