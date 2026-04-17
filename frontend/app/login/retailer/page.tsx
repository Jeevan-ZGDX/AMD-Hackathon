import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function RetailerLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 p-10 rounded-2xl shadow-xl shadow-slate-200/50">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Retailer Portal</h1>
        <p className="text-sm text-slate-500 mb-8">Access your operations dashboard and inventory controls.</p>
        
        <LoginForm role="retailer" />
        
        <p className="mt-8 text-center text-xs text-slate-500 font-bold">
          Partner with us? <Link href="/register/retailer" className="text-blue-600 hover:underline">Register your store</Link>
        </p>
      </div>
    </div>
  )
}
