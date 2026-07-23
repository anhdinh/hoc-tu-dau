import { useEffect, useRef } from 'react'

type Props = {
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmPopup({ message, confirmLabel = 'Confirm', onConfirm, onCancel }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onCancel()
      }
    }
    setTimeout(() => document.addEventListener('click', handler), 0)
    return () => document.removeEventListener('click', handler)
  }, [onCancel])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
    }}>
      <div ref={ref} style={{
        background: '#fff', borderRadius: 12, padding: '24px 28px',
        maxWidth: 360, boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
      }}>
        <p style={{ margin: '0 0 20px', fontSize: 15, color: '#374151' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 16px', border: '1px solid #d1d5db', borderRadius: 6,
            background: '#fff', cursor: 'pointer', fontSize: 14,
          }}>Cancel</button>
          <button onClick={onConfirm} style={{
            padding: '8px 16px', border: 'none', borderRadius: 6,
            background: '#ef4444', color: '#fff', cursor: 'pointer', fontSize: 14,
          }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}
