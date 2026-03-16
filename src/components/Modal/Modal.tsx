import { type ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'
import styles from './Modal.module.css'

interface Props {
  onClose: () => void
  children: ReactNode
}

export function Modal({ onClose, children }: Props) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal>
      <div className={styles.panel} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body,
  )
}
