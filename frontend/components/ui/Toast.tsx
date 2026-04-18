'use client'

import { useToastStore } from '@/lib/store/toastStore'
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore()

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => (
        <div 
          key={t.id}
          className="pointer-events-auto bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300"
        >
          {t.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-500" />}
          {t.type === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
          {t.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-500" />}
          
          <span className="text-sm font-bold text-slate-800 mr-4">{t.message}</span>
          
          <button onClick={() => removeToast(t.id)} className="text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}
