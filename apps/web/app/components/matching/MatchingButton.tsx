'use client'

import { ReactNode } from 'react'
import { useMatching } from './MatchingProvider'

interface MatchingButtonProps {
  children: ReactNode
  className?: string
  variant?: 'primary' | 'secondary' | 'link'
}

export function MatchingButton({ children, className = '', variant = 'primary' }: MatchingButtonProps) {
  const { openModal } = useMatching()

  const baseStyles = 'inline-flex items-center justify-center gap-2 transition-all font-semibold'

  const variantStyles = {
    primary: 'rounded-full bg-primary-600 px-6 py-3 text-sm text-white shadow-lg hover:bg-primary-700 hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'rounded-full border-2 border-white/40 bg-white/15 px-6 py-3 text-sm text-white backdrop-blur-md hover:border-white/50 hover:bg-white/25 hover:shadow-xl hover:-translate-y-0.5',
    link: 'text-primary-700 hover:text-primary-900 underline-offset-4 hover:underline'
  }

  return (
    <button
      onClick={openModal}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  )
}
