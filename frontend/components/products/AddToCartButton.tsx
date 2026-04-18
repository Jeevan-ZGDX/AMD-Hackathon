'use client'

import { useState } from 'react'
import { useCart } from '@/lib/store/cartStore'
import { toast } from '@/lib/store/toastStore'
import { ShoppingCart } from 'lucide-react'

export default function AddToCartButton({ product }: { product: any }) {
  const [qty, setQty] = useState(1)
  const { addItem } = useCart()
  const isOutOfStock = product.stock_count === 0
  const maxQty = Math.min(10, product.stock_count)

  const handleAdd = () => {
    addItem(product, qty)
    toast.success(`Added ${qty} ${product.name} to cart!`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Quantity:</span>
        <select 
          value={qty}
          onChange={(e) => setQty(Number(e.target.value))}
          disabled={isOutOfStock}
          className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-mono font-bold text-slate-900 outline-none focus:border-blue-500"
        >
          {[...Array(maxQty)].map((_, i) => (
            <option key={i+1} value={i+1}>{i+1}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleAdd}
          disabled={isOutOfStock}
          className="btn-primary !py-5 flex items-center justify-center gap-3 text-sm uppercase tracking-widest font-black disabled:opacity-30"
        >
          <ShoppingCart className="w-5 h-5" />
          Add to Cart
        </button>
      </div>
    </div>
  )
}
