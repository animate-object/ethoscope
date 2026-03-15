import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Shuffle, Trash2 } from 'lucide-react'
import { eventColor, eventColorTint } from '../../lib/color'
import type { SimpleUserBehaviorEvent, SimpleUserDefinedSchemaValue } from '../../lib/schema/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TagList } from './TagList'
import styles from './EventItem.module.css'

interface Props {
  event: SimpleUserBehaviorEvent
  index: number
  total: number
  onMove: (fromIndex: number, toIndex: number) => void
  onRemove: (eventId: string) => void
  onUpdateName: (eventId: string, name: string) => void
  onRerollColor: (eventId: string) => void
  onAddTag: (eventId: string, name: string) => void
  onRemoveTag: (eventId: string, tagId: string) => void
}

export function EventItem({
  event,
  index,
  total,
  onMove,
  onRemove,
  onUpdateName,
  onRerollColor,
  onAddTag,
  onRemoveTag,
}: Props) {
  const { t } = useTranslation()
  const [editing, setEditing] = useState(false)
  const [nameInput, setNameInput] = useState(event.name)
  const [expanded, setExpanded] = useState(false)

  const color = eventColor(event.colorHue)
  const tint = eventColorTint(event.colorHue)

  function commitName() {
    const trimmed = nameInput.trim()
    if (trimmed && trimmed !== event.name) onUpdateName(event.id, trimmed)
    else setNameInput(event.name)
    setEditing(false)
  }

  return (
    <li className={styles.item} style={{ borderLeftColor: color, backgroundColor: tint }}>
      <div className="flex items-center gap-2">
        {/* Reorder controls */}
        <div className="flex flex-col">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-11 opacity-40 hover:opacity-100 disabled:opacity-15"
            aria-label={t('behaviorSchema.editor.moveUp')}
            disabled={index === 0}
            onClick={() => onMove(index, index - 1)}
          >
            ▲
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-5 w-11 opacity-40 hover:opacity-100 disabled:opacity-15"
            aria-label={t('behaviorSchema.editor.moveDown')}
            disabled={index === total - 1}
            onClick={() => onMove(index, index + 1)}
          >
            ▼
          </Button>
        </div>

        {/* Color swatch — custom: dynamically colored */}
        <div className={styles.swatch} style={{ backgroundColor: color }}>
          <button
            type="button"
            className={styles.rerollColor}
            aria-label={t('behaviorSchema.editor.rerollColor')}
            onClick={() => onRerollColor(event.id)}
          >
            <Shuffle size={12} />
          </button>
        </div>

        {/* Name */}
        {editing ? (
          <Input
            value={nameInput}
            autoFocus
            onChange={e => setNameInput(e.target.value)}
            onBlur={commitName}
            onKeyDown={e => e.key === 'Enter' && commitName()}
            className="h-8 flex-1"
          />
        ) : (
          <span
            className="flex-1 text-sm cursor-text hover:underline decoration-dotted"
            onClick={() => setEditing(true)}
          >
            {event.name}
          </span>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-full text-xs h-7 px-3"
            onClick={() => setExpanded(v => !v)}
          >
            {expanded ? '−' : '+'} tags{event.tags?.length ? ` (${event.tags.length})` : ''}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 opacity-45 hover:opacity-100"
            aria-label={t('behaviorSchema.editor.removeEvent')}
            onClick={() => onRemove(event.id)}
          >
            <Trash2 size={15} />
          </Button>
        </div>
      </div>

      {expanded && (
        <TagList
          colorHue={event.colorHue}
          tags={(event.tags ?? []) as SimpleUserDefinedSchemaValue[]}
          onAdd={name => onAddTag(event.id, name)}
          onRemove={tagId => onRemoveTag(event.id, tagId)}
        />
      )}
    </li>
  )
}
