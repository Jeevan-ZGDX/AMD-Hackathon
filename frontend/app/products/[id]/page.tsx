import { fetchProductById } from '@/lib/api'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export const revalidate = 60;

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  try {
    const product = await fetchProductById(params.id);
    
    if (!product) {
      return notFound();
    }

    const isOutOfStock = product.stock_count === 0;

    return (
      <main className="min-h-screen px-6 md:px-12 py-10 max-w-7xl mx-auto">
        <ProductDetailClient product={product} isOutOfStock={isOutOfStock} />
      </main>
    );
  } catch (error) {
    console.error("Error loading product:", error);
    return notFound();
  }
}
