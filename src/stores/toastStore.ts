import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

type ToastItem = {
  id: number
  type: ToastType
  message: string
}

type ToastStore = {
  toasts: ToastItem[]
  add: (type: ToastType, message: string) => void
  remove: (id: number) => void
}

let nextId = 1

export const useToast = create<ToastStore>((set) => ({
  toasts: [],
  add: (type, message) => {
    const id = nextId++
    set((s) => ({ toasts: [...s.toasts, { id, type, message }] }))
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }))
    }, 4000)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}))
