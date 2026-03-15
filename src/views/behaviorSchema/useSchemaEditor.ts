import { useCallback, useState } from 'react'
import { deleteSchema, saveSchema } from '../../lib/schema/repository'
import {
  MAX_EVENTS,
  MAX_TAGS,
  type BehaviorSchemaRecord,
  type KnownSchemaEvents,
  type SimpleUserDefinedSchemaValue,
} from '../../lib/schema/types'
import { generateHue } from '../../lib/color'
import { bumpVersion, createEvent, createSchema, createTag } from '../../lib/schema/utils'

type EditorState =
  | { phase: 'naming' }
  | { phase: 'editing'; schema: BehaviorSchemaRecord; dirty: boolean }

export function useSchemaEditor(initial?: BehaviorSchemaRecord) {
  const [state, setState] = useState<EditorState>(
    initial ? { phase: 'editing', schema: initial, dirty: false } : { phase: 'naming' },
  )

  // ── Naming phase ──────────────────────────────────────────────────────────

  const submitName = useCallback((name: string) => {
    setState({ phase: 'editing', schema: createSchema(name), dirty: true })
  }, [])

  // ── Editing helpers ───────────────────────────────────────────────────────

  function mutate(updater: (schema: BehaviorSchemaRecord) => BehaviorSchemaRecord) {
    setState(prev => {
      if (prev.phase !== 'editing') return prev
      return { phase: 'editing', schema: updater(prev.schema), dirty: true }
    })
  }

  // ── Events ────────────────────────────────────────────────────────────────

  const addEvent = useCallback((name: string) => {
    mutate(s => {
      if (s.events.length >= MAX_EVENTS) return s
      return { ...s, events: [...s.events, createEvent(name)] }
    })
  }, [])

  const removeEvent = useCallback((eventId: string) => {
    mutate(s => ({ ...s, events: s.events.filter(e => e.id !== eventId) }))
  }, [])

  const updateEventName = useCallback((eventId: string, name: string) => {
    mutate(s => ({
      ...s,
      events: s.events.map(e => (e.id === eventId ? { ...e, name } : e)),
    }))
  }, [])

  const moveEvent = useCallback((fromIndex: number, toIndex: number) => {
    mutate(s => {
      const events = [...s.events] as KnownSchemaEvents[]
      const [moved] = events.splice(fromIndex, 1)
      events.splice(toIndex, 0, moved)
      return { ...s, events }
    })
  }, [])

  const rerollEventColor = useCallback((eventId: string) => {
    mutate(s => ({
      ...s,
      events: s.events.map(e => (e.id === eventId ? { ...e, colorHue: generateHue() } : e)),
    }))
  }, [])

  // ── Tags ──────────────────────────────────────────────────────────────────

  const addTag = useCallback((eventId: string, name: string) => {
    mutate(s => ({
      ...s,
      events: s.events.map(e => {
        if (e.id !== eventId) return e
        if ((e.tags ?? []).length >= MAX_TAGS) return e
        return { ...e, tags: [...(e.tags ?? []), createTag(name)] }
      }),
    }))
  }, [])

  const removeTag = useCallback((eventId: string, tagId: string) => {
    mutate(s => ({
      ...s,
      events: s.events.map(e =>
        e.id === eventId
          ? {
              ...e,
              tags: (e.tags ?? []).filter((t: SimpleUserDefinedSchemaValue) => t.id !== tagId),
            }
          : e,
      ),
    }))
  }, [])

  const updateTagName = useCallback((eventId: string, tagId: string, name: string) => {
    mutate(s => ({
      ...s,
      events: s.events.map(e =>
        e.id === eventId
          ? {
              ...e,
              tags: (e.tags ?? []).map((t: SimpleUserDefinedSchemaValue) =>
                t.id === tagId ? { ...t, name } : t,
              ),
            }
          : e,
      ),
    }))
  }, [])

  // ── Persistence ───────────────────────────────────────────────────────────

  const save = useCallback(() => {
    setState(prev => {
      if (prev.phase !== 'editing') return prev
      const saved = bumpVersion(prev.schema)
      saveSchema(saved)
      return { phase: 'editing', schema: saved, dirty: false }
    })
  }, [])

  const discard = useCallback((id: string) => {
    deleteSchema(id)
  }, [])

  return {
    state,
    submitName,
    addEvent,
    removeEvent,
    updateEventName,
    moveEvent,
    rerollEventColor,
    addTag,
    removeTag,
    updateTagName,
    save,
    discard,
  }
}
