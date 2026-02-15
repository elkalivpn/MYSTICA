'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Orb {
  id: number
  x: number
  y: number
  size: number
  color: string
  duration: number
  delay: number
  floatRange: number
}

interface FloatingOrbsProps {
  /** Number of orbs to render */
  count?: number
  /** Color theme for orbs */
  colorTheme?: 'mystic' | 'cosmic' | 'aurora' | 'fire' | 'ocean' | 'custom'
  /** Custom colors for 'custom' theme */
  customColors?: string[]
  /** Minimum orb size in pixels */
  minSize?: number
  /** Maximum orb size in pixels */
  maxSize?: number
  /** Whether orbs should have blur effect */
  blurred?: boolean
  /** Whether orbs should have inner glow */
  innerGlow?: boolean
  /** Whether orbs should have outer glow */
  outerGlow?: boolean
  /** Animation speed multiplier (1 = normal, 0.5 = slow, 2 = fast) */
  speed?: number
  /** Whether orbs should respond to scroll */
  parallax?: boolean
  /** Parallax intensity */
  parallaxIntensity?: number
  /** Position constraint: 'full', 'top', 'bottom', 'sides' */
  position?: 'full' | 'top' | 'bottom' | 'sides' | 'corners'
  /** Additional class names */
  className?: string
}

const colorThemes = {
  mystic: ['#9333ea', '#a855f7', '#fbbf24', '#6366f1'],
  cosmic: ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4'],
  aurora: ['#10b981', '#3b82f6', '#8b5cf6', '#06b6d4'],
  fire: ['#ef4444', '#f97316', '#fbbf24', '#dc2626'],
  ocean: ['#0ea5e9', '#06b6d4', '#14b8a6', '#0891b2'],
}

const positionConstraints = {
  full: { x: [0, 100], y: [0, 100] },
  top: { x: [0, 100], y: [0, 40] },
  bottom: { x: [0, 100], y: [60, 100] },
  sides: { x: [0, 15, 85, 100], y: [0, 100] },
  corners: { x: [0, 10, 90, 100], y: [0, 10, 90, 100] },
}

export function FloatingOrbs({
  count = 6,
  colorTheme = 'mystic',
  customColors,
  minSize = 30,
  maxSize = 120,
  blurred = true,
  innerGlow = true,
  outerGlow = true,
  speed = 1,
  parallax = false,
  parallaxIntensity = 0.1,
  position = 'full',
  className,
}: FloatingOrbsProps) {
  const shouldReduceMotion = useReducedMotion()

  // Get colors based on theme
  const colors = useMemo(() => {
    if (colorTheme === 'custom' && customColors) {
      return customColors
    }
    return colorThemes[colorTheme] || colorThemes.mystic
  }, [colorTheme, customColors])

  // Get position constraints
  const constraints = positionConstraints[position]

  // Generate orbs
  const orbs = useMemo<Orb[]>(() => {
    if (shouldReduceMotion) return []

    return Array.from({ length: count }, (_, i) => {
      const constraintX = constraints.x
      const constraintY = constraints.y
      
      return {
        id: i,
        x: constraintX[0] + Math.random() * (constraintX[constraintX.length - 1] - constraintX[0]),
        y: constraintY[0] + Math.random() * (constraintY[constraintY.length - 1] - constraintY[0]),
        size: minSize + Math.random() * (maxSize - minSize),
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: (8 + Math.random() * 8) / speed,
        delay: Math.random() * 5,
        floatRange: 20 + Math.random() * 30,
      }
    })
  }, [count, minSize, maxSize, colors, speed, constraints, shouldReduceMotion])

  if (shouldReduceMotion) {
    return (
      <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
        {orbs.map((orb) => (
          <div
            key={orb.id}
            className="absolute rounded-full"
            style={{
              left: `${orb.x}%`,
              top: `${orb.y}%`,
              width: orb.size,
              height: orb.size,
              background: `radial-gradient(circle at 30% 30%, ${orb.color}40, ${orb.color}20, transparent)`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
          }}
          initial={{
            x: '-50%',
            y: '-50%',
            scale: 0.8,
            opacity: 0.5,
          }}
          animate={{
            y: [
              '-50%',
              `calc(-50% - ${orb.floatRange}px)`,
              `calc(-50% + ${orb.floatRange / 2}px)`,
              '-50%',
            ],
            x: [
              '-50%',
              `calc(-50% + ${orb.floatRange / 3}px)`,
              `calc(-50% - ${orb.floatRange / 4}px)`,
              '-50%',
            ],
            scale: [0.9, 1.1, 0.95, 1],
            opacity: [0.6, 0.8, 0.5, 0.6],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {/* Outer glow */}
          {outerGlow && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: `radial-gradient(circle, transparent 40%, ${orb.color}20 60%, transparent 80%)`,
                transform: 'scale(1.5)',
                filter: 'blur(20px)',
              }}
              animate={{
                scale: [1.5, 1.8, 1.5],
                opacity: [0.4, 0.6, 0.4],
              }}
              transition={{
                duration: orb.duration * 0.8,
                delay: orb.delay,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Main orb */}
          <div
            className={cn(
              'w-full h-full rounded-full',
              blurred && 'blur-[2px]'
            )}
            style={{
              background: `radial-gradient(circle at 30% 30%, 
                ${orb.color}60 0%, 
                ${orb.color}40 30%, 
                ${orb.color}20 60%, 
                transparent 80%
              )`,
            }}
          />

          {/* Inner glow highlight */}
          {innerGlow && (
            <div
              className="absolute top-[15%] left-[20%] w-[30%] h-[30%] rounded-full"
              style={{
                background: `radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)`,
              }}
            />
          )}

          {/* Core glow */}
          <div
            className="absolute top-1/2 left-1/2 w-1/2 h-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${orb.color}80 0%, transparent 70%)`,
              filter: 'blur(4px)',
            }}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Preset components
export function MysticOrbs(props: Omit<FloatingOrbsProps, 'colorTheme'>) {
  return <FloatingOrbs colorTheme="mystic" {...props} />
}

export function CosmicOrbs(props: Omit<FloatingOrbsProps, 'colorTheme'>) {
  return <FloatingOrbs colorTheme="cosmic" {...props} />
}

export function AuroraOrbs(props: Omit<FloatingOrbsProps, 'colorTheme'>) {
  return <FloatingOrbs colorTheme="aurora" {...props} />
}

// Small floating orbs for corners
export function CornerOrbs({ className }: { className?: string }) {
  return (
    <FloatingOrbs
      count={4}
      colorTheme="mystic"
      minSize={40}
      maxSize={80}
      position="corners"
      speed={0.7}
      className={className}
    />
  )
}

export default FloatingOrbs
