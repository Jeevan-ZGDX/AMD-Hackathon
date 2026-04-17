import RegisterForm from '@/components/auth/RegisterForm'
import Link from 'next/link'

export default function CustomerRegisterPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-slate-200 p-10 rounded-2xl shadow-xl shadow-slate-200/50">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Join NexGen</h1>
        <p className="text-sm text-slate-500 mb-8">Create your shopper profile for predictive retail benefits.</p>
        
        <RegisterForm role="customer" />
        
        <p className="mt-8 text-center text-xs text-slate-500 font-bold">
          Already have an account? <Link href="/login/customer" className="text-blue-600 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
