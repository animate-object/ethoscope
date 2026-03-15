import { useLocation, useNavigate } from 'react-router-dom'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/ui/button'
import { loadSession } from '@/lib/observation/repository'
import { loadSchema } from '@/lib/schema/repository'
import { POST_SESSION_DESTINATIONS } from '@/routes'
import styles from './SessionCompleteView.module.css'

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) return `${h}h ${String(m).padStart(2, '0')}m`
  if (m > 0) return `${m}m ${String(s).padStart(2, '0')}s`
  return `${s}s`
}

export function SessionCompleteView() {
  const location = useLocation()
  const navigate = useNavigate()

  const sessionId = location.state?.sessionId as string | undefined
  const session = sessionId ? loadSession(sessionId) : null
  const schema = session ? loadSchema(session.schemaId) : null

  const durationSeconds =
    session?.endedAt && session?.startedAt
      ? Math.round(
          (new Date(session.endedAt).getTime() - new Date(session.startedAt).getTime()) / 1000,
        )
      : null

  return (
    <Screen
      title="Session Complete"
      actions={
        <div className={styles.actions}>
          <Button
            className="w-full"
            onClick={() => navigate(POST_SESSION_DESTINATIONS.primary)}
          >
            Go Home
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => navigate(POST_SESSION_DESTINATIONS.secondary)}
          >
            View Analysis
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        {schema && <p className={styles.schemaName}>{schema.name.name}</p>}

        <div className={styles.stats}>
          {durationSeconds !== null && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{formatDuration(durationSeconds)}</span>
              <span className={styles.statLabel}>Duration</span>
            </div>
          )}
          {session && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{session.observations.length}</span>
              <span className={styles.statLabel}>Observations</span>
            </div>
          )}
        </div>
      </div>
    </Screen>
  )
}
