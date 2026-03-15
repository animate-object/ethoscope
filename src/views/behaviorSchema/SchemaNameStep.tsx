import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Props {
  onSubmit: (name: string) => void
}

export function SchemaNameStep({ onSubmit }: Props) {
  const { t } = useTranslation()
  const [name, setName] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (trimmed) onSubmit(trimmed)
  }

  return (
    <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
      <h2 className="text-xl font-semibold">{t('behaviorSchema.naming.heading')}</h2>
      <Input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={t('behaviorSchema.naming.placeholder')}
        autoFocus
      />
      <Button type="submit" disabled={!name.trim()} className="self-start">
        {t('behaviorSchema.naming.submit')}
      </Button>
    </form>
  )
}
