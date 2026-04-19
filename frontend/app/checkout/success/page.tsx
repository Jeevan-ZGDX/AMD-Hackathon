'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { fetchUserOrders } from '@/lib/api'
import { useAuth } from '@/lib/auth/useAuth'
import { 
  CheckCircle2, 
  Package, 
  ArrowRight, 
  Download, 
  ShoppingBag,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from 'lucide-react'
import Link from 'next/link'
import { gsap } from 'gsap'

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('orderId')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!orderId) {
      router.push('/shop')
      return
    }

    const fetchOrder = async () => {
      try {
        const orders = await fetchUserOrders(user?.id || "");
        const foundOrder = orders.find((o: any) => o.id === orderId);
        if (foundOrder) {
          // Parse shipping address if it's a string
          if (typeof foundOrder.shipping_address === 'string') {
            foundOrder.shipping_address = JSON.parse(foundOrder.shipping_address);
          }
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error('Error fetching order:', error);
      }
      setLoading(false);
    }

    fetchOrder()
  }, [orderId, router, supabase])

  useEffect(() => {
    if (!loading) {
      // Entrance animation
      const tl = gsap.timeline()
      tl.from('.success-icon', { scale: 0, rotation: -45, duration: 1, ease: 'back.out(1.7)' })
        .from('.success-title', { y: 20, opacity: 0, duration: 0.6 }, '-=0.4')
        .from('.success-card', { y: 30, opacity: 0, duration: 0.8, stagger: 0.2 }, '-=0.2')
    }
  }, [loading])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-20 px-6 font-syne">
      <div className="max-w-3xl mx-auto text-center">
        <div className="success-icon inline-flex items-center justify-center w-24 h-24 bg-emerald-100 rounded-full mb-8 shadow-lg shadow-emerald-500/20 border-4 border-white">
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </div>
        
        <h1 className="success-title text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">
          Order <span className="text-blue-600">Confirmed</span>
        </h1>
        <p className="success-title text-slate-500 font-bold uppercase text-xs tracking-[0.3em] mb-12">
          Receipt ID: {orderId?.toUpperCase().slice(0, 12)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <section className="success-card bg-white rounded-[2.5rem] p-10 text-left border border-slate-100 shadow-sm">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
              <Package className="w-3 h-3" /> Delivery Details
            </h3>
            <div className="space-y-4">
              <p className="text-sm font-bold text-slate-900 leading-relaxed">
                {order?.shipping_address?.street}<br />
                {order?.shipping_address?.city}, {order?.shipping_address?.zip}<br />
                India
              </p>
              <div className="pt-4 border-t border-slate-50">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                <span className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Processing Dispatch
                </span>
              </div>
            </div>
          </section>

          <section className="success-card bg-slate-900 rounded-[2.5rem] p-10 text-left text-white shadow-xl shadow-blue-900/10">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6 flex items-center gap-2">
              <CreditCard className="w-3 h-3" /> Payment Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-white/50 uppercase tracking-widest">Grand Total</span>
                <span className="text-2xl font-black font-mono tracking-tighter text-blue-400">₹{order?.total_amount?.toFixed(2)}</span>
              </div>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Method</p>
                <p className="text-xs font-bold uppercase tracking-widest">{order?.payment_method === 'upi' ? 'Unified Payments Interface' : 'Encrypted Credit Card'}</p>
              </div>
            </div>
          </section>
        </div>

        <div className="success-card bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-[5rem] -mr-8 -mt-8"></div>
          <h3 className="text-left text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-8">Itemized Manifest</h3>
          <div className="space-y-6">
            {order?.order_items?.map((item: any) => (
              <div key={item.id} className="flex items-center gap-4 text-left">
                <div className="w-12 h-12 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100 p-1">
                  <img src={item.products?.image_url} alt={item.products?.name} className="w-full h-full object-cover rounded-lg" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-900 leading-tight">{item.products?.name}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Qty: {item.quantity}</p>
                </div>
                <span className="font-mono font-bold text-xs text-slate-900">₹{(item.price_at_purchase * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6">
          <Link href="/shop" className="btn-primary !rounded-2xl !px-10 flex items-center gap-3 group">
            <ShoppingBag className="w-4 h-4" />
            Continue Shopping
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button className="px-10 py-3.5 border-2 border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-50 transition-all flex items-center gap-3">
            <Download className="w-4 h-4" />
            Download Invoice
          </button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 opacity-20">
          <div className="flex items-center gap-2">
             <ShieldCheck className="w-4 h-4" />
             <span className="text-[8px] font-black uppercase tracking-widest">Verified Purchase</span>
          </div>
          <div className="flex items-center gap-2">
             <ExternalLink className="w-4 h-4" />
             <span className="text-[8px] font-black uppercase tracking-widest">Track Logistics</span>
          </div>
        </div>
      </div>
    </main>
  )
}
