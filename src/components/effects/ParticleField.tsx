'use client'

import { useEffect, useRef, useMemo, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
  color: string
}

interface ParticleFieldProps {
  /** Number of particles to render */
  count?: number
  /** Base color for particles (hex or rgba) */
  color?: string
  /** Secondary color for gradient effect */
  secondaryColor?: string
  /** Minimum particle size in pixels */
  minSize?: number
  /** Maximum particle size in pixels */
  maxSize?: number
  /** Minimum animation duration in seconds */
  minDuration?: number
  /** Maximum animation duration in seconds */
  maxDuration?: number
  /** Whether particles should respond to mouse movement */
  interactive?: boolean
  /** Mouse interaction radius in pixels */
  interactionRadius?: number
  /** Additional CSS class names */
  className?: string
  /** Whether to use blur effect on particles */
  blurred?: boolean
  /** Shape of particles: 'circle', 'star', 'square' */
  shape?: 'circle' | 'star' | 'square'
  /** Movement pattern: 'float', 'rise', 'fall', 'random' */
  movement?: 'float' | 'rise' | 'fall' | 'random'
}

const colorPresets = {
  purple: ['#9333ea', '#a855f7', '#c084fc'],
  gold: ['#fbbf24', '#f59e0b', '#fcd34d'],
  mixed: ['#9333ea', '#fbbf24', '#a855f7', '#fcd34d'],
  mystic: ['#9333ea', '#fbbf24', '#6366f1', '#a855f7'],
  cosmic: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'],
}

export function ParticleField({
  count = 50,
  color = 'purple',
  secondaryColor,
  minSize = 1,
  maxSize = 4,
  minDuration = 4,
  maxDuration = 12,
  interactive = false,
  interactionRadius = 100,
  className = '',
  blurred = false,
  shape = 'circle',
  movement = 'float',
}: ParticleFieldProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const shouldReduceMotion = useReducedMotion()

  // Get color array based on color prop
  const colors = useMemo(() => {
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return secondaryColor ? [color, secondaryColor] : [color]
    }
    return colorPresets[color as keyof typeof colorPresets] || colorPresets.purple
  }, [color, secondaryColor])

  // Generate particles with random properties
  const particles = useMemo<Particle[]>(() => {
    if (shouldReduceMotion) return []
    
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      duration: minDuration + Math.random() * (maxDuration - minDuration),
      delay: Math.random() * 5,
      opacity: 0.2 + Math.random() * 0.6,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))
  }, [count, minSize, maxSize, minDuration, maxDuration, colors, shouldReduceMotion])

  // Handle mouse movement for interactive mode
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!interactive || !containerRef.current) return
    
    const rect = containerRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [interactive])

  useEffect(() => {
    if (!interactive) return
    
    const container = containerRef.current
    if (!container) return
    
    container.addEventListener('mousemove', handleMouseMove)
    return () => container.removeEventListener('mousemove', handleMouseMove)
  }, [interactive, handleMouseMove])

  // Get animation variants based on movement type
  const getAnimationVariants = (particle: Particle) => {
    const baseVariants = {
      float: {
        y: [0, -20, 0],
        x: [0, Math.sin(particle.id) * 10, 0],
        opacity: [particle.opacity * 0.5, particle.opacity, particle.opacity * 0.5],
      },
      rise: {
        y: [100, -20],
        opacity: [0, particle.opacity, 0],
      },
      fall: {
        y: [-20, 100],
        opacity: [0, particle.opacity, 0],
      },
      random: {
        y: [0, -30, 10, -20, 0],
        x: [0, 15, -10, 20, 0],
        opacity: [particle.opacity * 0.3, particle.opacity, particle.opacity * 0.5, particle.opacity, particle.opacity * 0.3],
      },
    }
    return baseVariants[movement]
  }

  // Render particle shape
  const renderParticleShape = (particle: Particle) => {
    const baseClasses = blurred ? 'blur-[1px]' : ''
    
    if (shape === 'star') {
      return (
        <svg
          viewBox="0 0 24 24"
          className={baseClasses}
          style={{ width: particle.size * 3, height: particle.size * 3 }}
        >
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={particle.color}
          />
        </svg>
      )
    }
    
    if (shape === 'square') {
      return (
        <div
          className={`${baseClasses} rotate-45`}
          style={{
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
          }}
        />
      )
    }
    
    // Default circle
    return (
      <div
        className={`${baseClasses} rounded-full`}
        style={{
          width: particle.size,
          height: particle.size,
          backgroundColor: particle.color,
          boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
        }}
      />
    )
  }

  if (shouldReduceMotion) {
    return (
      <div 
        ref={containerRef}
        className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
        aria-hidden="true"
      >
        {particles.slice(0, Math.floor(count / 3)).map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity * 0.5,
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            scale: [0.5, 1, 0.8, 1],
            ...getAnimationVariants(particle),
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {renderParticleShape(particle)}
        </motion.div>
      ))}

      {/* Optional glow orbs for ambiance */}
      {interactive && (
        <motion.div
          className="absolute w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${colors[0]}20 0%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
          }}
          animate={{
            x: mouseRef.current.x,
            y: mouseRef.current.y,
          }}
          transition={{
            type: 'spring',
            damping: 30,
            stiffness: 200,
          }}
        />
      )}
    </div>
  )
}

// Preset configurations for common use cases
export const ParticlePresets = {
  /** Stars for night sky effect */
  stars: {
    count: 80,
    color: 'gold',
    minSize: 1,
    maxSize: 3,
    shape: 'star' as const,
    movement: 'float' as const,
  },
  /** Mystical sparkles */
  sparkles: {
    count: 40,
    color: 'mixed',
    minSize: 2,
    maxSize: 5,
    shape: 'circle' as const,
    movement: 'random' as const,
    blurred: true,
  },
  /** Cosmic dust */
  cosmic: {
    count: 100,
    color: 'cosmic',
    minSize: 1,
    maxSize: 2,
    shape: 'circle' as const,
    movement: 'rise' as const,
  },
  /** Floating orbs */
  orbs: {
    count: 20,
    color: 'mystic',
    minSize: 8,
    maxSize: 20,
    shape: 'circle' as const,
    movement: 'float' as const,
    blurred: true,
  },
}

export default ParticleField
