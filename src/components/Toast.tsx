import { useEffect, useRef } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  message: string
  onClose: () => void
  duration?: number
}

const bgColor: Record<ToastType, string> = {
  success: '#16a34a',
  error: '#dc2626',
  warning: '#f59e0b',
  info: '#3b82f6',
}

export default function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  const onCloseRef = useRef(onClose)
  onCloseRef.current = onClose

  useEffect(() => {
    const timer = setTimeout(() => onCloseRef.current(), duration)
    return () => clearTimeout(timer)
  }, [duration])

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        background: bgColor[type],
        color: '#fff',
        padding: '12px 20px',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        zIndex: 9999,
      }}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: 'none',
          border: 'none',
          color: '#fff',
          fontSize: 18,
          cursor: 'pointer',
          padding: 0,
          lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  )
}
