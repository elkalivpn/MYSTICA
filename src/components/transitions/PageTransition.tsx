'use client'

import { ReactNode } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'

interface PageTransitionProps {
  children: ReactNode
  /** Animation variant: 'fade', 'slide', 'scale', 'blur' */
  variant?: 'fade' | 'slide' | 'scale' | 'blur' | 'combined'
  /** Animation duration in seconds */
  duration?: number
  /** Delay before animation starts */
  delay?: number
  /** Custom class names */
  className?: string
  /** Whether to use exit animation */
  animateExit?: boolean
  /** Animation direction for slide variant */
  direction?: 'up' | 'down' | 'left' | 'right'
}

const variants = {
  fade: {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    up: {
      initial: { opacity: 0, y: 30 },
      enter: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -20 },
    },
    down: {
      initial: { opacity: 0, y: -30 },
      enter: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 20 },
    },
    left: {
      initial: { opacity: 0, x: 30 },
      enter: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -20 },
    },
    right: {
      initial: { opacity: 0, x: -30 },
      enter: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: 20 },
    },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    enter: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.02 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    enter: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(5px)' },
  },
  combined: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    enter: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -10, scale: 1.01 },
  },
}

export function PageTransition({
  children,
  variant = 'combined',
  duration = 0.4,
  delay = 0,
  className = '',
  animateExit = true,
  direction = 'up',
}: PageTransitionProps) {
  const pathname = usePathname()
  const shouldReduceMotion = useReducedMotion()

  // Get the correct variant based on type and direction
  const getVariant = () => {
    if (variant === 'slide') {
      return variants.slide[direction]
    }
    return variants[variant]
  }

  const animationVariant = getVariant()

  // For reduced motion, use simple fade
  const reducedMotionVariant = {
    initial: { opacity: 0 },
    enter: { opacity: 1 },
    exit: { opacity: 0 },
  }

  const finalVariant = shouldReduceMotion ? reducedMotionVariant : animationVariant

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="enter"
        exit={animateExit ? 'exit' : undefined}
        variants={finalVariant}
        transition={{
          duration: shouldReduceMotion ? 0.1 : duration,
          delay: shouldReduceMotion ? 0 : delay,
          ease: [0.22, 1, 0.36, 1], // Custom ease-out curve
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

// Wrapper component for page content
export function PageTransitionWrapper({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <PageTransition variant="combined" className={className}>
      {children}
    </PageTransition>
  )
}

// Staggered children animation
export function StaggerContainer({
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
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
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
        initial: { opacity: 0, y: 20 },
        animate: {
          opacity: 1,
          y: 0,
          transition: {
            duration: shouldReduceMotion ? 0.1 : 0.4,
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

// Fade overlay for page transitions
export function TransitionOverlay({
  isVisible,
  color = '#0f0f1a',
}: {
  isVisible: boolean
  color?: string
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] pointer-events-none"
          style={{ backgroundColor: color }}
        />
      )}
    </AnimatePresence>
  )
}

export default PageTransition
