'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/lib/store/cartStore'
import { useAuth } from '@/lib/auth/useAuth'
import { placeOrder } from '@/lib/api'
import { 
  CreditCard, 
  MapPin, 
  ChevronRight, 
  ShieldCheck, 
  Package, 
  Loader2,
  Lock,
  Smartphone,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'
import { gsap } from 'gsap'

export default function CheckoutPage() {
  const { items, grandTotal, subtotal, gst, clearCart, totalItems } = useCart()
  const { user, isLoading: authLoading } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'details' | 'processing' | 'success'>('details')
  
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  })

  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi'>('card')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login?redirect=/checkout')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    // Entrance animation
    gsap.from('.checkout-section', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    })
  }, [])

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setPaymentStep('processing')

    try {
      // 1. Create Order in Local SQLite (via Python API)
      const order = await placeOrder({
        user_id: user.id,
        address: address,
        payment_method: paymentMethod
      })

      // Simulate payment processing delay for premium feel
      await new Promise(resolve => setTimeout(resolve, 3500))

      setPaymentStep('success')
      clearCart()
      
      // Redirect to success page
      router.push(`/checkout/success?orderId=${order.order_id}`)

    } catch (error) {
      console.error('Checkout error:', error)
      alert('Transaction failed. Please check your details and try again.')
      setPaymentStep('details')
    } finally {
      setIsLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    )
  }

  if (items.length === 0 && paymentStep !== 'success') {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <Package className="w-10 h-10 text-slate-300" />
        </div>
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">Your cart is empty</h1>
        <p className="text-slate-500 mt-2 mb-8 text-center max-w-xs">You cannot checkout without any items. Go back and add some high-performance tech to your cart.</p>
        <Link href="/shop" className="btn-primary !rounded-2xl flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Market
        </Link>
      </main>
    )
  }

  if (paymentStep === 'processing') {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white overflow-hidden">
        <div className="relative mb-12">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20 scale-150"></div>
          <div className="w-32 h-32 bg-blue-50 rounded-full flex items-center justify-center relative z-10 border border-blue-100">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
          </div>
        </div>
        <div className="text-center space-y-4 max-w-md mx-auto">
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-[0.1em]">Securing Funds</h2>
          <p className="text-slate-500 font-medium">Please do not refresh the page. We are securely processing your transaction via encrypted tunnels.</p>
          <div className="flex items-center justify-center gap-4 mt-8 py-4 px-6 bg-slate-50 rounded-2xl border border-slate-100">
             <ShieldCheck className="w-5 h-5 text-emerald-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">AES-256 Bit Encryption Active</span>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] py-16 px-6 lg:px-12 font-syne">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">Checkout <span className="text-blue-600">Terminal</span></h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">Secure Transaction Node: NEX-0419</p>
          </div>
          <Link href="/cart" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Modify Cart
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-12">
            <section className="checkout-section bg-white rounded-[3rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center shadow-inner">
                  <MapPin className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Delivery Node</h2>
                  <p className="text-sm text-slate-500 font-medium">Specify the destination for your order package.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Street Infrastructure</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 742 Evergreen Terrace"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 shadow-sm"
                    value={address.street}
                    onChange={(e) => setAddress({...address, street: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">City / Sector</label>
                  <input 
                    type="text" 
                    placeholder="Bengaluru"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 shadow-sm"
                    value={address.city}
                    onChange={(e) => setAddress({...address, city: e.target.value})}
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Zip Protocol</label>
                  <input 
                    type="text" 
                    placeholder="560001"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all focus:ring-4 focus:ring-blue-500/5 shadow-sm"
                    value={address.zip}
                    onChange={(e) => setAddress({...address, zip: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section className="checkout-section bg-white rounded-[3rem] p-12 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100">
              <div className="flex items-center gap-6 mb-10">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center shadow-inner">
                  <CreditCard className="w-7 h-7 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Payment Protocol</h2>
                  <p className="text-sm text-slate-500 font-medium">Select your preferred method for value transfer.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <button 
                  onClick={() => setPaymentMethod('card')}
                  className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300'}`}>
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${paymentMethod === 'card' ? 'text-blue-900' : 'text-slate-400'}`}>Card Network</span>
                </button>
                <button 
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-8 rounded-[2.5rem] border-2 transition-all flex flex-col items-center gap-4 group ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === 'upi' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300'}`}>
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${paymentMethod === 'upi' ? 'text-blue-900' : 'text-slate-400'}`}>UPI Infrastructure</span>
                </button>
              </div>

              {paymentMethod === 'card' && (
                <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Card Matrix Number</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all pl-16 shadow-sm"
                      />
                      <Lock className="w-5 h-5 text-slate-300 absolute left-8 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">Expiration Epoch</label>
                      <input 
                        type="text" 
                        placeholder="MM / YY"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-2">CVC Security</label>
                      <input 
                        type="text" 
                        placeholder="•••"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-8 py-5 text-sm font-bold focus:bg-white focus:border-blue-500 outline-none transition-all shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Summary Side */}
          <div className="lg:col-span-5">
            <div className="checkout-section bg-slate-900 rounded-[3.5rem] p-12 text-white sticky top-28 shadow-[0_30px_60px_-15px_rgba(30,58,138,0.3)]">
              <div className="flex items-center justify-between mb-10 pb-6 border-b border-white/10">
                <h2 className="text-xl font-black uppercase tracking-widest">Order Manifest</h2>
                <span className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black">{totalItems} UNITS</span>
              </div>
              
              <div className="space-y-6 mb-12 max-h-[18rem] overflow-y-auto pr-4 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-6 items-center group">
                    <div className="w-20 h-20 bg-white/5 rounded-3xl overflow-hidden flex-shrink-0 border border-white/10 p-1.5 transition-transform group-hover:scale-105">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover rounded-2xl" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black leading-tight tracking-tight mb-1">{item.name}</h4>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">
                        Node: {item.productId.slice(0, 8)} • Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-mono font-bold text-sm text-blue-400">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-5 border-t border-white/10 pt-10">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/30 uppercase tracking-[0.2em]">Net Value</span>
                  <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/30 uppercase tracking-[0.2em]">Tax Protocol (18%)</span>
                  <span className="font-mono">₹{gst.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-white/30 uppercase tracking-[0.2em]">Logistics</span>
                  <span className="text-emerald-400 uppercase tracking-[0.2em]">Priority Secured</span>
                </div>
                
                <div className="pt-10 mt-6 border-t border-white/10 flex justify-between items-end">
                  <div className="space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20">Total Liquidity</span>
                    <p className="text-5xl font-black font-mono tracking-tighter text-white">₹{grandTotal.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={isLoading || !address.street || !address.city || !address.zip}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-white/20 text-white py-8 rounded-[2.5rem] mt-12 font-black uppercase tracking-[0.3em] text-[11px] transition-all shadow-2xl shadow-blue-600/30 active:scale-[0.98] flex items-center justify-center gap-4 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AUTHORIZING...
                  </>
                ) : (
                  <>
                    EXECUTE PURCHASE
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="mt-10 flex items-center justify-center gap-3 text-white/20">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[9px] font-black uppercase tracking-[0.2em]">End-to-End Encrypted Tunnel</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
