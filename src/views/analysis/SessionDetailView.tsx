import { useParams } from 'react-router-dom'
import { Screen } from '@/components/Screen'
import { SessionRingChart } from '@/components/SessionRingChart/SessionRingChart'
import { SessionStats } from '@/components/SessionStats/SessionStats'
import { SessionObservationTable } from '@/components/SessionObservationTable/SessionObservationTable'
import { loadSession } from '@/lib/observation/repository'
import { loadSchema } from '@/lib/schema/repository'
import { computeSessionRollup } from '@/lib/analysis/session'
import { ROUTES } from '@/routes'
import styles from './SessionDetailView.module.css'

export function SessionDetailView() {
  const { id } = useParams<{ id: string }>()
  const session = id ? loadSession(id) : null
  const schema = session ? loadSchema(session.schemaId) : null

  if (!session || !schema) {
    return (
      <Screen title="Session" backTo={ROUTES.analysis}>
        <p className={styles.empty}>Session not found.</p>
      </Screen>
    )
  }

  const rollup = computeSessionRollup(session, schema)
  const date = new Date(session.startedAt)

  return (
    <Screen title={schema.name.name} backTo={ROUTES.analysis}>
      <div className={styles.content}>
        <p className={styles.date}>
          {date.toLocaleDateString(undefined, { dateStyle: 'long' })}
          {' · '}
          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          {!session.endedAt && ' · incomplete'}
        </p>

        <SessionRingChart rollup={rollup} />
        <SessionObservationTable rollup={rollup} />
        <SessionStats rollup={rollup} />
      </div>
    </Screen>
  )
}
