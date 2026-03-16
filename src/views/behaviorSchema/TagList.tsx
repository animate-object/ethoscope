import { type FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { tagColor } from '../../lib/color'
import { MAX_TAGS, type SimpleUserDefinedSchemaValue } from '../../lib/schema/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import styles from './TagList.module.css'

interface Props {
  colorHue: number
  tags: SimpleUserDefinedSchemaValue[]
  onAdd: (name: string) => void
  onRemove: (tagId: string) => void
}

export function TagList({ colorHue, tags, onAdd, onRemove }: Props) {
  const { t } = useTranslation()
  const [input, setInput] = useState('')
  const atLimit = tags.length >= MAX_TAGS

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = input.trim()
    if (trimmed && !atLimit) {
      onAdd(trimmed)
      setInput('')
    }
  }

  return (
    <div className="pt-2 pb-1">
      <ul className="flex flex-wrap gap-1.5 mb-2 list-none p-0 m-0">
        {tags.map((tag, index) => (
          <li
            key={tag.id}
            className={styles.tag}
            style={{ backgroundColor: tagColor(colorHue, index, tags.length) }}
          >
            <span>{tag.name}</span>
            <button
              type="button"
              aria-label={t('behaviorSchema.editor.removeTag')}
              onClick={() => onRemove(tag.id)}
              className={styles.remove}
            >
              ×
            </button>
          </li>
        ))}
      </ul>

      {!atLimit && (
        <form className="flex gap-2" onSubmit={handleSubmit}>
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={t('behaviorSchema.editor.addTagPlaceholder')}
            className="h-8 text-sm"
          />
          <Button type="submit" size="sm" disabled={!input.trim()}>
            {t('behaviorSchema.editor.addTagButton')}
          </Button>
        </form>
      )}
    </div>
  )
}
