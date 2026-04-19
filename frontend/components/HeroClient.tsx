'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function HeroClient() {
  const containerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("h1 span", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        ease: "back.out(1.7)",
        duration: 0.8
      })
      gsap.from("p", {
        opacity: 0,
        y: 10,
        delay: 0.4,
        duration: 0.6
      })
    }, containerRef)
    
    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - left) / width - 0.5
    const y = (e.clientY - top) / height - 0.5

    gsap.to(containerRef.current.querySelector('h1'), {
      x: x * 20,
      y: y * 20,
      duration: 1,
      ease: "power2.out"
    })
  }

  const handleMouseLeave = () => {
    if (!containerRef.current) return
    gsap.to(containerRef.current.querySelector('h1'), {
      x: 0,
      y: 0,
      duration: 1,
      ease: "power2.out"
    })
  }

  return (
    <div 
      ref={containerRef} 
      className="flex flex-col gap-2 py-8 group cursor-default"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <h1 className="text-5xl font-black text-slate-900 tracking-tight transition-transform">
        <span className="inline-block">NexGen</span> <span className="text-blue-600 inline-block">Marketplace.</span>
      </h1>
      <p className="text-slate-500 font-medium text-lg max-w-xl">Curated high-performance goods for the modern ecosystem. Explore the most dynamic retail experience.</p>
    </div>
  )
}
