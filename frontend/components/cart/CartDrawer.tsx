'use client'

import { useCart } from '@/lib/store/cartStore'
import { X, Plus, Minus, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CartDrawer() {
  const { items, isDrawerOpen, toggleDrawer, updateQty, removeItem, subtotal, gst, grandTotal, totalItems } = useCart()

  if (!isDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={() => toggleDrawer(false)}
      />

      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
        
        {/* Header */}
        <div className="px-6 py-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 uppercase">My Order</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{totalItems} Items selected</p>
            </div>
          </div>
          <button 
            onClick={() => toggleDrawer(false)}
            className="p-2 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="font-bold text-slate-900">Your cart is empty</h3>
              <p className="text-xs text-slate-500 max-w-[200px]">Add some products from the marketplace to get started.</p>
              <button 
                onClick={() => toggleDrawer(false)}
                className="btn-primary !text-[10px] uppercase tracking-widest mt-4"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="flex gap-4 group">
                <div className="w-20 h-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="text-slate-300 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">₹{item.price} / unit</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-50 border border-slate-100 rounded-lg p-1">
                      <button 
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded transition-all text-slate-500"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-[11px] font-bold text-slate-900">{item.quantity}</span>
                      <button 
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded transition-all text-slate-500"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-sm font-black text-slate-900 font-mono">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-8 bg-slate-50 border-t border-slate-100 space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">Subtotal</span>
                <span className="text-slate-900 font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-400 uppercase tracking-widest">GST (18%)</span>
                <span className="text-slate-900 font-mono">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-4">
                <span className="text-sm font-black text-slate-900 uppercase tracking-widest">Grand Total</span>
                <span className="text-2xl font-black text-slate-900 font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              onClick={() => toggleDrawer(false)}
              className="w-full btn-primary !py-5 flex items-center justify-center gap-3 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
            >
              Secure Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
