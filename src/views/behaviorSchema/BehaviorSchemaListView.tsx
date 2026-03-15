import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Screen } from '../../components/Screen'
import { listSchemas } from '@/lib/schema/repository'
import type { BehaviorSchemaRecord } from '@/lib/schema/types'
import { ROUTES } from '@/routes'
import styles from '../observation/ObservationNewView.module.css'

export function BehaviorSchemaListView() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [schemas, setSchemas] = useState<BehaviorSchemaRecord[]>([])

  useEffect(() => {
    setSchemas(listSchemas())
  }, [])

  const newAction = (
    <Button className="w-full" onClick={() => navigate(ROUTES.behaviorSchema)}>
      {t('home.nav.newBehaviorSchema')}
    </Button>
  )

  return (
    <Screen title={t('behaviorSchemaList.title')} backTo={ROUTES.home} actions={newAction}>
      <ul className={styles.list}>
        {schemas.map(schema => (
          <li key={schema.name.id}>
            <button
              type="button"
              className={styles.schemaItem}
              onClick={() => navigate(ROUTES.behaviorSchemaEdit(schema.name.id))}
            >
              {schema.name.name}
            </button>
          </li>
        ))}
      </ul>
    </Screen>
  )
}
