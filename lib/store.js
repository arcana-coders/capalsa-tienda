'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],        // [{ id, asin, titulo, precio, imagen, cantidad }]
      isOpen: false,

      addItem: (producto) => {
        const items = get().items
        const existe = items.find((i) => i.id === producto.id)
        if (existe) {
          set({
            items: items.map((i) =>
              i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...producto, cantidad: 1 }] })
        }
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQuantity: (id, cantidad) => {
        if (cantidad < 1) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, cantidad } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set({ isOpen: !get().isOpen }),

      get total() {
        return get().items.reduce((sum, i) => sum + i.precio * i.cantidad, 0)
      },

      get count() {
        return get().items.reduce((sum, i) => sum + i.cantidad, 0)
      },
    }),
    {
      name: 'capalsa-cart',
    }
  )
)
