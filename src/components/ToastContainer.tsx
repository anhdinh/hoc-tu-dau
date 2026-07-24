import { useToast } from '@/stores/toastStore'
import Toast from './Toast'

export default function ToastContainer() {
  const { toasts, remove } = useToast()

  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <Toast key={t.id} type={t.type} message={t.message} onClose={() => remove(t.id)} />
      ))}
    </div>
  )
}
