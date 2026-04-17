"use client";

import { useState, useEffect } from "react";
import PreCognitiveTracker from "@/components/PreCognitiveTracker";
import { Filter, ChevronRight, MapPin, Sparkles, ShoppingBag } from "lucide-react";

const CATEGORIES = ["All Items", "Produce", "Dairy", "Nutrition", "Beverages"];

export default function Shop() {
  const [products, setProducts] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    fetchProducts();
    const handleSearch = (e: any) => fetchProducts(activeCategory, e.detail);
    window.addEventListener("search", handleSearch);
    return () => window.removeEventListener("search", handleSearch);
  }, [activeCategory]);

  const fetchProducts = async (cat = activeCategory, query = "") => {
    let url = "http://localhost:8000/api/v1/products?";
    if (cat !== "All Items") {
        const catMap: any = { "Produce": "Fruits", "Nutrition": "Snacks", "Dairy": "Dairy", "Beverages": "Beverages" };
        url += `category=${catMap[cat] || cat}&`;
    }
    if (query) url += `q=${query}`;
    const res = await fetch(url);
    setProducts(await res.json());
  };

  const addToCart = async (id: number) => {
    const res = await fetch(`http://localhost:8000/api/v1/cart/${id}`, { method: "POST" });
    setCart(await res.json());
  };

  return (
    <main className="min-h-screen px-6 md:px-12 py-12 max-w-7xl mx-auto flex flex-col gap-10 bg-white">
      <PreCognitiveTracker onIntentPredicted={(data) => setConfidence(data.confidence_score)} />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-xs uppercase tracking-widest">
            <Sparkles className="w-3 h-3" />
            Predictive Experience
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Market <span className="text-slate-400">Storefront</span></h1>
        </div>

        {/* White Theme Category Filter */}
        <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200 shadow-inner">
          {CATEGORIES.map(cat => (
            <button 
              key={cat} 
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${activeCategory === cat ? 'bg-white text-blue-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Product Grid */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-2xl border border-slate-100 hover:border-blue-500/20 transition-all group overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
                <div className={`h-44 bg-gradient-to-br ${p.color} flex items-center justify-center text-4xl relative`}>
                   <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-2.5 py-1 rounded-md text-[9px] font-bold text-slate-900 uppercase tracking-wider border border-white/20">
                      {p.tag}
                   </div>
                   {p.category === 'Fruits' ? '🍎' : p.category === 'Dairy' ? '🥛' : '🍱'}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{p.name}</h3>
                  </div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-lg font-bold text-slate-900 font-mono">₹{p.price}</span>
                    <span className="text-xs text-slate-400 line-through">₹{p.competitor_price}</span>
                    <span className="text-[10px] text-emerald-600 font-bold ml-auto bg-emerald-50 px-2 py-0.5 rounded">SAVE ₹{p.competitor_price - p.price}</span>
                  </div>
                  <button 
                    onClick={() => addToCart(p.id)}
                    className="w-full btn-secondary text-xs !py-3 flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600"
                  >
                    Add to Order
                    <ChevronRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-xl shadow-slate-200/50 flex flex-col gap-6 sticky top-24">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-blue-600" />
                Checkout
              </h3>
              <span className="bg-white text-slate-400 border border-slate-200 px-2 py-0.5 rounded text-[10px] font-mono">{cart.length}</span>
            </div>

            {cart.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs font-medium italic">Your cart is currently empty.</div>
            ) : (
              <div className="flex flex-col gap-3">
                {cart.slice(0,4).map(item => (
                  <div key={item.id} className="flex justify-between text-xs">
                    <span className="text-slate-500">{item.name}</span>
                    <span className="text-slate-900 font-mono">₹{item.price}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-slate-200 flex justify-between items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
                  <span className="text-xl font-bold text-slate-900">₹{cart.reduce((s,i) => s + i.price, 0)}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center gap-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] text-slate-500 truncate">123 Business Hub, India</span>
              </div>
              <button 
                disabled={cart.length === 0}
                className="w-full btn-primary !rounded-xl !py-3.5 text-xs uppercase tracking-widest disabled:opacity-30 disabled:grayscale transition-all"
              >
                Confirm Dispatch
              </button>
            </div>
          </div>

          {/* AI Monitor */}
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
            <div className="flex justify-between mb-2">
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">Inference Confidence</span>
              <span className="text-xs font-bold text-blue-600">{(confidence*100).toFixed(0)}%</span>
            </div>
            <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 transition-all duration-700" style={{width: `${confidence*100}%`}}></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
