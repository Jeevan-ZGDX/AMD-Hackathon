"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, User, Command } from "lucide-react";

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("search", { detail: searchQuery }));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md px-6 md:px-12 py-3 flex items-center justify-between">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 shadow-lg shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
          <Command className="w-5 h-5 text-white" />
        </div>
        <span className="text-lg font-bold tracking-tight text-slate-900 uppercase">NexGen <span className="text-slate-400">Retail</span></span>
      </Link>

      {/* Modern Search */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-12 relative group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          <Search className="w-3.5 h-3.5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search items, orders, or logistics..." 
          className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[9px] text-slate-400 font-mono">
          <span className="opacity-50">⌘</span>K
        </div>
      </form>

      {/* Actions */}
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-8 text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-4">
          <Link href="/shop" className="hover:text-blue-600 transition-colors">Solutions</Link>
          <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Analytics</Link>
        </div>
        
        <div className="h-4 w-px bg-slate-200 hidden md:block"></div>
        
        <div className="flex items-center gap-2">
          <Link href="/login" className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
            <User className="w-4 h-4" />
          </Link>
          <Link href="/shop" className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
            <ShoppingCart className="w-4 h-4" />
            <span className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-blue-600"></span>
          </Link>
          <Link href="/login" className="ml-4 btn-primary text-xs !px-5 !py-2 uppercase tracking-wide">
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
}
