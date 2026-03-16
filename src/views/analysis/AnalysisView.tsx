import { useNavigate } from 'react-router-dom'
import { Screen } from '@/components/Screen'
import { listSessions } from '@/lib/observation/repository'
import { loadSchema } from '@/lib/schema/repository'
import { ROUTES } from '@/routes'
import styles from './AnalysisView.module.css'

export function AnalysisView() {
  const navigate = useNavigate()
  const sessions = listSessions()

  return (
    <Screen title="Analysis" backTo="/">
      {sessions.length === 0 ? (
        <p className={styles.empty}>No sessions recorded yet.</p>
      ) : (
        <ul className={styles.list}>
          {sessions.map(session => {
            const schema = loadSchema(session.schemaId)
            const date = new Date(session.startedAt)
            return (
              <li key={session.id}>
                <button
                  type="button"
                  className={styles.sessionItem}
                  onClick={() => navigate(ROUTES.analysisSession(session.id))}
                >
                  <span className={styles.sessionName}>
                    {schema?.name.name ?? 'Unknown schema'}
                  </span>
                  <span className={styles.sessionMeta}>
                    {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {' · '}
                    {session.observations.length} obs
                    {!session.endedAt && ' · incomplete'}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </Screen>
  )
}
