import { type ReactNode } from 'react'
import styles from './Modal.module.css'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export default function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>
        {children}
      </div>
    </div>
  )
}
