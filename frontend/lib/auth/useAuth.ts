import { create } from 'zustand'
import { createClient } from '@/lib/supabase/client'
import { type User } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  role: 'customer' | 'retailer' | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setRole: (role: 'customer' | 'retailer' | null) => void
  setLoading: (isLoading: boolean) => void
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  isLoading: true,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setLoading: (isLoading) => set({ isLoading }),
  signOut: async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    set({ user: null, role: null })
  },
}))

// Export a simpler hook for UI usage as requested
export const useAuth = () => {
  const { user, role, isLoading, signOut } = useAuthStore()
  return { user, role, isLoading, signOut }
}
