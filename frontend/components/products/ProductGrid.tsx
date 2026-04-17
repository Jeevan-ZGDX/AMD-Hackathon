'use client'

import { useState, useMemo } from 'react'
import ProductCard from '@/components/products/ProductCard'
import { Filter, Search as SearchIcon, ChevronDown } from 'lucide-react'
import Fuse from 'fuse.js'

interface Product {
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
  created_at: string
}

interface ProductGridProps {
  initialProducts: Product[]
}

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Groceries', 'Home & Living']

export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  // 1. Filtering Logic
  const filteredProducts = useMemo(() => {
    let result = [...initialProducts]

    // Category Filter
    if (activeCategory !== 'All') {
      result = result.filter(p => p.category === activeCategory)
    }

    // Search Filter (Fuse.js)
    if (searchQuery) {
      const fuse = new Fuse(result, {
        keys: ['name', 'description'],
        threshold: 0.3
      })
      result = fuse.search(searchQuery).map(r => r.item)
    }

    // Sorting Logic
    result.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })

    return result
  }, [initialProducts, activeCategory, searchQuery, sortBy])

  return (
    <div className="flex flex-col gap-8">
      {/* Search & Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-400">
            <Filter className="w-4 h-4" />
          </div>
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative group flex-1 lg:w-64">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Fuzzy search..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-4 pr-10 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No products found</h3>
          <p className="text-slate-500 text-sm">Try adjusting your filters or search query.</p>
        </div>
      )}
    </div>
  )
}
