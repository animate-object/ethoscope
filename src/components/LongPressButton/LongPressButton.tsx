import { type CSSProperties, type ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import styles from './LongPressButton.module.css'

interface Props {
  /** Called when the full hold duration elapses. */
  onComplete: () => void
  /** Hold duration in milliseconds. */
  duration: number
  /** Text shown briefly after an incomplete press. Defaults to "hold". */
  hintText?: string
  children: ReactNode
  className?: string
  style?: CSSProperties
  disabled?: boolean
}

/**
 * A button that requires a sustained hold to activate.
 *
 * While held, a progress fill sweeps left-to-right and a countdown shows the
 * remaining seconds. Releasing early flashes the hint text for 2 s.
 */
export function LongPressButton({
  onComplete,
  duration,
  hintText = 'hold',
  children,
  className,
  style,
  disabled,
}: Props) {
  const [progress, setProgress] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const pressStartRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)
  const completedRef = useRef(false)
  const hintTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Keep callback ref stable so closures always call the latest version.
  const onCompleteRef = useRef(onComplete)
  useEffect(() => { onCompleteRef.current = onComplete }, [onComplete])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
    }
  }, [])

  const startPress = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (disabled) return
    e.currentTarget.setPointerCapture(e.pointerId)
    completedRef.current = false
    pressStartRef.current = performance.now()

    const tick = (now: number) => {
      if (pressStartRef.current === null) return
      const elapsed = now - pressStartRef.current
      const p = Math.min(elapsed / duration, 1)
      setProgress(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        completedRef.current = true
        pressStartRef.current = null
        rafRef.current = null
        setProgress(0)
        onCompleteRef.current()
      }
    }
    rafRef.current = requestAnimationFrame(tick)
  }, [disabled, duration])

  const endPress = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (!completedRef.current && pressStartRef.current !== null) {
      setShowHint(true)
      if (hintTimerRef.current) clearTimeout(hintTimerRef.current)
      hintTimerRef.current = setTimeout(() => setShowHint(false), 2000)
    }
    pressStartRef.current = null
    setProgress(0)
  }, [])

  // Countdown number: seconds remaining, ceiling so it starts at duration/1000
  const countdown = progress > 0 ? Math.ceil((duration / 1000) * (1 - progress)) : null

  return (
    <button
      type="button"
      className={cn(styles.button, className)}
      style={style}
      onPointerDown={startPress}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onPointerLeave={endPress}
      onContextMenu={e => e.preventDefault()}
      disabled={disabled}
    >
      <div className={styles.progressFill} style={{ width: `${progress * 100}%` }} />
      <div className={styles.content}>
        {countdown !== null ? (
          <span className={styles.countdown}>{countdown}</span>
        ) : showHint ? (
          <span className={styles.hint}>{hintText}</span>
        ) : (
          children
        )}
      </div>
    </button>
  )
}
