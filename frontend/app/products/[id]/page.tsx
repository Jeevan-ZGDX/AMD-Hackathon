import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Star, ShieldCheck, Truck, RotateCcw, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import AddToCartButton from '@/components/products/AddToCartButton'

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: product, error } = await supabase
    .from('products')
    .select('*, retailers(store_name)')
    .eq('id', params.id)
    .single()

  if (error || !product) {
    return notFound()
  }

  const isOutOfStock = product.stock_count === 0
  const maxQty = Math.min(10, product.stock_count)

  return (
    <main className="min-h-screen px-6 md:px-12 py-10 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left: Image Gallery (Single Image for Demo) */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 shadow-inner">
            <img 
              src={product.image_url} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
              {product.category}
            </span>
            <div className="h-4 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase">{product.retailers?.store_name || 'Verified Retailer'}</span>
            </div>
          </div>

          <h1 className="text-4xl font-black text-slate-900 mb-4 leading-tight">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
                />
              ))}
            </div>
            <span className="text-sm text-slate-500 font-bold">{product.rating} Rating</span>
            <span className="text-sm text-slate-400 font-medium">| {product.review_count} verified reviews</span>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-5xl font-black text-slate-900 font-mono">₹{product.price}</span>
              {product.original_price > product.price && (
                <span className="text-xl text-slate-400 line-through">₹{product.original_price}</span>
              )}
            </div>
            <p className="text-sm font-bold text-emerald-600">Inclusive of all taxes + 18% GST estimate</p>
          </div>

          <p className="text-slate-500 leading-relaxed mb-10 text-lg">
            {product.description}
          </p>

          <div className="flex flex-col gap-6 mb-12">
             <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stock Status:</span>
                {isOutOfStock ? (
                  <span className="text-red-600 font-black text-sm uppercase">Out of Stock</span>
                ) : (
                  <span className="text-emerald-600 font-black text-sm uppercase">{product.stock_count} units available</span>
                )}
             </div>

             <AddToCartButton product={product} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Link 
                href="/"
                className="btn-secondary !py-5 flex items-center justify-center text-sm uppercase tracking-widest font-black"
              >
                Back to Marketplace
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-4 mt-12 pt-12 border-t border-slate-100">
             <div className="flex flex-col items-center gap-2 text-center">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Secure Payment</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center">
                <Truck className="w-6 h-6 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Fast Delivery</span>
             </div>
             <div className="flex flex-col items-center gap-2 text-center">
                <RotateCcw className="w-6 h-6 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase">Easy Returns</span>
             </div>
          </div>
        </div>
      </div>
    </main>
  )
}
