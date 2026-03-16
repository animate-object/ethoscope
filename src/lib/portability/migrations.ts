import { listSessions, saveSession } from '@/lib/observation/repository'
import { listSchemas } from '@/lib/schema/repository'

export interface BackfillResult {
  sessionsScanned: number
  sessionsPatched: number
}

/**
 * Backfills `timezone` and `schemaVersion` on sessions recorded before those
 * fields were added to the data model.
 *
 * - timezone  → device's current IANA timezone
 * - schemaVersion → latest version.absolute of the session's schema
 *
 * Sessions that already have both fields are left untouched.
 */
export function backfillSessionMetadata(): BackfillResult {
  const sessions = listSessions()
  const schemaMap = Object.fromEntries(listSchemas().map(s => [s.name.id, s]))
  const deviceTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  let sessionsPatched = 0

  for (const session of sessions) {
    // Cast to access fields that may be absent on pre-migration data.
    const raw = session as unknown as Record<string, unknown>
    const needsTimezone = raw.timezone === undefined
    const needsSchemaVersion = raw.schemaVersion === undefined

    if (!needsTimezone && !needsSchemaVersion) continue

    const patched = { ...session }

    if (needsTimezone) {
      patched.timezone = deviceTimezone
    }

    if (needsSchemaVersion) {
      const schema = schemaMap[session.schemaId]
      if (schema) {
        patched.schemaVersion = schema.version.absolute
      }
    }

    saveSession(patched)
    sessionsPatched++
  }

  return { sessionsScanned: sessions.length, sessionsPatched }
}
