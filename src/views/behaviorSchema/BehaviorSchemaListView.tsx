import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Screen } from '../../components/Screen'
import { Modal } from '@/components/Modal/Modal'
import { LongPressButton } from '@/components/LongPressButton/LongPressButton'
import { listSchemas, deleteSchema } from '@/lib/schema/repository'
import { deleteSessionsBySchemaId, countSessionsBySchemaId } from '@/lib/observation/repository'
import type { BehaviorSchemaRecord } from '@/lib/schema/types'
import { ROUTES } from '@/routes'
import styles from './BehaviorSchemaListView.module.css'

interface DeleteTarget {
  schema: BehaviorSchemaRecord
  sessionCount: number
}

export function BehaviorSchemaListView() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [schemas, setSchemas] = useState<BehaviorSchemaRecord[]>([])
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)

  useEffect(() => {
    setSchemas(listSchemas())
  }, [])

  const openDeleteModal = (schema: BehaviorSchemaRecord) => {
    setDeleteTarget({
      schema,
      sessionCount: countSessionsBySchemaId(schema.name.id),
    })
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteSessionsBySchemaId(deleteTarget.schema.name.id)
    deleteSchema(deleteTarget.schema.name.id)
    setSchemas(prev => prev.filter(s => s.name.id !== deleteTarget.schema.name.id))
    setDeleteTarget(null)
  }

  const newAction = (
    <Button className="w-full" onClick={() => navigate(ROUTES.behaviorSchema)}>
      {t('home.nav.newBehaviorSchema')}
    </Button>
  )

  return (
    <Screen title={t('behaviorSchemaList.title')} backTo={ROUTES.home} actions={newAction}>
      <ul className={styles.list}>
        {schemas.map(schema => (
          <li key={schema.name.id} className={styles.item}>
            <button
              type="button"
              className={styles.schemaButton}
              onClick={() => navigate(ROUTES.behaviorSchemaEdit(schema.name.id))}
            >
              <span className={styles.schemaName}>{schema.name.name}</span>
              <span className={styles.schemaId}>{schema.name.id.slice(0, 8)}</span>
            </button>
            <button
              type="button"
              className={styles.deleteButton}
              onClick={() => openDeleteModal(schema)}
              aria-label={`Delete ${schema.name.name}`}
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>

      {deleteTarget && (
        <Modal onClose={() => setDeleteTarget(null)}>
          <p className={styles.modalTitle}>{t('behaviorSchemaList.deleteModal.title')}</p>
          <p className={styles.modalBody}>
            This will permanently delete{' '}
            <strong>{deleteTarget.schema.name.name}</strong> and all{' '}
            <strong>{deleteTarget.sessionCount}</strong>{' '}
            associated {deleteTarget.sessionCount === 1 ? 'session' : 'sessions'}.
          </p>
          <div className={styles.modalActions}>
            <LongPressButton
              className={styles.deleteConfirm}
              duration={2000}
              onComplete={handleDelete}
              hintText="hold to confirm"
            >
              {t('behaviorSchemaList.deleteModal.confirm')}
            </LongPressButton>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setDeleteTarget(null)}
            >
              {t('behaviorSchemaList.deleteModal.cancel')}
            </button>
          </div>
        </Modal>
      )}
    </Screen>
  )
}
