// services/api.ts
// Single source of truth for backend API calls.
// Uses VITE_API_BASE from:
//   - .env.development  (local dev)   -> http://localhost:3001
//   - .env.production   (GitHub Pages)-> https://aura-core.onrender.com

type Json = Record<string, any>

function normalizeBase(url: string): string {
  return url.replace(/\/+$/, '')
}

const RAW_BASE = import.meta.env.VITE_API_BASE as string | undefined

// This MUST be set in .env.development / .env.production
export const API_BASE = normalizeBase(RAW_BASE || '')

if (!API_BASE) {
  // This helps you immediately spot missing env config in the browser console
  // (e.g., typo in .env.production or forgetting to restart vite).
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

  // Try to parse error bodies nicely
  if (!res.ok) {
    let detail = ''
    try {
      const txt = await res.text()
      detail = txt ? `\n${txt}` : ''
    } catch {}
    throw new Error(`API ${res.status} ${res.statusText} at ${url}${detail}`)
  }

  // Most of your endpoints return JSON
  return (await res.json()) as T
}

// --- Public API functions ---

export async function health() {
  return apiFetch('/api/health')
}

export async function getSystemState() {
  return apiFetch('/api/system/state')
}

export async function chat(messages: any, instruction?: string) {
  return apiFetch('/api/chat', {
    method: 'POST',
    body: JSON.stringify({ messages, instruction }),
  })
}

export async function terminal(command: string) {
  return apiFetch('/api/terminal', {
    method: 'POST',
    body: JSON.stringify({ command }),
  })
}

export async function maps(query: string, lat?: number, lng?: number) {
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
