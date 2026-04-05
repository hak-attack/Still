import type { EncryptedJournalEnvelope } from '../../types/crypto'
import type { JournalStore } from '../../types/journal'
import { isEncryptedJournalEnvelope } from '../../types/crypto'
import { asBufferSource, base64ToBytes, u8ForCrypto } from './bytes'
import { deriveKeyFromPassphrase } from './deriveKey'

export async function decryptJournalEnvelope(
  passphrase: string,
  envelope: EncryptedJournalEnvelope,
): Promise<{ store: JournalStore; salt: Uint8Array; key: CryptoKey }> {
  const salt = u8ForCrypto(base64ToBytes(envelope.salt))
  const key = await deriveKeyFromPassphrase(passphrase, salt)
  const iv = u8ForCrypto(base64ToBytes(envelope.iv))
  const raw = u8ForCrypto(base64ToBytes(envelope.ciphertext))
  let plain: ArrayBuffer
  try {
    plain = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: asBufferSource(iv) },
      key,
      asBufferSource(raw),
    )
  } catch {
    throw new Error('DECRYPT_FAILED')
  }
  const text = new TextDecoder().decode(plain)
  let parsed: unknown
  try {
    parsed = JSON.parse(text) as unknown
  } catch {
    throw new Error('DECRYPT_FAILED')
  }
  if (!isJournalStore(parsed)) throw new Error('DECRYPT_FAILED')
  return { store: parsed, salt, key }
}

function isJournalStore(value: unknown): value is JournalStore {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  if (typeof o.version !== 'number' || !o.entries || typeof o.entries !== 'object') return false
  return true
}

export function parseEnvelopeJson(text: string): EncryptedJournalEnvelope {
  let parsed: unknown
  try {
    parsed = JSON.parse(text) as unknown
  } catch {
    throw new Error('INVALID_FILE')
  }
  if (!isEncryptedJournalEnvelope(parsed)) throw new Error('INVALID_FILE')
  return parsed
}
