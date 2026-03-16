import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Screen } from '@/components/Screen'
import { ROUTES } from '@/routes'
import { exportData } from '@/lib/portability/export'
import { importData, type ImportResult } from '@/lib/portability/import'
import styles from './OptionsView.module.css'

export function OptionsView() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [importError, setImportError] = useState<string | null>(null)

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setImportResult(null)
    setImportError(null)

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const result = importData(event.target?.result as string)
        setImportResult(result)
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Import failed')
      }
    }
    reader.readAsText(file)

    // Reset so the same file can be re-imported after changes.
    e.target.value = ''
  }

  return (
    <Screen title="Options" backTo={ROUTES.home}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Data</h2>
        <p className={styles.sectionDescription}>
          Export your schemas and sessions as JSON for backup or transfer to another device.
          Importing is safe to repeat — only new schemas and sessions will be written.
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.actionButton} onClick={exportData}>
            <span className={styles.actionTitle}>Export</span>
            <span className={styles.actionMeta}>Download all data as a JSON file</span>
          </button>

          <button
            type="button"
            className={styles.actionButton}
            onClick={() => fileInputRef.current?.click()}
          >
            <span className={styles.actionTitle}>Import</span>
            <span className={styles.actionMeta}>Load data from a JSON export file</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            className={styles.hiddenInput}
            onChange={handleImportFile}
          />
        </div>

        {importResult && (
          <p className={styles.importSuccess}>
            Import complete: {importResult.schemasAdded} schema{importResult.schemasAdded !== 1 ? 's' : ''} added,{' '}
            {importResult.schemasUpdated} updated,{' '}
            {importResult.sessionsAdded} session{importResult.sessionsAdded !== 1 ? 's' : ''} added.
          </p>
        )}

        {importError && (
          <p className={styles.importError}>{importError}</p>
        )}
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Developer</h2>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={() => navigate(ROUTES.devTools)}
          >
            <span className={styles.actionTitle}>Dev Tools</span>
            <span className={styles.actionMeta}>Data repair and migration utilities</span>
          </button>
        </div>
      </div>
    </Screen>
  )
}
