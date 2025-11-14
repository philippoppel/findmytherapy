'use client'

import { forwardRef, useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { cn } from '@mental-health/ui'
import { usePrefersReducedMotion } from './usePrefersReducedMotion'

interface InteractiveCardProps extends React.HTMLAttributes<HTMLDivElement> {
  glowColor?: string
}

/**
 * Subtle magnetic card that reacts to pointer movement and adds a soft glow.
 * Inspired by product marketing sites (Apple, Stripe) but still renders pure HTML content for SEO.
 */
export const InteractiveCard = forwardRef<HTMLDivElement, InteractiveCardProps>(function InteractiveCard(
  { className, children, glowColor = 'rgba(59, 130, 246, 0.25)', ...props },
  forwardedRef,
) {
  const prefersReducedMotion = usePrefersReducedMotion()
  const localRef = useRef<HTMLDivElement | null>(null)

  const mouseX = useMotionValue(50)
  const mouseY = useMotionValue(50)
  const smoothX = useSpring(mouseX, { stiffness: 180, damping: 30, mass: 0.6 })
  const smoothY = useSpring(mouseY, { stiffness: 180, damping: 30, mass: 0.6 })
  const spotlight = useMotionTemplate`radial-gradient(360px circle at ${smoothX}% ${smoothY}%, ${glowColor}, transparent 70%)`

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return
    const bounds = localRef.current?.getBoundingClientRect()
    if (!bounds) return

    const relativeX = ((event.clientX - bounds.left) / bounds.width) * 100
    const relativeY = ((event.clientY - bounds.top) / bounds.height) * 100

    mouseX.set(relativeX)
    mouseY.set(relativeY)
  }

  const handlePointerLeave = () => {
    mouseX.set(50)
    mouseY.set(50)
  }

  return (
    <motion.div
      ref={(node) => {
        localRef.current = node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef) {
          forwardedRef.current = node
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'group relative isolate overflow-hidden rounded-3xl bg-white/95 shadow-soft-lg transition-all duration-500 hover:shadow-2xl',
        prefersReducedMotion && 'transition-none hover:shadow-soft-lg',
        className,
      )}
      {...props}
    >
      {!prefersReducedMotion && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-500 group-hover:opacity-90"
          style={{ background: spotlight }}
        />
      )}
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  )
})
