import type { ObservationSession } from './types'

const STORAGE_KEY = 'ethoscope:sessions'

function readStore(): Record<string, ObservationSession> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, ObservationSession>) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, ObservationSession>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function saveSession(session: ObservationSession): void {
  const store = readStore()
  store[session.id] = session
  writeStore(store)
}

export function loadSession(id: string): Maybe<ObservationSession> {
  return readStore()[id] ?? null
}

export function listSessions(): ObservationSession[] {
  return Object.values(readStore()).sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  )
}

export function deleteSessionsBySchemaId(schemaId: string): void {
  const store = readStore()
  for (const id of Object.keys(store)) {
    if (store[id].schemaId === schemaId) delete store[id]
  }
  writeStore(store)
}

export function countSessionsBySchemaId(schemaId: string): number {
  return Object.values(readStore()).filter(s => s.schemaId === schemaId).length
}
