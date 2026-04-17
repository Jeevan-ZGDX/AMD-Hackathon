"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, ShieldCheck, Zap, Globe } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(".hero-badge", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
    gsap.fromTo(".hero-title", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.1, ease: "power2.out" });
    gsap.fromTo(".hero-sub", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.2, ease: "power2.out" });
    gsap.fromTo(".hero-cta", { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, delay: 0.3, ease: "power2.out" });
  }, []);

  return (
    <main className="min-h-screen relative selection:bg-blue-100 selection:text-blue-900 pb-32">
      
      {/* WHITE THEME HERO SECTION */}
      <section ref={heroRef} className="relative min-h-[85vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden bg-white">
        <div className="hero-bg" />
        <div className="hero-grid" />
        
        <div className="hero-badge inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full px-4 py-1.5 font-sans text-[11px] font-bold text-blue-600 uppercase tracking-widest mb-8">
          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
          The Intelligence Layer for Global Retail
        </div>
        
        <h1 className="hero-title text-5xl md:text-8xl font-bold tracking-tight leading-[1.1] mb-8 text-slate-900 max-w-5xl">
          Autonomous Retail.<br/>
          <span className="text-slate-400">Predictive Intelligence.</span>
        </h1>
        
        <p className="hero-sub text-slate-500 max-w-2xl text-lg md:text-xl leading-relaxed mb-12">
          Empowering modern commerce with cognitive AI. Our OS anticipates demand, automates logistics, and provides frictionless experiences for millions of shoppers worldwide.
        </p>

        <div className="hero-cta flex gap-4 flex-wrap justify-center">
          <Link href="/login" className="btn-primary flex items-center gap-2">
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/shop" className="btn-secondary shadow-sm">
            View Live Demo
          </Link>
        </div>
      </section>

      {/* CORE CAPABILITIES GRID */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CapabilityCard 
            icon={<Zap className="w-5 h-5 text-blue-600" />} 
            title="Pre-Cognitive Engine" 
            desc="Analyze behavioral micro-vectors to predict consumer intent with 92% accuracy before a search is initiated." 
          />
          <CapabilityCard 
            icon={<ShieldCheck className="w-5 h-5 text-emerald-600" />} 
            title="Secure Fulfillment" 
            desc="Automated logistics routing and inventory verification ensuring 99.9% order fulfillment rates across all regions." 
          />
          <CapabilityCard 
            icon={<Globe className="w-5 h-5 text-slate-400" />} 
            title="Global Demand Oracle" 
            desc="Real-time geo-spatial demand heatmaps powered by live WebSockets for hyper-local inventory optimization." 
          />
        </div>
      </section>

    </main>
  );
}

function CapabilityCard({ icon, title, desc }: any) {
  return (
    <div className="bg-white border border-slate-100 p-10 rounded-2xl hover:border-blue-200 transition-all group shadow-sm hover:shadow-xl hover:shadow-blue-500/5">
      <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-50 transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
