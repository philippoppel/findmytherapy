'use client'

import { type ElementType, type PropsWithChildren, useEffect, useRef, useState } from 'react'
import { cn } from '@mental-health/ui'

type RevealVariant = 'up' | 'scale'

interface RevealProps extends PropsWithChildren {
  as?: ElementType
  className?: string
  delay?: number
  variant?: RevealVariant
}

export function Reveal({
  as: Component = 'div',
  className,
  children,
  delay = 0,
  variant = 'up',
}: RevealProps) {
  const ref = useRef<Element | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const variantClasses =
    variant === 'scale'
      ? 'opacity-0 scale-[0.97]'
      : 'opacity-0 translate-y-4'

  const visibleClasses = 'opacity-100 translate-y-0 scale-100'

  return (
    <Component
      ref={(node: Element | null) => {
        ref.current = node
      }}
      className={cn(
        'transition-all duration-1000 will-change-transform',
        !visible && variantClasses,
        visible && visibleClasses,
        className,
      )}
      style={{
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {children}
    </Component>
  )
}
