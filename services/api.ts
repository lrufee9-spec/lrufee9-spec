// services/api.ts
// Backend API client for Aura OS (Vite + Express).
// Uses VITE_API_BASE from:
//   - .env.development  -> http://localhost:3001
//   - .env.production   -> https://aura-core.onrender.com

type Json = Record<string, any>

function normalizeBase(url: string): string {
  return url.replace(/\/+$/, '')
}

const RAW_BASE = import.meta.env.VITE_API_BASE as string | undefined
export const API_BASE = normalizeBase(RAW_BASE || '')

if (!API_BASE) {
  console.warn('[AURA] VITE_API_BASE is not set. Check .env.development/.env.production.')
} else {
  console.log('[AURA] Backend API_BASE:', API_BASE)
}

async function apiFetch<T = Json>(path: string, init?: RequestInit): Promise<T> {
  if (!API_BASE) throw new Error('VITE_API_BASE is not set')

  const url = `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`

  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
  })

  if (!res.ok) {
    let detail = ''
    try {
      const txt = await res.text()
      detail = txt ? `\n${txt}` : ''
    } catch {}
    throw new Error(`API ${res.status} ${res.statusText} at ${url}${detail}`)
  }

  return (await res.json()) as T
}

// ---- Core endpoints ----

export async function health() {
  return apiFetch('/api/health')
}

export async function getSystemState() {
  return apiFetch('/api/system/state')
}

// Legacy-friendly chat:
// Some parts of the app call: AuraAPI.chat(messages, onChunk)
// We don't stream from backend here, so we accept onChunk but ignore it.
export async function chat(
  messages: any,
  onChunkOrInstruction?: ((chunk: string) => void) | string,
  maybeInstruction?: string
): Promise<{ fullText: string; toolCalls?: any[]; raw?: any }> {
  const onChunk = typeof onChunkOrInstruction === 'function' ? onChunkOrInstruction : undefined
  const instruction = typeof onChunkOrInstruction === 'string' ? onChunkOrInstruction : maybeInstruction

  const data = await apiFetch<any>('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, instruction }),
  })

  // Backend returns: { text, toolCalls }
  const fullText = data?.text ?? ''

  // If caller provided onChunk, send the whole message once (best-effort compatibility)
  if (onChunk) onChunk(fullText)

  return { fullText, toolCalls: data?.toolCalls, raw: data }
}

// Legacy-friendly terminal naming:
// services/geminiService.ts calls AuraAPI.terminalCommand(command)
export async function terminalCommand(command: string) {
  return apiFetch('/api/terminal', {
    method: 'POST',
    body: JSON.stringify({ command }),
  })
}

// Legacy-friendly maps naming:
// services/geminiService.ts calls AuraAPI.getMapsInfo(query, lat, lng)
export async function getMapsInfo(query: string, lat?: number, lng?: number) {
  return apiFetch('/api/maps', {
    method: 'POST',
    body: JSON.stringify({ query, lat, lng }),
  })
}

export async function speak(text: string) {
  return apiFetch('/api/speak', {
    method: 'POST',
    body: JSON.stringify({ text }),
  })
}

// Some UI imports `securityTools` from services/api.ts.
// Keep it as `any` so existing code doesn't type-error even if it calls methods dynamically.
export const securityTools: any = {}

// Backwards-compatible export (many components import AuraAPI)
export const AuraAPI = {
  API_BASE,

  // preferred
  health,
  getSystemState,
  chat,
  speak,

  // legacy names expected by existing code
  terminalCommand,
  getMapsInfo,

  // optional aliases (in case other code expects these)
  terminal: terminalCommand,
  maps: getMapsInfo,
}
