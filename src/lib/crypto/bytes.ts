/** Satisfy strict `BufferSource` typing for `crypto.subtle` across TS / lib versions. */
export function asBufferSource(data: Uint8Array): BufferSource {
  return data as unknown as BufferSource
}

/** Stable ArrayBuffer-backed copy (optional normalization). */
export function u8ForCrypto(bytes: Uint8Array): Uint8Array {
  const ab = new ArrayBuffer(bytes.byteLength)
  const out = new Uint8Array(ab)
  out.set(bytes)
  return out
}

export function randomBytes(length: number): Uint8Array {
  const ab = new ArrayBuffer(length)
  const out = new Uint8Array(ab)
  crypto.getRandomValues(out)
  return out
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
  return btoa(binary)
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64)
  const ab = new ArrayBuffer(binary.length)
  const out = new Uint8Array(ab)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}
