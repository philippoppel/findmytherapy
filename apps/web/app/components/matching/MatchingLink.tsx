'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { useMatching } from './MatchingProvider'

interface MatchingLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (event: React.MouseEvent) => void
}

/**
 * Smart Link component that opens matching modal for /match href
 * Otherwise behaves like a normal Link
 */
export function MatchingLink({ href, children, className, onClick }: MatchingLinkProps) {
  const { openModal } = useMatching()

  if (href === '/match') {
    return (
      <button
        onClick={(e) => {
          openModal()
          onClick?.(e)
        }}
        className={className}
      >
        {children}
      </button>
    )
  }

  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
