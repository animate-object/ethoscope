import { formatDuration } from '@/lib/analysis/session'
import type { SessionRollup } from '@/lib/analysis/session'
import styles from './SessionStats.module.css'

interface Props {
  rollup: SessionRollup
}

export function SessionStats({ rollup }: Props) {
  const stats = [
    rollup.durationSeconds !== null
      ? { value: formatDuration(rollup.durationSeconds), label: 'Duration' }
      : null,
    { value: String(rollup.totalObservations), label: 'Observations' },
    rollup.ratePerMinute !== null
      ? { value: `${rollup.ratePerMinute}/min`, label: 'Rate' }
      : null,
    rollup.longestGapSeconds !== null
      ? { value: formatDuration(rollup.longestGapSeconds), label: 'Longest gap' }
      : null,
  ].filter(Boolean) as { value: string; label: string }[]

  return (
    <div className={styles.grid}>
      {stats.map(stat => (
        <div key={stat.label} className={styles.stat}>
          <span className={styles.value}>{stat.value}</span>
          <span className={styles.label}>{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
