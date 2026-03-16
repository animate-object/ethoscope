import type { ObservationSession } from '@/lib/observation/types'
import type { BehaviorSchemaRecord } from '@/lib/schema/types'

export interface TagSummary {
  tagId: string | null // null = untagged observations on a taggable behavior
  name: string
  count: number
  colorHue: number   // inherited from parent behavior
  colorIndex: number // position within behavior's tag list (for tagColor())
  colorTotal: number // total tag slots in that behavior (for tagColor())
}

export interface BehaviorSummary {
  behaviorId: string
  name: string
  colorHue: number
  count: number
  tags: TagSummary[] // empty if behavior has no tags defined
}

export interface SessionRollup {
  durationSeconds: number | null
  totalObservations: number
  ratePerMinute: number | null
  longestGapSeconds: number | null
  behaviors: BehaviorSummary[] // schema order, zero-count behaviors omitted
}

export function computeSessionRollup(
  session: ObservationSession,
  schema: BehaviorSchemaRecord,
): SessionRollup {
  const durationSeconds =
    session.endedAt
      ? Math.round(
          (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000,
        )
      : null

  const totalObservations = session.observations.length

  const ratePerMinute =
    durationSeconds && durationSeconds > 0
      ? Math.round((totalObservations / durationSeconds) * 60 * 10) / 10
      : null

  let longestGapSeconds: number | null = null
  if (session.observations.length >= 2) {
    const timestamps = session.observations.map(o => new Date(o.timestamp).getTime())
    for (let i = 1; i < timestamps.length; i++) {
      const gap = Math.round((timestamps[i] - timestamps[i - 1]) / 1000)
      if (longestGapSeconds === null || gap > longestGapSeconds) longestGapSeconds = gap
    }
  }

  // Tally counts per behavior and per tag.
  const UNTAGGED = '__untagged__'
  const behaviorCounts: Record<string, number> = {}
  const tagCounts: Record<string, Record<string, number>> = {}

  for (const obs of session.observations) {
    behaviorCounts[obs.behaviorId] = (behaviorCounts[obs.behaviorId] ?? 0) + 1
    if (!tagCounts[obs.behaviorId]) tagCounts[obs.behaviorId] = {}
    const key = obs.tagId ?? UNTAGGED
    tagCounts[obs.behaviorId][key] = (tagCounts[obs.behaviorId][key] ?? 0) + 1
  }

  // Build summaries in schema order, skipping zero-count behaviors.
  const behaviors: BehaviorSummary[] = []

  for (const event of schema.events) {
    const count = behaviorCounts[event.id] ?? 0
    if (count === 0) continue

    const bc = tagCounts[event.id] ?? {}
    const definedTags = event.tags ?? []
    const hasTags = definedTags.length > 0
    const tags: TagSummary[] = []

    if (hasTags) {
      for (let i = 0; i < definedTags.length; i++) {
        const tag = definedTags[i]
        const tagCount = bc[tag.id] ?? 0
        if (tagCount === 0) continue
        tags.push({
          tagId: tag.id,
          name: tag.name,
          count: tagCount,
          colorHue: event.colorHue,
          colorIndex: i,
          colorTotal: definedTags.length,
        })
      }
      const untaggedCount = bc[UNTAGGED] ?? 0
      if (untaggedCount > 0) {
        tags.push({
          tagId: null,
          name: 'Untagged',
          count: untaggedCount,
          colorHue: event.colorHue,
          colorIndex: definedTags.length,
          colorTotal: definedTags.length + 1,
        })
      }
    }

    behaviors.push({ behaviorId: event.id, name: event.name, colorHue: event.colorHue, count, tags })
  }

  return { durationSeconds, totalObservations, ratePerMinute, longestGapSeconds, behaviors }
}

export function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}
