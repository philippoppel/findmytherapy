'use client'

import { ReactNode } from 'react'
import Link from 'next/link'

interface MatchingLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: (event: React.MouseEvent) => void
}

/**
 * Link component for matching navigation
 * Always navigates directly to the page (no modal)
 */
export function MatchingLink({ href, children, className, onClick }: MatchingLinkProps) {
  return (
    <Link href={href} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
