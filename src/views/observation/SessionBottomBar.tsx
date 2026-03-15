import { useEffect, useState } from 'react'
import { LongPressButton } from '@/components/LongPressButton/LongPressButton'
import styles from './SessionBottomBar.module.css'

interface Props {
  startedAt: string
  onEnd: () => void
  onUndo: () => void
  canUndo: boolean
}

function formatDuration(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function SessionBottomBar({ startedAt, onEnd, onUndo, canUndo }: Props) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = new Date(startedAt).getTime()
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 1000))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [startedAt])

  return (
    <div className={styles.bar}>
      <LongPressButton
        onComplete={onEnd}
        duration={3000}
        className={styles.endButton}
      >
        End
      </LongPressButton>

      <div className={styles.timer} aria-live="off">
        {formatDuration(elapsed)}
      </div>

      <LongPressButton
        onComplete={onUndo}
        duration={1000}
        disabled={!canUndo}
        className={styles.undoButton}
      >
        Undo
      </LongPressButton>
    </div>
  )
}
