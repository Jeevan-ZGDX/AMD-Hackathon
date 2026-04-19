'use client'

import { useEffect } from 'react'
import { useAuthStore } from './useAuth'
import { createClient } from '@/lib/supabase/client'

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setRole, setLoading } = useAuthStore()
  const supabase = createClient()

  useEffect(() => {
    const hydrateAuth = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        
        if (profile) setRole(profile.role)
      }
      
      setLoading(false)
    }

    hydrateAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (session?.user) {
        setUser(session.user)
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single()
        if (profile) setRole(profile.role)
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setRole, setLoading, supabase])

  return <>{children}</>
}
