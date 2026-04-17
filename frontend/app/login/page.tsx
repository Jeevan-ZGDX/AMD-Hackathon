"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Command, Mail, Lock, User as UserIcon } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<"customer" | "retailer">("customer");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "customer") {
      router.push("/shop");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center px-4 bg-slate-50/50">
      <div className="bg-white border border-slate-200 max-w-md w-full rounded-2xl p-10 shadow-2xl shadow-slate-200/60 relative overflow-hidden">
        
        {/* Minimalist Brand */}
        <div className="flex justify-center mb-10">
          <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Command className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-2 tracking-tight">
          {isLogin ? "Sign in to NexGen" : "Create your account"}
        </h1>
        <p className="text-slate-500 text-sm text-center mb-8">
          {isLogin ? "Enter your credentials to continue" : "Start optimizing your retail intelligence"}
        </p>

        {/* Role Selector */}
        <div className="flex bg-slate-100 p-1 rounded-lg mb-8 border border-slate-200">
          <button 
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${role === "customer" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            Customer
          </button>
          <button 
            type="button"
            onClick={() => setRole("retailer")}
            className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${role === "retailer" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"}`}
          >
            Retailer
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {!isLogin && (
            <div className="relative group">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input type="text" required className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="Full Name" />
            </div>
          )}
          
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input type="email" required className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="name@company.com" />
          </div>

          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input type="password" required className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all" placeholder="••••••••" />
          </div>

          <button type="submit" className="btn-primary !rounded-lg !py-3 w-full text-sm uppercase tracking-widest font-bold mt-4 shadow-blue-500/20">
            {isLogin ? `Sign In` : `Get Started`}
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-slate-500 font-medium">
          {isLogin ? "Need an account?" : "Already registered?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline ml-1">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </main>
  );
}
