import { useLocation, useNavigate } from 'react-router-dom'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/ui/button'
import { SessionStats } from '@/components/SessionStats/SessionStats'
import { loadSession } from '@/lib/observation/repository'
import { loadSchema } from '@/lib/schema/repository'
import { computeSessionRollup } from '@/lib/analysis/session'
import { POST_SESSION_DESTINATIONS, ROUTES } from '@/routes'
import styles from './SessionCompleteView.module.css'

export function SessionCompleteView() {
  const location = useLocation()
  const navigate = useNavigate()

  const sessionId = location.state?.sessionId as string | undefined
  const session = sessionId ? loadSession(sessionId) : null
  const schema = session ? loadSchema(session.schemaId) : null
  const rollup = session && schema ? computeSessionRollup(session, schema) : null

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
            onClick={() =>
              navigate(
                sessionId
                  ? ROUTES.analysisSession(sessionId)
                  : POST_SESSION_DESTINATIONS.secondary,
              )
            }
          >
            View Session
          </Button>
        </div>
      }
    >
      <div className={styles.content}>
        {schema && <p className={styles.schemaName}>{schema.name.name}</p>}
        {rollup && <SessionStats rollup={rollup} />}
      </div>
    </Screen>
  )
}
