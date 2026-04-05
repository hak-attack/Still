import type { EncryptedJournalEnvelope } from '../../types/crypto'
import type { JournalStore } from '../../types/journal'
import { asBufferSource, bytesToBase64, randomBytes } from './bytes'
import { PBKDF2_ITERATIONS } from './params'

export async function encryptJournalStore(
  key: CryptoKey,
  salt: Uint8Array,
  store: JournalStore,
): Promise<EncryptedJournalEnvelope> {
  const iv = randomBytes(12)
  const enc = new TextEncoder()
  const ciphertext = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: asBufferSource(iv) },
    key,
    enc.encode(JSON.stringify(store)),
  )
  return {
    format: 'still-encrypted-v1',
    kdf: {
      name: 'PBKDF2',
      hash: 'SHA-256',
      iterations: PBKDF2_ITERATIONS,
    },
    salt: bytesToBase64(salt),
    iv: bytesToBase64(iv),
    ciphertext: bytesToBase64(new Uint8Array(ciphertext)),
  }
}
