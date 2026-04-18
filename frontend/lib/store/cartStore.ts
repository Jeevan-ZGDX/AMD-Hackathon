import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  productId: string
  name: string
  price: number
  image_url: string
  quantity: number
  stock_count: number
  retailer_id: string
}

interface CartState {
  items: CartItem[]
  isDrawerOpen: boolean
  addItem: (product: any, quantity: number) => void
  removeItem: (productId: string) => void
  updateQty: (productId: string, quantity: number) => void
  clearCart: () => void
  toggleDrawer: (open?: boolean) => void
  
  // Computed values
  getTotals: () => {
    subtotal: number
    gst: number
    grandTotal: number
    totalItems: number
  }
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product, quantity) => {
        const items = get().items
        const existing = items.find((i) => i.productId === product.id)

        if (existing) {
          const newQty = Math.min(existing.quantity + quantity, product.stock_count)
          set({
            items: items.map((i) =>
              i.productId === product.id ? { ...i, quantity: newQty } : i
            ),
          })
        } else {
          set({
            items: [
              ...items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                image_url: product.image_url,
                quantity: Math.min(quantity, product.stock_count),
                stock_count: product.stock_count,
                retailer_id: product.retailer_id,
              },
            ],
          })
        }
        set({ isDrawerOpen: true })
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.productId !== productId) })
      },

      updateQty: (productId, quantity) => {
        const item = get().items.find((i) => i.productId === productId)
        if (!item) return

        const newQty = Math.min(Math.max(1, quantity), item.stock_count)
        set({
          items: get().items.map((i) =>
            i.productId === productId ? { ...i, quantity: newQty } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),
      
      toggleDrawer: (open) => set((state) => ({ 
        isDrawerOpen: open !== undefined ? open : !state.isDrawerOpen 
      })),

      getTotals: () => {
        const subtotal = get().items.reduce((acc, item) => acc + item.price * item.quantity, 0)
        const gst = subtotal * 0.18
        const grandTotal = subtotal + gst
        const totalItems = get().items.reduce((acc, item) => acc + item.quantity, 0)

        return {
          subtotal: Number(subtotal.toFixed(2)),
          gst: Number(gst.toFixed(2)),
          grandTotal: Number(grandTotal.toFixed(2)),
          totalItems,
        }
      },
    }),
    {
      name: 'nexgen_cart',
    }
  )
)

// Export a simpler hook for UI components
export const useCart = () => {
  const store = useCartStore()
  return {
    ...store,
    ...store.getTotals(),
  }
}
