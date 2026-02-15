'use client'

import { create } from 'zustand'

interface ConfettiState {
  isPlaying: boolean
  particleCount: number
  
  // Actions
  celebration: () => void
  bigCelebration: () => void
  stop: () => void
}

// Simple confetti effect using CSS animations
export const useConfetti = create<ConfettiState>((set, get) => ({
  isPlaying: false,
  particleCount: 50,

  celebration: () => {
    if (typeof window === 'undefined') return
    set({ isPlaying: true, particleCount: 30 })
    
    // Create confetti particles
    const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#fbbf24', '#f59e0b']
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;'
    document.body.appendChild(container)

    for (let i = 0; i < 30; i++) {
      const particle = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 10 + 5
      const startX = Math.random() * 100
      const duration = Math.random() * 2 + 2
      
      particle.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? '50%' : '0'};
        left:${startX}%;
        top:-20px;
        animation:confetti-fall ${duration}s linear forwards;
      `
      container.appendChild(particle)
    }

    // Add animation style if not exists
    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style')
      style.id = 'confetti-style'
      style.textContent = `
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    // Remove after animation
    setTimeout(() => {
      container.remove()
      set({ isPlaying: false })
    }, 4000)
  },

  bigCelebration: () => {
    if (typeof window === 'undefined') return
    set({ isPlaying: true, particleCount: 100 })
    
    // Create more confetti particles for big celebration
    const colors = ['#8b5cf6', '#a78bfa', '#c4b5fd', '#fbbf24', '#f59e0b', '#ef4444', '#22c55e', '#3b82f6']
    const container = document.createElement('div')
    container.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9999;overflow:hidden;'
    document.body.appendChild(container)

    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div')
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 12 + 6
      const startX = Math.random() * 100
      const duration = Math.random() * 3 + 2
      const delay = Math.random() * 0.5
      
      particle.style.cssText = `
        position:absolute;
        width:${size}px;
        height:${size}px;
        background:${color};
        border-radius:${Math.random() > 0.5 ? '50%' : '0'};
        left:${startX}%;
        top:-20px;
        animation:confetti-fall ${duration}s ease-out ${delay}s forwards;
      `
      container.appendChild(particle)
    }

    // Add animation style if not exists
    if (!document.getElementById('confetti-style')) {
      const style = document.createElement('style')
      style.id = 'confetti-style'
      style.textContent = `
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `
      document.head.appendChild(style)
    }

    // Remove after animation
    setTimeout(() => {
      container.remove()
      set({ isPlaying: false })
    }, 5000)
  },

  stop: () => {
    set({ isPlaying: false })
  }
}))
