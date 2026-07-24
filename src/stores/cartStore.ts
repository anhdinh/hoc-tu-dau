import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type CartItem = {
  id: number
  name: string
  price: number
  qty: number
}

type CartStore = {
  items: CartItem[]
  add: (id: number, name: string, price: number) => void
  remove: (id: number) => void
  clear: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      add: (id, name, price) =>
        set((s) => {
          const exist = s.items.find((i) => i.id === id)
          const items = exist
            ? s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
            : [...s.items, { id, name, price, qty: 1 }]
          return { items }
        }),

      remove: (id) =>
        set((s) => {
          const item = s.items.find((i) => i.id === id)
          if (!item) return s

          if (item.qty > 1) {
            return {
              items: s.items.map((i) =>
                i.id === id ? { ...i, qty: i.qty - 1 } : i
              ),
            }
          }

          return { items: s.items.filter((i) => i.id !== id) }
        }),

      clear: () => set({ items: [] }),
    }),
    { name: 'cart-storage' }
  )
)

// ── Derived selectors ──────────────────────────────────────────────

export function useCartTotalItems() {
  return useCart((s) => s.items.reduce((sum, i) => sum + i.qty, 0))
}

export function useCartTotalPrice() {
  return useCart((s) => s.items.reduce((sum, i) => sum + i.price * i.qty, 0))
}
