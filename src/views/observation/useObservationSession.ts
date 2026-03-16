import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { BehaviorSchemaRecord, SimpleUserBehaviorEvent } from '@/lib/schema/types'
import type { ObservationEntry, ObservationSession } from '@/lib/observation/types'
import { saveSession } from '@/lib/observation/repository'

export function useObservationSession(schema: BehaviorSchemaRecord) {
  // Stable identity for this session — created once on mount.
  const sessionId = useRef(crypto.randomUUID()).current
  const startedAt = useRef(new Date().toISOString() as ISODateString).current
  const schemaVersion = useRef(schema.version.absolute).current
  const timezone = useRef(Intl.DateTimeFormat().resolvedOptions().timeZone).current
  const isEndedRef = useRef(false)

  const [observations, setObservations] = useState<ObservationEntry[]>([])
  const [taggingBehaviorId, setTaggingBehaviorId] = useState<string | null>(null)

  // Keep a ref in sync so the beforeunload handler always sees fresh data.
  const observationsRef = useRef(observations)
  useEffect(() => { observationsRef.current = observations }, [observations])

  // Warn the user before navigating away mid-session and auto-save what we have.
  useEffect(() => {
    const schemaId = schema.name.id

    const handler = (e: BeforeUnloadEvent) => {
      if (observationsRef.current.length > 0 && !isEndedRef.current) {
        saveSession({
          id: sessionId,
          schemaId,
          schemaVersion,
          timezone,
          startedAt,
          observations: observationsRef.current,
        })
        e.preventDefault()
        // Legacy support — some browsers still check returnValue.
        e.returnValue = ''
      }
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [schema.name.id, sessionId, startedAt])

  const eventsById = useMemo(() => {
    const map: Record<string, SimpleUserBehaviorEvent> = {}
    for (const event of schema.events) map[event.id] = event
    return map
  }, [schema.events])

  const taggingBehavior: SimpleUserBehaviorEvent | null =
    taggingBehaviorId ? (eventsById[taggingBehaviorId] ?? null) : null

  const trackBehavior = useCallback(
    (behaviorId: string) => {
      const event = eventsById[behaviorId]
      if (!event) return

      if (event.tags && event.tags.length > 0) {
        setTaggingBehaviorId(behaviorId)
      } else {
        setObservations(prev => [
          ...prev,
          { behaviorId, timestamp: new Date().toISOString() as ISODateString },
        ])
      }
    },
    [eventsById],
  )

  const trackTag = useCallback((behaviorId: string, tagId: string) => {
    setObservations(prev => [
      ...prev,
      { behaviorId, tagId, timestamp: new Date().toISOString() as ISODateString },
    ])
    setTaggingBehaviorId(null)
  }, [])

  const cancelTagging = useCallback(() => setTaggingBehaviorId(null), [])

  const undoLast = useCallback(() => {
    setObservations(prev => prev.slice(0, -1))
  }, [])

  const endSession = useCallback((): ObservationSession => {
    isEndedRef.current = true
    const session: ObservationSession = {
      id: sessionId,
      schemaId: schema.name.id,
      schemaVersion,
      timezone,
      startedAt,
      endedAt: new Date().toISOString() as ISODateString,
      observations: observationsRef.current,
    }
    saveSession(session)
    return session
  }, [schema.name.id, schemaVersion, timezone, sessionId, startedAt])

  return {
    observations,
    taggingBehavior,
    trackBehavior,
    trackTag,
    cancelTagging,
    undoLast,
    endSession,
    startedAt,
  }
}
