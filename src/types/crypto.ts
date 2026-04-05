/** Wire format for encrypted journal blob (on disk, export file, IndexedDB). */
export type EncryptedJournalEnvelope = {
  format: 'still-encrypted-v1'
  kdf: {
    name: 'PBKDF2'
    hash: 'SHA-256'
    iterations: number
  }
  salt: string
  iv: string
  ciphertext: string
}

export function isEncryptedJournalEnvelope(
  value: unknown,
): value is EncryptedJournalEnvelope {
  if (!value || typeof value !== 'object') return false
  const o = value as Record<string, unknown>
  return (
    o.format === 'still-encrypted-v1' &&
    typeof o.salt === 'string' &&
    typeof o.iv === 'string' &&
    typeof o.ciphertext === 'string' &&
    o.kdf !== null &&
    typeof o.kdf === 'object'
  )
}
