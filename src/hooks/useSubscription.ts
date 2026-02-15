'use client'

import { useRef, useEffect, useCallback } from 'react'
import { create } from 'zustand'
import { SubscriptionInfo } from '@/lib/stripe/config'

interface SubscriptionState {
  subscription: SubscriptionInfo | null
  isLoading: boolean
  error: string | null
  checkSubscription: (userId: string) => Promise<void>
  createCheckout: (userId: string, email: string, name: string, planId: string) => Promise<string | null>
  cancelSubscription: (userId: string, immediately?: boolean) => Promise<boolean>
  openPortal: (userId: string) => Promise<string | null>
  reset: () => void
}

export const useSubscription = create<SubscriptionState>((set, get) => ({
  subscription: null,
  isLoading: false,
  error: null,

  checkSubscription: async (userId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch(`/api/stripe/subscription?userId=${userId}`)
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to check subscription')
      }
      
      const subscription: SubscriptionInfo = await response.json()
      set({ subscription, isLoading: false })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to check subscription'
      set({ error: errorMessage, isLoading: false })
    }
  },

  createCheckout: async (userId: string, email: string, name: string, planId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, email, name, planId }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create checkout session')
      }
      
      const { url } = await response.json()
      set({ isLoading: false })
      return url
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout'
      set({ error: errorMessage, isLoading: false })
      return null
    }
  },

  cancelSubscription: async (userId: string, immediately: boolean = false) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, immediately }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel subscription')
      }
      
      // Refresh subscription status
      await get().checkSubscription(userId)
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel subscription'
      set({ error: errorMessage, isLoading: false })
      return false
    }
  },

  openPortal: async (userId: string) => {
    set({ isLoading: true, error: null })
    
    try {
      const response = await fetch('/api/stripe/subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to open portal')
      }
      
      const { url } = await response.json()
      set({ isLoading: false })
      return url
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to open portal'
      set({ error: errorMessage, isLoading: false })
      return null
    }
  },

  reset: () => {
    set({ subscription: null, isLoading: false, error: null })
  },
}))

// Hook for easier use with automatic synchronization
export function useSubscriptionSync(userId?: string) {
  const { subscription, isLoading, error, checkSubscription } = useSubscription()
  const hasCheckedRef = useRef(false)

  useEffect(() => {
    if (userId && !hasCheckedRef.current) {
      hasCheckedRef.current = true
      checkSubscription(userId)
    }
  }, [userId, checkSubscription])

  const refresh = useCallback(() => {
    if (userId) {
      checkSubscription(userId)
    }
  }, [userId, checkSubscription])

  return {
    subscription,
    isLoading,
    error,
    isPremium: subscription?.isPremium ?? false,
    refresh,
  }
}

// Hook for checking premium status
export function usePremiumStatus(userId?: string) {
  const { isPremium, isLoading } = useSubscriptionSync(userId)
  return { isPremium, isLoading }
}
