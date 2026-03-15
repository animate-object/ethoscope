import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { loadSchema } from '@/lib/schema/repository'
import type { BehaviorSchemaRecord } from '@/lib/schema/types'
import { ROUTES } from '@/routes'
import { useObservationSession } from './useObservationSession'
import { BehaviorGrid } from './BehaviorGrid'
import { TaggingView } from './TaggingView'
import { SessionBottomBar } from './SessionBottomBar'
import styles from './ObservationView.module.css'

/**
 * Active observation session screen.
 *
 * Does not use the Screen component — the behavior grid must fill all available
 * space without scroll or header overhead. Navigation is intentionally removed
 * to reduce accidental exits; the only exit paths are End Session (longpress)
 * and the browser's own back gesture (which triggers beforeunload auto-save).
 */
export function ObservationView() {
  const { schemaId } = useParams<{ schemaId: string }>()
  const schema = schemaId ? loadSchema(schemaId) : null

  if (!schema) return <Navigate to={ROUTES.observationNew} replace />

  return <ActiveSession schema={schema} />
}

// Split so hooks are never called conditionally.
function ActiveSession({ schema }: { schema: BehaviorSchemaRecord }) {
  const navigate = useNavigate()
  const {
    observations,
    taggingBehavior,
    trackBehavior,
    trackTag,
    cancelTagging,
    undoLast,
    endSession,
    startedAt,
  } = useObservationSession(schema)

  function handleEnd() {
    const session = endSession()
    navigate(ROUTES.observationComplete, { state: { sessionId: session.id } })
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <BehaviorGrid
          events={schema.events}
          observations={observations}
          onBehavior={trackBehavior}
        />
      </div>

      <SessionBottomBar
        startedAt={startedAt}
        onEnd={handleEnd}
        onUndo={undoLast}
        canUndo={observations.length > 0}
      />

      {taggingBehavior && (
        <TaggingView
          behavior={taggingBehavior}
          observations={observations}
          onTag={tagId => trackTag(taggingBehavior.id, tagId)}
          onCancel={cancelTagging}
        />
      )}
    </div>
  )
}
