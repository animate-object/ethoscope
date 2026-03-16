import type { BehaviorSchemaRecord } from '@/lib/schema/types'
import type { ObservationSession } from '@/lib/observation/types'
import { listSchemas, saveSchema } from '@/lib/schema/repository'
import { listSessions, saveSession } from '@/lib/observation/repository'
import type { EthoscopeExport } from './export'

export interface ImportResult {
  schemasAdded: number
  schemasUpdated: number
  sessionsAdded: number
}

function isValidExport(data: unknown): data is EthoscopeExport {
  if (typeof data !== 'object' || data === null) return false
  const d = data as Record<string, unknown>
  return d.exportVersion === 1 && Array.isArray(d.schemas) && Array.isArray(d.sessions)
}

function isValidSchema(s: unknown): s is BehaviorSchemaRecord {
  if (typeof s !== 'object' || s === null) return false
  const sc = s as Record<string, unknown>
  const version = sc.version as Record<string, unknown> | null
  const name = sc.name as Record<string, unknown> | null
  return (
    typeof sc.schemaDefinitionSpecVersion === 'number' &&
    typeof version?.absolute === 'number' &&
    typeof name?.id === 'string' &&
    Array.isArray(sc.events)
  )
}

function isValidSession(s: unknown): s is ObservationSession {
  if (typeof s !== 'object' || s === null) return false
  const se = s as Record<string, unknown>
  return (
    typeof se.id === 'string' &&
    typeof se.schemaId === 'string' &&
    typeof se.startedAt === 'string' &&
    Array.isArray(se.observations)
  )
}

export function importData(raw: string): ImportResult {
  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    throw new Error('Invalid JSON file')
  }

  if (!isValidExport(parsed)) {
    throw new Error('File does not appear to be an Ethoscope export')
  }

  // Validate all items before writing anything (all-or-nothing).
  for (const schema of parsed.schemas) {
    if (!isValidSchema(schema)) throw new Error('Export contains an invalid schema record')
  }
  for (const session of parsed.sessions) {
    if (!isValidSession(session)) throw new Error('Export contains an invalid session record')
  }

  const existingSchemas = Object.fromEntries(listSchemas().map(s => [s.name.id, s]))
  const existingSessions = new Set(listSessions().map(s => s.id))

  let schemasAdded = 0
  let schemasUpdated = 0
  let sessionsAdded = 0

  for (const schema of parsed.schemas) {
    const existing = existingSchemas[schema.name.id]
    if (!existing) {
      saveSchema(schema)
      schemasAdded++
    } else if (schema.version.absolute > existing.version.absolute) {
      saveSchema(schema)
      schemasUpdated++
    }
    // Same or older version — skip.
  }

  for (const session of parsed.sessions) {
    if (!existingSessions.has(session.id)) {
      saveSession(session)
      sessionsAdded++
    }
    // Already exists — skip.
  }

  return { schemasAdded, schemasUpdated, sessionsAdded }
}
