import { eventColor, tagColor } from '@/lib/color'
import type { SessionRollup } from '@/lib/analysis/session'
import styles from './SessionObservationTable.module.css'

interface Props {
  rollup: SessionRollup
}

function pct(count: number, total: number): string {
  return total === 0 ? '—' : `${Math.round((count / total) * 1000) / 10}%`
}

export function SessionObservationTable({ rollup }: Props) {
  const { behaviors, totalObservations } = rollup

  if (behaviors.length === 0) return null

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.nameCol}>Behavior</th>
          <th className={styles.numCol}>Count</th>
          <th className={styles.numCol}>% total</th>
          <th className={styles.numCol}>% cat.</th>
        </tr>
      </thead>
      <tbody>
        {behaviors.map(b => (
          <>
            <tr key={b.behaviorId} className={styles.behaviorRow}>
              <td className={styles.nameCell}>
                <span
                  className={styles.swatch}
                  style={{ background: eventColor(b.colorHue) }}
                />
                {b.name}
              </td>
              <td className={styles.numCell}>{b.count}</td>
              <td className={styles.numCell}>{pct(b.count, totalObservations)}</td>
              <td className={styles.numCell} />
            </tr>

            {b.tags.map(t => (
              <tr key={t.tagId ?? `${b.behaviorId}-untagged`} className={styles.tagRow}>
                <td className={styles.nameCell}>
                  <span className={styles.tagIndent} />
                  <span
                    className={styles.swatch}
                    style={{ background: tagColor(t.colorHue, t.colorIndex, t.colorTotal) }}
                  />
                  {t.name}
                </td>
                <td className={styles.numCell}>{t.count}</td>
                <td className={styles.numCell}>{pct(t.count, totalObservations)}</td>
                <td className={styles.numCell}>{pct(t.count, b.count)}</td>
              </tr>
            ))}
          </>
        ))}
      </tbody>
    </table>
  )
}
