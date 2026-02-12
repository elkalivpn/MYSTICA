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
  subscriptionEnd?: string
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
      createdAt: new Date().toISOString()
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
      subscriptionEnd: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    }
  },
  'free@mystica.com': {
    password: 'free123',
    user: {
      id: '3',
      name: 'Usuario Gratis',
      email: 'free@mystica.com',
      role: 'free',
      createdAt: new Date().toISOString()
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
  return user.role === 'premium' || user.role === 'admin'
})
