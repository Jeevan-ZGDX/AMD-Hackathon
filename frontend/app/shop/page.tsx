"use client";

import { useState, useEffect } from "react";
import PreCognitiveTracker from "@/components/PreCognitiveTracker";
import { Filter, ChevronRight, MapPin, Sparkles, ShoppingBag, Search, Star, Zap } from "lucide-react";
import { useCart } from "@/lib/store/cartStore";
import { fetchProducts } from "@/lib/api";
import Link from "next/link";
import { gsap } from "gsap";

const CATEGORIES = ["All Items", "Electronics", "Fashion", "Groceries", "Home & Living"];

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const { addItem, items: cartItems, subtotal, totalItems } = useCart();
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [confidence, setConfidence] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const supabase = createClient();

  useEffect(() => {
    fetchProductsData();
  }, [activeCategory]);

  useEffect(() => {
    const handleSearch = (e: any) => {
      setSearchQuery(e.detail);
      searchProductsData(e.detail);
    };
    window.addEventListener("search", handleSearch);
    return () => window.removeEventListener("search", handleSearch);
  }, []);

  const fetchProductsData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchProducts(activeCategory, searchQuery);
      setProducts(data || []);
      // Animate products entry
      setTimeout(() => {
        gsap.fromTo('.product-card', 
          { opacity: 0, y: 20 }, 
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
        );
      }, 100);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setIsLoading(false);
  };

  const searchProductsData = async (q: string) => {
    setIsLoading(true);
    try {
      const data = await fetchProducts(activeCategory, q);
      setProducts(data || []);
    } catch (error) {
      console.error("Error searching products:", error);
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#FDFDFD] font-syne">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-12 pb-24 px-6 md:px-12 border-b border-slate-100">
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,#3b82f6,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-12 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100/50">
              <Zap className="w-3 h-3 fill-current" />
              Real-time High Performance Market
            </div>
            <h1 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-[0.9]">
              The <span className="text-blue-600">NexGen</span><br />Catalogue
            </h1>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">Hardware • Software • Logistics • Intelligence</p>
          </div>

          <div className="flex flex-col gap-6 md:w-80">
            <PreCognitiveTracker onIntentPredicted={(data) => setConfidence(data.confidence_score)} />
            <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-[2rem] p-6 shadow-sm">
               <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Inference</span>
                  <span className="text-xs font-black text-blue-600">{(confidence*100).toFixed(0)}%</span>
               </div>
               <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 transition-all duration-1000 ease-out" style={{width: `${confidence*100}%`}}></div>
               </div>
               <p className="text-[9px] text-slate-400 mt-3 font-bold uppercase tracking-widest leading-relaxed">System is predicting your next acquisition based on navigation patterns.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* Main Shop Area */}
          <div className="flex-1 space-y-12">
            {/* Filters */}
            <div className="flex items-center justify-between pb-8 border-b border-slate-100 overflow-x-auto custom-scrollbar no-scrollbar">
              <div className="flex items-center gap-3">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat} 
                    onClick={() => setActiveCategory(cat)}
                    className={`px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat ? 'bg-slate-900 text-white border-slate-900 shadow-xl shadow-slate-900/10' : 'bg-white text-slate-400 border-slate-100 hover:border-slate-300'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-300 ml-8">
                <Filter className="w-3.5 h-3.5" />
                Sort: Newest
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="bg-slate-50 rounded-[2.5rem] h-[24rem] animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                {products.length === 0 ? (
                  <div className="col-span-full py-20 text-center">
                    <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">No products found in this sector.</p>
                  </div>
                ) : (
                  products.map(p => (
                    <div key={p.id} className="product-card group bg-white rounded-[2.5rem] border border-slate-100 hover:border-blue-200 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] overflow-hidden flex flex-col">
                      <div className="h-64 relative overflow-hidden bg-slate-50">
                        <img 
                          src={p.image_url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop'} 
                          alt={p.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute top-5 right-5 bg-white/90 backdrop-blur px-3 py-1.5 rounded-2xl border border-white/20 text-[9px] font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 shadow-sm">
                           <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                           {p.rating || '4.8'}
                        </div>
                        <div className="absolute top-5 left-5 bg-blue-600 text-white px-3 py-1.5 rounded-2xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                           {p.category}
                        </div>
                      </div>
                      
                      <div className="p-8 space-y-6 flex-1 flex flex-col">
                        <div className="space-y-2">
                          <h3 className="text-lg font-black text-slate-900 tracking-tight leading-tight group-hover:text-blue-600 transition-colors uppercase">{p.name}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest line-clamp-1">{p.description || "Premium high-performance product."}</p>
                        </div>

                        <div className="flex items-end justify-between">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Market Value</span>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl font-black font-mono text-slate-900">₹{p.price}</span>
                              {p.original_price > p.price && (
                                <span className="text-xs text-slate-300 line-through font-bold">₹{p.original_price}</span>
                              )}
                            </div>
                          </div>
                          {p.original_price > p.price && (
                            <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                              -{Math.round((1 - p.price / p.original_price) * 100)}%
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={() => addItem(p, 1)}
                          className="w-full bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                          Acquire Item
                          <ChevronRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Sidebar / Mini-Cart */}
          <aside className="w-full lg:w-96 space-y-10">
             <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm sticky top-28 space-y-8">
                <div className="flex items-center justify-between">
                   <h2 className="text-xl font-black uppercase tracking-widest text-slate-900">Summary</h2>
                   <div className="w-8 h-8 bg-blue-50 rounded-xl flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4 text-blue-600" />
                   </div>
                </div>

                <div className="space-y-6">
                   {cartItems.length === 0 ? (
                      <div className="py-8 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
                         <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Terminal is empty</p>
                      </div>
                   ) : (
                      <div className="space-y-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
                         {cartItems.map(item => (
                            <div key={item.productId} className="flex justify-between items-center group">
                               <div className="space-y-0.5">
                                  <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.name}</h4>
                                  <p className="text-[9px] font-bold text-slate-400">QTY: {item.quantity} × ₹{item.price}</p>
                               </div>
                               <span className="font-mono text-xs font-black text-slate-900">₹{(item.price * item.quantity).toFixed(0)}</span>
                            </div>
                         ))}
                      </div>
                   )}
                </div>

                <div className="pt-8 border-t border-slate-100 space-y-6">
                   <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Aggregate Total</span>
                      <span className="text-3xl font-black font-mono text-slate-900 tracking-tighter">₹{subtotal.toFixed(0)}</span>
                   </div>

                   <Link 
                     href={cartItems.length > 0 ? "/checkout" : "/shop"}
                     className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all ${cartItems.length > 0 ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700' : 'bg-slate-50 text-slate-300 pointer-events-none'}`}
                   >
                      Initialize Checkout
                      <ChevronRight className="w-4 h-4" />
                   </Link>
                </div>

                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Secured Logistics Active</span>
                </div>
             </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
