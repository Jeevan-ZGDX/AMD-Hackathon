'use client'

import { useCart } from '@/lib/store/cartStore'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function CartPage() {
  const { items, updateQty, removeItem, subtotal, gst, grandTotal, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10 text-slate-200" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">Your cart is empty</h1>
        <p className="text-slate-500 mb-8 text-center max-w-sm">Looks like you haven't added anything to your cart yet. Explore our marketplace to find high-performance products.</p>
        <Link href="/" className="btn-primary !px-10 uppercase tracking-widest font-black">
          Start Shopping
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-6 md:px-12 py-12 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight uppercase">Your Shopping <span className="text-blue-600">Cart</span></h1>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">{totalItems} Items ready for dispatch</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Item List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={item.productId} className="flex flex-col md:flex-row gap-6 p-6 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all group">
              <div className="w-full md:w-32 h-32 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{item.name}</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">SKU: {item.productId.slice(0,8)}</span>
                  </div>
                  <button 
                    onClick={() => removeItem(item.productId)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-6">
                  <div className="flex items-center bg-slate-50 border border-slate-100 rounded-xl p-1.5">
                    <button 
                      onClick={() => updateQty(item.productId, item.quantity - 1)}
                      className="p-2 hover:bg-white rounded-lg transition-all text-slate-500 shadow-sm"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-mono font-black text-slate-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQty(item.productId, item.quantity + 1)}
                      className="p-2 hover:bg-white rounded-lg transition-all text-slate-500 shadow-sm"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Price</span>
                    <span className="text-xl font-black text-slate-900 font-mono">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl shadow-blue-900/20 sticky top-24">
            <h3 className="text-xl font-black uppercase tracking-tight mb-8 border-b border-white/10 pb-4">Order Summary</h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white/50 uppercase tracking-widest">Subtotal</span>
                <span className="font-mono">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white/50 uppercase tracking-widest">GST (18%)</span>
                <span className="font-mono">₹{gst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span className="text-white/50 uppercase tracking-widest">Logistics</span>
                <span className="text-emerald-400 uppercase">FREE</span>
              </div>
              
              <div className="pt-6 border-t border-white/10 flex justify-between items-end">
                <span className="text-xs font-black uppercase tracking-widest text-white/40">Total Amount</span>
                <span className="text-3xl font-black font-mono">₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            <Link 
              href="/checkout"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="mt-8 flex items-center justify-center gap-2 text-[9px] font-bold text-white/30 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              End-to-End Encrypted Checkout
            </div>
          </div>

          <div className="p-6 border border-slate-100 rounded-3xl flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 uppercase">Secure Shopping</h4>
              <p className="text-[10px] text-slate-500">Your data is always protected.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
