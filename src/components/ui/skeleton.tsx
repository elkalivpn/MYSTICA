import { cn } from "@/lib/utils"

interface SkeletonProps extends React.ComponentProps<"div"> {
  /** Animation variant: 'shimmer', 'pulse', 'wave' */
  variant?: 'shimmer' | 'pulse' | 'wave'
  /** Size preset: 'card', 'text', 'circle', 'avatar', 'image' */
  size?: 'card' | 'text' | 'circle' | 'avatar' | 'image' | 'button'
  /** Width override (CSS value) */
  width?: string
  /** Height override (CSS value) */
  height?: string
  /** Number of lines for text variant */
  lines?: number
}

// Size presets
const sizePresets = {
  card: { width: 'w-full', height: 'h-48' },
  text: { width: 'w-full', height: 'h-4' },
  circle: { width: 'w-12', height: 'h-12' },
  avatar: { width: 'w-10', height: 'h-10' },
  image: { width: 'w-full', height: 'h-32' },
  button: { width: 'w-24', height: 'h-10' },
}

// Animation classes
const animationVariants = {
  shimmer: 'skeleton-shimmer',
  pulse: 'animate-pulse bg-muted/30',
  wave: 'skeleton-wave',
}

function Skeleton({ 
  className, 
  variant = 'shimmer',
  size,
  width,
  height,
  lines = 1,
  ...props 
}: SkeletonProps) {
  const preset = size ? sizePresets[size] : null

  if (size === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            data-slot="skeleton"
            className={cn(
              "rounded-md",
              animationVariants[variant],
              i === lines - 1 ? 'w-3/4' : 'w-full',
              'h-4',
              className
            )}
            {...props}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-md",
        animationVariants[variant],
        preset?.width,
        preset?.height,
        width,
        height,
        size === 'circle' || size === 'avatar' ? 'rounded-full' : '',
        className
      )}
      style={{
        width: width || undefined,
        height: height || undefined,
      }}
      {...props}
    />
  )
}

// Card skeleton with multiple elements
function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4 p-4 rounded-xl bg-card/50 border border-border/50", className)}>
      <Skeleton size="image" className="rounded-lg" />
      <div className="space-y-2">
        <Skeleton width="w-3/4" className="h-5" />
        <Skeleton size="text" />
        <Skeleton size="text" />
      </div>
      <div className="flex gap-2">
        <Skeleton width="w-16" className="h-6 rounded-full" />
        <Skeleton width="w-20" className="h-6 rounded-full" />
      </div>
    </div>
  )
}

// Profile/Avatar skeleton
function SkeletonAvatar({ 
  size = 'md',
  className 
}: { 
  size?: 'sm' | 'md' | 'lg'
  className?: string 
}) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Skeleton className={cn("rounded-full", sizeMap[size])} />
      <div className="space-y-2 flex-1">
        <Skeleton width="w-24" className="h-4" />
        <Skeleton width="w-32" className="h-3" />
      </div>
    </div>
  )
}

// List item skeleton
function SkeletonList({ 
  count = 3,
  className 
}: { 
  count?: number
  className?: string 
}) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-card/30">
          <Skeleton size="avatar" />
          <div className="space-y-2 flex-1">
            <Skeleton width="w-1/2" className="h-4" />
            <Skeleton width="w-3/4" className="h-3" />
          </div>
        </div>
      ))}
    </div>
  )
}

// Stat card skeleton
function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 rounded-xl bg-card/30 border border-border/30", className)}>
      <Skeleton width="w-8 h-8" className="rounded-full mb-2" />
      <Skeleton width="w-12" className="h-6 mb-1" />
      <Skeleton width="w-16" className="h-3" />
    </div>
  )
}

// Meditation card skeleton
function SkeletonMeditation({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 rounded-xl bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20", className)}>
      <div className="flex items-start gap-4">
        <Skeleton width="w-16" className="h-16 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton width="w-2/3" className="h-5" />
          <Skeleton width="w-full" className="h-3" />
          <Skeleton width="w-1/2" className="h-3" />
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Skeleton width="w-16" className="h-6 rounded-full" />
        <Skeleton width="w-20" className="h-6 rounded-full" />
      </div>
    </div>
  )
}

// Tarot card skeleton
function SkeletonTarot({ className }: { className?: string }) {
  return (
    <div className={cn("aspect-[2/3] rounded-xl bg-gradient-to-br from-purple-900/30 to-indigo-900/30 border border-purple-500/20 p-3", className)}>
      <div className="h-full flex flex-col justify-between">
        <Skeleton width="w-8 h-8" className="rounded-full mx-auto" />
        <div className="space-y-2">
          <Skeleton width="w-3/4 mx-auto" className="h-4" />
          <Skeleton width="w-1/2 mx-auto" className="h-3" />
        </div>
        <Skeleton width="w-full" className="h-4" />
      </div>
    </div>
  )
}

// Guide/NPC skeleton
function SkeletonGuide({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-center gap-4 p-4", className)}>
      <Skeleton width="w-24 h-24" className="rounded-full" />
      <div className="text-center space-y-2 w-full">
        <Skeleton width="w-20 mx-auto" className="h-5" />
        <Skeleton width="w-28 mx-auto" className="h-3" />
        <div className="flex justify-center gap-2 mt-2">
          <Skeleton width="w-16" className="h-5 rounded-full" />
          <Skeleton width="w-16" className="h-5 rounded-full" />
        </div>
      </div>
      <Skeleton width="w-full" className="h-20 rounded-lg" />
    </div>
  )
}

export { 
  Skeleton, 
  SkeletonCard, 
  SkeletonAvatar, 
  SkeletonList,
  SkeletonStat,
  SkeletonMeditation,
  SkeletonTarot,
  SkeletonGuide 
}
