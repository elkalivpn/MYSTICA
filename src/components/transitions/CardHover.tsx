'use client'

import { useState, useRef, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardHoverProps {
  children: ReactNode
  /** Whether to enable 3D tilt effect */
  tilt?: boolean
  /** Tilt intensity multiplier */
  tiltIntensity?: number
  /** Whether to enable glare effect */
  glare?: boolean
  /** Glare color */
  glareColor?: string
  /** Whether to enable hover lift */
  lift?: boolean
  /** Lift distance in pixels */
  liftDistance?: number
  /** Whether to enable border glow */
  borderGlow?: boolean
  /** Border glow color */
  glowColor?: string
  /** Whether to enable scale effect */
  scale?: boolean
  /** Scale amount (1.05 = 5% larger) */
  scaleAmount?: number
  /** Custom class names */
  className?: string
  /** Class names for hover state */
  hoverClassName?: string
  /** Callback when hover state changes */
  onHoverChange?: (isHovered: boolean) => void
  /** Whether to disable all effects */
  disabled?: boolean
}

export function CardHover({
  children,
  tilt = true,
  tiltIntensity = 10,
  glare = true,
  glareColor = 'rgba(255, 255, 255, 0.15)',
  lift = true,
  liftDistance = 8,
  borderGlow = true,
  glowColor = 'rgba(139, 92, 246, 0.4)',
  scale = false,
  scaleAmount = 1.02,
  className,
  hoverClassName,
  onHoverChange,
  disabled = false,
}: CardHoverProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [tiltStyle, setTiltStyle] = useState({ rotateX: 0, rotateY: 0 })
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 })
  const cardRef = useRef<HTMLDivElement>(null)
  const shouldReduceMotion = useReducedMotion()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || shouldReduceMotion || !cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Calculate tilt
    if (tilt) {
      const rotateY = ((x - centerX) / centerX) * tiltIntensity
      const rotateX = ((centerY - y) / centerY) * tiltIntensity
      setTiltStyle({ rotateX, rotateY })
    }

    // Calculate glare position
    if (glare) {
      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
      })
    }
  }

  const handleMouseEnter = () => {
    if (disabled) return
    setIsHovered(true)
    onHoverChange?.(true)
  }

  const handleMouseLeave = () => {
    if (disabled) return
    setIsHovered(false)
    onHoverChange?.(false)
    setTiltStyle({ rotateX: 0, rotateY: 0 })
  }

  // Build transform style
  const getTransform = () => {
    const transforms: string[] = []

    if (tilt && !shouldReduceMotion) {
      transforms.push(`perspective(1000px)`)
      transforms.push(`rotateX(${tiltStyle.rotateX}deg)`)
      transforms.push(`rotateY(${tiltStyle.rotateY}deg)`)
    }

    if (lift && isHovered) {
      transforms.push(`translateY(-${liftDistance}px)`)
    }

    if (scale && isHovered) {
      transforms.push(`scale(${scaleAmount})`)
    }

    return transforms.join(' ')
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'relative transition-all duration-300 ease-out',
        isHovered && hoverClassName,
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        transform: getTransform(),
      }}
      transition={{
        duration: shouldReduceMotion ? 0 : 0.15,
        ease: 'easeOut',
      }}
    >
      {/* Border glow effect */}
      {borderGlow && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            boxShadow: `
              0 0 20px ${glowColor},
              0 0 40px ${glowColor}50,
              inset 0 0 20px ${glowColor}20
            `,
            borderRadius: 'inherit',
          }}
        />
      )}

      {/* Glare effect */}
      {glare && isHovered && !shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 rounded-inherit pointer-events-none overflow-hidden"
          style={{ borderRadius: 'inherit' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glareColor} 0%, transparent 60%)`,
            }}
          />
        </motion.div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

// Preset card variants
export function GlowCard({
  children,
  className,
  glowColor = 'rgba(139, 92, 246, 0.3)',
}: {
  children: ReactNode
  className?: string
  glowColor?: string
}) {
  return (
    <CardHover
      tilt={false}
      glare={false}
      lift
      borderGlow
      glowColor={glowColor}
      className={className}
    >
      {children}
    </CardHover>
  )
}

export function TiltCard({
  children,
  className,
  intensity = 15,
}: {
  children: ReactNode
  className?: string
  intensity?: number
}) {
  return (
    <CardHover
      tilt
      tiltIntensity={intensity}
      glare
      lift
      scale
      scaleAmount={1.02}
      className={className}
    >
      {children}
    </CardHover>
  )
}

export function PremiumCard({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <CardHover
      tilt
      tiltIntensity={12}
      glare
      glareColor="rgba(251, 191, 36, 0.12)"
      lift
      liftDistance={12}
      borderGlow
      glowColor="rgba(139, 92, 246, 0.4)"
      scale
      scaleAmount={1.02}
      className={className}
    >
      {children}
    </CardHover>
  )
}

// Grid of animated cards
export function AnimatedCardGrid({
  children,
  className,
  staggerDelay = 0.1,
}: {
  children: ReactNode
  className?: string
  staggerDelay?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      className={cn('grid gap-4', className)}
      initial="initial"
      animate="animate"
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedGridItem({
  children,
  className,
  index = 0,
}: {
  children: ReactNode
  className?: string
  index?: number
}) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 30, scale: 0.95 },
        animate: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: shouldReduceMotion ? 0.1 : 0.5,
            delay: shouldReduceMotion ? 0 : index * 0.1,
            ease: [0.22, 1, 0.36, 1],
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default CardHover
