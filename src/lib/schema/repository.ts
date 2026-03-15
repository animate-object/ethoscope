import type { BehaviorSchemaRecord } from './types'

const STORAGE_KEY = 'ethoscope:schemas'

function readStore(): Record<string, BehaviorSchemaRecord> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Record<string, BehaviorSchemaRecord>) : {}
  } catch {
    return {}
  }
}

function writeStore(store: Record<string, BehaviorSchemaRecord>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
}

export function saveSchema(schema: BehaviorSchemaRecord): void {
  const store = readStore()
  store[schema.name.id] = schema
  writeStore(store)
}

export function loadSchema(id: string): Maybe<BehaviorSchemaRecord> {
  return readStore()[id] ?? null
}

export function listSchemas(): BehaviorSchemaRecord[] {
  return Object.values(readStore())
}

export function deleteSchema(id: string): void {
  const store = readStore()
  delete store[id]
  writeStore(store)
}
