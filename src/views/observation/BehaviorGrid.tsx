import type { SimpleUserBehaviorEvent } from '@/lib/schema/types'
import type { ObservationEntry } from '@/lib/observation/types'
import { eventColor } from '@/lib/color'
import styles from './BehaviorGrid.module.css'

interface Props {
  events: SimpleUserBehaviorEvent[]
  observations: ObservationEntry[]
  onBehavior: (behaviorId: string) => void
}

/**
 * Touch-optimised grid of behavior buttons.
 *
 * Layout follows the spec exactly — order is always schema-defined so the
 * user can build reliable muscle memory:
 *   1  → single spanning button
 *   2–3 → stacked single-column buttons
 *   4,6 → 2-column grid
 *   5   → 2-column grid, 5th button spans both columns
 */
export function BehaviorGrid({ events, observations, onBehavior }: Props) {
  // Observation count per behavior (tags not shown here per spec)
  const counts: Record<string, number> = {}
  for (const obs of observations) {
    counts[obs.behaviorId] = (counts[obs.behaviorId] ?? 0) + 1
  }

  const useTwoColumns = events.length >= 5

  return (
    <div
      className={styles.grid}
      style={{ gridTemplateColumns: useTwoColumns ? '1fr 1fr' : '1fr' }}
    >
      {events.map((event, index) => {
        const spanning = events.length === 5 && index === 4
        const count = counts[event.id] ?? 0

        return (
          <button
            key={event.id}
            type="button"
            className={styles.behaviorButton}
            style={{
              backgroundColor: eventColor(event.colorHue),
              gridColumn: spanning ? 'span 2' : undefined,
            }}
            onClick={() => onBehavior(event.id)}
          >
            <span className={styles.name}>{event.name}</span>
            {count > 0 && <span className={styles.badge}>{count}</span>}
          </button>
        )
      })}
    </div>
  )
}
