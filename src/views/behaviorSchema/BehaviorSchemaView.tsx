import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Screen } from '../../components/Screen'
import { loadSchema } from '@/lib/schema/repository'
import { ROUTES } from '@/routes'
import { useSchemaEditor } from './useSchemaEditor'
import { SchemaNameStep } from './SchemaNameStep'
import { EventList } from './EventList'

export function BehaviorSchemaView() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const initial = id ? (loadSchema(id) ?? undefined) : undefined
  const editor = useSchemaEditor(initial)
  const { state } = editor

  const title =
    state.phase === 'editing' ? state.schema.name.name : t('behaviorSchema.title')

  const saveAction =
    state.phase === 'editing' ? (
      <Button className="w-full" onClick={editor.save} disabled={!state.dirty}>
        {state.dirty ? t('behaviorSchema.editor.save') : t('behaviorSchema.editor.saved')}
      </Button>
    ) : undefined

  const backTo = id ? ROUTES.behaviorSchemas : ROUTES.home

  return (
    <Screen title={title} backTo={backTo} actions={saveAction}>
      {state.phase === 'naming' && <SchemaNameStep onSubmit={editor.submitName} />}

      {state.phase === 'editing' && (
        <>
          {state.dirty && (
            <p className="text-xs opacity-50 mb-3">{t('behaviorSchema.editor.unsavedChanges')}</p>
          )}
          <EventList
            events={state.schema.events}
            onAdd={editor.addEvent}
            onRemove={editor.removeEvent}
            onUpdateName={editor.updateEventName}
            onRerollColor={editor.rerollEventColor}
            onMove={editor.moveEvent}
            onAddTag={editor.addTag}
            onRemoveTag={editor.removeTag}
          />
        </>
      )}
    </Screen>
  )
}
