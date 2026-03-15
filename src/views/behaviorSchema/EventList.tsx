import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MAX_EVENTS, type KnownSchemaEvents } from '../../lib/schema/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { EventItem } from './EventItem'

interface Props {
  events: KnownSchemaEvents[]
  onAdd: (name: string) => void
  onRemove: (eventId: string) => void
  onUpdateName: (eventId: string, name: string) => void
  onRerollColor: (eventId: string) => void
  onMove: (fromIndex: number, toIndex: number) => void
  onAddTag: (eventId: string, name: string) => void
  onRemoveTag: (eventId: string, tagId: string) => void
}

export function EventList({
  events,
  onAdd,
  onRemove,
  onUpdateName,
  onRerollColor,
  onMove,
  onAddTag,
  onRemoveTag,
}: Props) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const atLimit = events.length >= MAX_EVENTS

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed && !atLimit) {
      onAdd(trimmed)
      setInput('')
    }
  }

  return (
    <section className="w-full max-w-xl">
      <h3 className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-3">
        {t('behaviorSchema.editor.eventsHeading')}
      </h3>

      <ul className="flex flex-col gap-2 mb-3 list-none p-0 m-0">
        {events.map((event, index) => (
          <EventItem
            key={event.id}
            event={event}
            index={index}
            total={events.length}
            onMove={onMove}
            onRemove={onRemove}
            onUpdateName={onUpdateName}
            onRerollColor={onRerollColor}
            onAddTag={onAddTag}
            onRemoveTag={(eventId, tagId) => onRemoveTag(eventId, tagId)}
          />
        ))}
      </ul>

      {atLimit ? (
        <p className="text-sm opacity-50">
          {t('behaviorSchema.editor.eventLimitReached', { max: MAX_EVENTS })}
        </p>
      ) : (
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('behaviorSchema.editor.addEventPlaceholder')}
          />
          <Button type="submit" disabled={!input.trim()}>
            {t('behaviorSchema.editor.addEventButton')}
          </Button>
        </form>
      )}
    </section>
  )
}
