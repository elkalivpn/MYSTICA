'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'premium' | 'free'
  avatar?: string
  createdAt: string
  // Stripe fields
  stripeCustomerId?: string
  subscriptionStatus?: 'active' | 'canceled' | 'past_due' | 'trialing' | 'none'
  subscriptionEnd?: string
  subscriptionPlan?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  loginAsAdmin: () => void
  loginAsPremium: () => void
  loginAsFree: () => void
  logout: () => void
  updateRole: (role: User['role']) => void
  updateSubscription: (data: Partial<Pick<User, 'stripeCustomerId' | 'subscriptionStatus' | 'subscriptionEnd' | 'subscriptionPlan'>>) => void
}

// Demo users for testing
const demoUsers: Record<string, { password: string; user: User }> = {
  'admin@mystica.com': {
    password: 'admin123',
    user: {
      id: '1',
      name: 'Admin Mystica',
      email: 'admin@mystica.com',
      role: 'admin',
      createdAt: new Date().toISOString(),
      subscriptionStatus: 'none',
    }
  },
  'premium@mystica.com': {
    password: 'premium123',
    user: {
      id: '2',
      name: 'Usuario Premium',
      email: 'premium@mystica.com',
      role: 'premium',
      createdAt: new Date().toISOString(),
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      subscriptionStatus: 'active',
      subscriptionPlan: 'premium-yearly',
    }
  },
  'free@mystica.com': {
    password: 'free123',
    user: {
      id: '3',
      name: 'Usuario Gratis',
      email: 'free@mystica.com',
      role: 'free',
      createdAt: new Date().toISOString(),
      subscriptionStatus: 'none',
    }
  }
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const demoUser = demoUsers[email]
        if (demoUser && demoUser.password === password) {
          set({ 
            user: demoUser.user, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },

      loginAsAdmin: () => {
        const adminUser = demoUsers['admin@mystica.com'].user
        set({ 
          user: adminUser, 
          isAuthenticated: true 
        })
      },

      loginAsPremium: () => {
        const premiumUser = demoUsers['premium@mystica.com'].user
        set({ 
          user: premiumUser, 
          isAuthenticated: true 
        })
      },

      loginAsFree: () => {
        const freeUser = demoUsers['free@mystica.com'].user
        set({ 
          user: freeUser, 
          isAuthenticated: true 
        })
      },

      logout: () => {
        set({ 
          user: null, 
          isAuthenticated: false 
        })
      },

      updateRole: (role) => {
        set((state) => ({
          user: state.user ? { ...state.user, role } : null
        }))
      },

      updateSubscription: (data) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null
        }))
      }
    }),
    {
      name: 'mystica-auth',
    }
  )
)

// Helper hooks
export const useUser = () => useAuth((state) => state.user)
export const useIsAuthenticated = () => useAuth((state) => state.isAuthenticated)
export const useIsAdmin = () => useAuth((state) => state.user?.role === 'admin')
export const useIsPremium = () => useAuth((state) => {
  const user = state.user
  if (!user) return false
  
  // Check role
  if (user.role === 'premium' || user.role === 'admin') return true
  
  // Check subscription status
  if (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing') {
    // Also check if subscription hasn't expired
    if (user.subscriptionEnd) {
      return new Date(user.subscriptionEnd) > new Date()
    }
    return true
  }
  
  return false
})

// Hook to check if user has valid premium subscription from Stripe
export const useHasValidSubscription = () => useAuth((state) => {
  const user = state.user
  if (!user) return false
  
  // Admin always has access
  if (user.role === 'admin') return true
  
  // Check active subscription
  if (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing') {
    if (user.subscriptionEnd) {
      return new Date(user.subscriptionEnd) > new Date()
    }
    return true
  }
  
  return false
})
