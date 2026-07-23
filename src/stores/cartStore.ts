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
  totalItems: number
  totalPrice: number
  add: (id: number, name: string, price: number) => void
  remove: (id: number) => void
  clear: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      totalItems: 0,
      totalPrice: 0,

      add: (id, name, price) =>
        set((s) => {
          const exist = s.items.find((i) => i.id === id)
          const items = exist
            ? s.items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
            : [...s.items, { id, name, price, qty: 1 }]

          return {
            items,
            totalItems: s.totalItems + 1,
            totalPrice: s.totalPrice + price,
          }
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
              totalItems: s.totalItems - 1,
              totalPrice: s.totalPrice - item.price,
            }
          }

          return {
            items: s.items.filter((i) => i.id !== id),
            totalItems: s.totalItems - 1,
            totalPrice: s.totalPrice - item.price,
          }
        }),

      clear: () => set({ items: [], totalItems: 0, totalPrice: 0 }),
    }),
    { name: 'cart-storage' }
  )
)
