'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackLinkProps {
  href?: string;
  label?: string;
  variant?: 'light' | 'dark';
  className?: string;
}

const variantStyles = {
  light: 'text-slate-600 hover:text-primary-600',
  dark: 'text-white/70 hover:text-white',
};

/**
 * Einheitlicher Back-Link für alle Seiten.
 * Positioniert oben links mit ArrowLeft-Icon.
 */
export function BackLink({
  href = '/',
  label = 'Zurück zur Startseite',
  variant = 'light',
  className = '',
}: BackLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 transition-colors group ${variantStyles[variant]} ${className}`}
    >
      <ArrowLeft
        className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
        aria-hidden
      />
      <span>{label}</span>
    </Link>
  );
}