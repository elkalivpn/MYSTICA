'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MysticalGlowProps {
  /** Color theme: 'purple', 'gold', 'mixed', or custom hex color */
  color?: 'purple' | 'gold' | 'mixed' | 'cosmic' | string
  /** Glow intensity: 'subtle', 'normal', 'intense', 'extreme' */
  intensity?: 'subtle' | 'normal' | 'intense' | 'extreme'
  /** Size of the glow effect in pixels */
  size?: number
  /** Whether the glow should animate */
  animated?: boolean
  /** Animation duration in seconds */
  animationDuration?: number
  /** Whether to use a pulsing effect */
  pulse?: boolean
  /** Whether to show multiple layers */
  layered?: boolean
  /** Position: 'center', 'top', 'bottom', 'left', 'right' */
  position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
  /** Custom class names */
  className?: string
  /** Children to render inside */
  children?: React.ReactNode
  /** Whether the glow should follow a gradient animation */
  gradientFlow?: boolean
  /** Opacity of the glow */
  opacity?: number
}

const colorMap = {
  purple: {
    primary: '#9333ea',
    secondary: '#a855f7',
    tertiary: '#c084fc',
  },
  gold: {
    primary: '#fbbf24',
    secondary: '#f59e0b',
    tertiary: '#fcd34d',
  },
  mixed: {
    primary: '#9333ea',
    secondary: '#fbbf24',
    tertiary: '#a855f7',
  },
  cosmic: {
    primary: '#3b82f6',
    secondary: '#8b5cf6',
    tertiary: '#ec4899',
  },
}

const intensityMap = {
  subtle: {
    blur: 40,
    opacity: 0.15,
    layers: 1,
  },
  normal: {
    blur: 60,
    opacity: 0.25,
    layers: 2,
  },
  intense: {
    blur: 80,
    opacity: 0.35,
    layers: 3,
  },
  extreme: {
    blur: 120,
    opacity: 0.5,
    layers: 4,
  },
}

const positionMap = {
  center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  top: 'top-0 left-1/2 -translate-x-1/2 -translate-y-1/2',
  bottom: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2',
  left: 'top-1/2 left-0 -translate-x-1/2 -translate-y-1/2',
  right: 'top-1/2 right-0 translate-x-1/2 -translate-y-1/2',
}

export function MysticalGlow({
  color = 'purple',
  intensity = 'normal',
  size = 200,
  animated = true,
  animationDuration = 4,
  pulse = true,
  layered = true,
  position = 'center',
  className,
  children,
  gradientFlow = false,
  opacity,
}: MysticalGlowProps) {
  const shouldReduceMotion = useReducedMotion()

  // Get color values
  const colors = useMemo(() => {
    if (color.startsWith('#') || color.startsWith('rgb')) {
      return {
        primary: color,
        secondary: color,
        tertiary: color,
      }
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.purple
  }, [color])

  // Get intensity values
  const intensityValues = intensityMap[intensity]

  // Calculate final opacity
  const finalOpacity = opacity ?? intensityValues.opacity

  // Animation variants
  const glowVariants = {
    initial: {
      scale: 1,
      opacity: finalOpacity,
    },
    animate: {
      scale: [1, 1.1, 1],
      opacity: [finalOpacity, finalOpacity * 1.2, finalOpacity],
    },
  }

  const gradientVariants = {
    initial: {
      backgroundPosition: '0% 50%',
    },
    animate: {
      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    },
  }

  // Generate glow layers
  const layers = layered ? intensityValues.layers : 1

  if (shouldReduceMotion || !animated) {
    return (
      <div className={cn('relative', className)}>
        <div
          className={cn('absolute pointer-events-none', positionMap[position])}
          style={{
            width: size,
            height: size,
            background: `radial-gradient(circle, ${colors.primary}${Math.round(finalOpacity * 100).toString(16).padStart(2, '0')} 0%, ${colors.secondary}50 40%, transparent 70%)`,
            filter: `blur(${intensityValues.blur / 2}px)`,
          }}
        />
        {children}
      </div>
    )
  }

  return (
    <div className={cn('relative', className)}>
      {/* Glow layers */}
      {Array.from({ length: layers }).map((_, index) => (
        <motion.div
          key={index}
          className={cn('absolute pointer-events-none', positionMap[position])}
          style={{
            width: size * (1 + index * 0.3),
            height: size * (1 + index * 0.3),
            background: gradientFlow
              ? `linear-gradient(45deg, ${colors.primary}, ${colors.secondary}, ${colors.tertiary}, ${colors.primary})`
              : `radial-gradient(circle, ${colors.primary} 0%, ${colors.secondary} 40%, transparent 70%)`,
            filter: `blur(${intensityValues.blur - index * 15}px)`,
            opacity: finalOpacity * (1 - index * 0.15),
          }}
          variants={gradientFlow ? gradientVariants : glowVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: animationDuration + index * 0.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: index * 0.2,
          }}
        />
      ))}

      {/* Pulse rings */}
      {pulse && (
        <>
          <motion.div
            className={cn('absolute pointer-events-none rounded-full', positionMap[position])}
            style={{
              width: size * 0.6,
              height: size * 0.6,
              border: `2px solid ${colors.primary}40`,
            }}
            animate={{
              scale: [1, 2],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
          <motion.div
            className={cn('absolute pointer-events-none rounded-full', positionMap[position])}
            style={{
              width: size * 0.6,
              height: size * 0.6,
              border: `2px solid ${colors.secondary}30`,
            }}
            animate={{
              scale: [1, 2],
              opacity: [0.3, 0],
            }}
            transition={{
              duration: animationDuration,
              repeat: Infinity,
              ease: 'easeOut',
              delay: animationDuration / 2,
            }}
          />
        </>
      )}

      {/* Content */}
      {children && (
        <div className="relative z-10">
          {children}
        </div>
      )}
    </div>
  )
}

// Preset glow components for common use cases
export function PurpleGlow(props: Omit<MysticalGlowProps, 'color'>) {
  return <MysticalGlow color="purple" {...props} />
}

export function GoldGlow(props: Omit<MysticalGlowProps, 'color'>) {
  return <MysticalGlow color="gold" {...props} />
}

export function CosmicGlow(props: Omit<MysticalGlowProps, 'color'>) {
  return <MysticalGlow color="cosmic" {...props} />
}

export function MysticalAura({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('relative', className)}>
      <MysticalGlow
        color="mixed"
        intensity="intense"
        size={300}
        animated
        gradientFlow
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default MysticalGlow
