'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'

const registerSchema = z.object({
  full_name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirm_password: z.string(),
  store_name: z.string().optional(),
  store_description: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ["confirm_password"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

interface RegisterFormProps {
  role: 'customer' | 'retailer'
}

export default function RegisterForm({ role }: RegisterFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)
    
    const { error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          role: role,
          full_name: data.full_name,
          store_name: data.store_name,
          store_description: data.store_description,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setIsLoading(false)
      return
    }

    setIsSuccess(true)
    setIsLoading(false)
  }

  if (isSuccess) {
    return (
      <div className="text-center p-8 bg-emerald-50 border border-emerald-100 rounded-2xl">
        <h3 className="text-xl font-bold text-emerald-900 mb-2">Check your email.</h3>
        <p className="text-sm text-emerald-700">We've sent a confirmation link to your inbox. Please verify your account to continue.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}
      
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Full Name</label>
        <input 
          {...register('full_name')}
          placeholder="Ananya K."
          className={`input-field w-full ${errors.full_name ? 'border-red-500' : ''}`}
        />
        {errors.full_name && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.full_name.message}</p>}
      </div>

      {role === 'retailer' && (
        <>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Store Name</label>
            <input 
              {...register('store_name')}
              placeholder="FreshMart HQ"
              className={`input-field w-full ${errors.store_name ? 'border-red-500' : ''}`}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Store Description</label>
            <textarea 
              {...register('store_description')}
              placeholder="A high-performance retail node..."
              className="input-field w-full min-h-[80px]"
            />
          </div>
        </>
      )}

      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Email Address</label>
        <input 
          {...register('email')}
          type="email" 
          placeholder="name@company.com"
          className={`input-field w-full ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.email.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Password</label>
          <input 
            {...register('password')}
            type="password" 
            placeholder="••••••••"
            className={`input-field w-full ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.password.message}</p>}
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1.5 block">Confirm</label>
          <input 
            {...register('confirm_password')}
            type="password" 
            placeholder="••••••••"
            className={`input-field w-full ${errors.confirm_password ? 'border-red-500' : ''}`}
          />
          {errors.confirm_password && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.confirm_password.message}</p>}
        </div>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full btn-primary flex items-center justify-center gap-2 mt-4"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
        Create {role.charAt(0).toUpperCase() + role.slice(1)} Account
      </button>
    </form>
  )
}
