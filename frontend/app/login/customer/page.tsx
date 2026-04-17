import LoginForm from '@/components/auth/LoginForm'
import Link from 'next/link'

export default function CustomerLoginPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 p-10 rounded-2xl shadow-xl shadow-slate-200/50">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Customer Login</h1>
        <p className="text-sm text-slate-500 mb-8">Sign in to start your autonomous shopping experience.</p>
        
        <LoginForm role="customer" />
        
        <p className="mt-8 text-center text-xs text-slate-500 font-bold">
          New here? <Link href="/register/customer" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  )
}
