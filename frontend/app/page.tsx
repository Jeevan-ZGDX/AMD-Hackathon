import { createClient } from '@/lib/supabase/server'
import ProductGrid from '@/components/products/ProductGrid'

export const revalidate = 0; // Disable caching for hackathon demo freshness

export default async function HomePage() {
  const supabase = createClient()

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error.message)
  }

  return (
    <main className="min-h-screen px-6 md:px-12 py-10 max-w-7xl mx-auto flex flex-col gap-12">
      {/* Hero Mini Section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          NexGen <span className="text-blue-600">Marketplace.</span>
        </h1>
        <p className="text-slate-500 font-medium">Curated high-performance goods for the modern ecosystem.</p>
      </div>

      {/* Main Grid Component */}
      <ProductGrid initialProducts={products || []} />
    </main>
  )
}
