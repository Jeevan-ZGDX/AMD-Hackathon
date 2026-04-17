'use client'

import Link from 'next/link'
import { Star, ShoppingCart } from 'lucide-react'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    original_price: number
    category: string
    image_url: string
    stock_count: number
    rating: number
    review_count: number
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const isOutOfStock = product.stock_count === 0

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-xl hover:shadow-blue-500/5 transition-all flex flex-col h-full">
      {/* Image Wrapper */}
      <div className="relative h-48 overflow-hidden bg-slate-100">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-900 uppercase tracking-wider border border-white/20">
          {product.category}
        </div>
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} 
            />
          ))}
          <span className="text-[10px] text-slate-400 font-bold ml-1">({product.review_count})</span>
        </div>

        <h3 className="font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>

        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl font-black text-slate-900 font-mono">₹{product.price}</span>
          {product.original_price > product.price && (
            <span className="text-xs text-slate-400 line-through">₹{product.original_price}</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-auto">
          <Link 
            href={`/products/${product.id}`}
            className="btn-secondary !text-[10px] !py-2.5 flex items-center justify-center text-center uppercase tracking-wider"
          >
            Details
          </Link>
          <button 
            disabled={isOutOfStock}
            className="btn-primary !text-[10px] !py-2.5 flex items-center justify-center gap-2 uppercase tracking-wider disabled:opacity-30 disabled:grayscale"
            onClick={() => {
              // Cart logic will be added in Module 03
              alert(`Added ${product.name} to cart! (Demo)`)
            }}
          >
            <ShoppingCart className="w-3 h-3" />
            Add
          </button>
        </div>
      </div>
    </div>
  )
}
