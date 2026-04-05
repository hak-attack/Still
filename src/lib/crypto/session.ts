/**
 * In-memory session crypto material. Never persisted.
 * Cleared on lock, refresh, or clear data.
 */
let sessionKey: CryptoKey | null = null
let sessionSalt: Uint8Array | null = null

export function setSessionCrypto(key: CryptoKey, salt: Uint8Array): void {
  sessionKey = key
  sessionSalt = new Uint8Array(salt)
}

export function getSessionCrypto(): { key: CryptoKey; salt: Uint8Array } | null {
  if (!sessionKey || !sessionSalt) return null
  return { key: sessionKey, salt: sessionSalt }
}

export function clearSessionCrypto(): void {
  sessionKey = null
  sessionSalt = null
}
