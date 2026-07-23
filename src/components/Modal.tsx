import { type ReactNode } from 'react'

type Props = {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export default function Modal({ open, title, children, onClose }: Props) {
  if (!open) return null

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: 12, padding: 28, minWidth: 420,
        maxWidth: 500, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      }} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ margin: '0 0 20px', fontSize: 18, color: '#1a1a1a' }}>{title}</h3>
        {children}
      </div>
    </div>
  )
}
