import type { SimpleUserBehaviorEvent } from '@/lib/schema/types'
import type { ObservationEntry } from '@/lib/observation/types'
import { eventColor, tagColor } from '@/lib/color'
import styles from './TaggingView.module.css'

interface Props {
  behavior: SimpleUserBehaviorEvent
  observations: ObservationEntry[]
  onTag: (tagId: string) => void
  onCancel: () => void
}

/**
 * Full-screen modal for tracking a tagged behavior.
 *
 * Shows one spanning button per tag (colored by tag tone) with its own
 * observation count, plus a cancel button. Mounts on top of the behavior grid.
 */
export function TaggingView({ behavior, observations, onTag, onCancel }: Props) {
  const tags = behavior.tags ?? []

  // Count tagged observations for this behavior
  const tagCounts: Record<string, number> = {}
  for (const obs of observations) {
    if (obs.behaviorId === behavior.id && obs.tagId) {
      tagCounts[obs.tagId] = (tagCounts[obs.tagId] ?? 0) + 1
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.header}>
        <span
          className={styles.behaviorLabel}
          style={{ color: eventColor(behavior.colorHue) }}
        >
          {behavior.name}
        </span>
      </div>

      <div className={styles.tags}>
        {tags.map((tag, index) => {
          const count = tagCounts[tag.id] ?? 0
          return (
            <button
              key={tag.id}
              type="button"
              className={styles.tagButton}
              style={{ backgroundColor: tagColor(behavior.colorHue, index, tags.length) }}
              onClick={() => onTag(tag.id)}
            >
              <span className={styles.tagName}>{tag.name}</span>
              {count > 0 && <span className={styles.badge}>{count}</span>}
            </button>
          )
        })}
      </div>

      <button type="button" className={styles.cancelButton} onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}
