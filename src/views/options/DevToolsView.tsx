import { useState } from 'react'
import { Screen } from '@/components/Screen'
import { ROUTES } from '@/routes'
import { backfillSessionMetadata, type BackfillResult } from '@/lib/portability/migrations'
import styles from './DevToolsView.module.css'

type ToolResult = { ok: true; message: string } | { ok: false; message: string }

type ToolCardProps = {
  title: string
  description: string
  action: string
  result: ToolResult | null
  onRun: () => void
}

function ToolCard({ title, description, action, result, onRun }: ToolCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.cardBody}>
        <p className={styles.cardTitle}>{title}</p>
        <p className={styles.cardDescription}>{description}</p>
      </div>
      <div className={styles.cardFooter}>
        <button type="button" className={styles.runButton} onClick={onRun}>
          {action}
        </button>
        {result && (
          <p className={result.ok ? styles.resultSuccess : styles.resultError}>
            {result.message}
          </p>
        )}
      </div>
    </div>
  )
}

export function DevToolsView() {
  const [backfillResult, setBackfillResult] = useState<ToolResult | null>(null)

  function runBackfill() {
    try {
      const { sessionsScanned, sessionsPatched }: BackfillResult = backfillSessionMetadata()
      setBackfillResult({
        ok: true,
        message: `Scanned ${sessionsScanned} session${sessionsScanned !== 1 ? 's' : ''} — ${sessionsPatched} patched.`,
      })
    } catch (err) {
      setBackfillResult({
        ok: false,
        message: err instanceof Error ? err.message : 'Migration failed',
      })
    }
  }

  return (
    <Screen title="Dev Tools" backTo={ROUTES.options}>
      <div className={styles.section}>
        <p className={styles.sectionDescription}>
          One-off tools for repairing or migrating persisted data.
          Safe to re-run — operations are idempotent.
        </p>
        <div className={styles.tools}>
          <ToolCard
            title="Backfill session metadata"
            description="Sets timezone and schema version on sessions recorded before those fields were captured. Timezone becomes this device's current timezone; schema version is taken from the latest saved version of the session's schema."
            action="Run"
            result={backfillResult}
            onRun={runBackfill}
          />
        </div>
      </div>
    </Screen>
  )
}
