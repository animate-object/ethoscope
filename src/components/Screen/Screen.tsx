import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import styles from './Screen.module.css'

interface Props {
  /** Screen title shown in the top bar. */
  title: string
  /** If provided, renders a back button that navigates to this path. Omit on root screens. */
  backTo?: string
  /** Main scrollable content. */
  children: ReactNode
  /** Actions rendered in the bottom bar. Omit if the screen has no primary actions. */
  actions?: ReactNode
}

/**
 * Canonical screen template.
 *
 * Layout principle: navigation and location at the top, actions at the bottom.
 * See CLAUDE.md § Screen layout for rationale.
 */
export function Screen({ title, backTo, children, actions }: Props) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className={styles.screen}>
      <header className={styles.header}>
        {backTo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(backTo)}
            aria-label={t('common.back')}
            className="gap-1 px-2"
          >
            <ChevronLeft size={16} />
            {t('common.back')}
          </Button>
        )}
        <h1 className={styles.title}>{title}</h1>
      </header>

      <main className={styles.content}>{children}</main>

      {actions && <footer className={styles.actions}>{actions}</footer>}
    </div>
  )
}
