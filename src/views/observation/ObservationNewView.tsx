import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '@/components/Screen'
import { listSchemas } from '@/lib/schema/repository'
import type { BehaviorSchemaRecord } from '@/lib/schema/types'
import { ROUTES } from '@/routes'
import styles from './ObservationNewView.module.css'

export function ObservationNewView() {
  const navigate = useNavigate()
  const [schemas, setSchemas] = useState<BehaviorSchemaRecord[]>([])

  useEffect(() => {
    setSchemas(listSchemas())
  }, [])

  return (
    <Screen title="New Session" backTo={ROUTES.home}>
      {schemas.length === 0 ? (
        <p className={styles.empty}>
          No schemas yet — create a behavior schema first.
        </p>
      ) : (
        <ul className={styles.list}>
          {schemas.map(schema => (
            <li key={schema.name.id}>
              <button
                type="button"
                className={styles.schemaItem}
                onClick={() => navigate(ROUTES.observationSession(schema.name.id))}
              >
                {schema.name.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </Screen>
  )
}
