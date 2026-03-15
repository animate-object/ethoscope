import { useState } from 'react'
import { Screen } from '@/components/Screen'
import { listSessions } from '@/lib/observation/repository'
import { loadSchema } from '@/lib/schema/repository'
import type { ObservationSession } from '@/lib/observation/types'
import styles from './AnalysisView.module.css'

export function AnalysisView() {
  const sessions = listSessions()
  const [selected, setSelected] = useState<ObservationSession | null>(null)

  if (selected) {
    return (
      <Screen title="Session Data">
        <div className={styles.detailHeader}>
          <button
            type="button"
            className={styles.backButton}
            onClick={() => setSelected(null)}
          >
            ← Back
          </button>
        </div>
        <pre className={styles.json}>{JSON.stringify(selected, null, 2)}</pre>
      </Screen>
    )
  }

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
                  onClick={() => setSelected(session)}
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
