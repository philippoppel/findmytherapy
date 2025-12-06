'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface TranslatedBackLinkProps {
  href: string;
  translationKey: string;
  variant?: 'light' | 'dark';
  className?: string;
}

const variantStyles = {
  light: 'text-slate-600 hover:text-primary-600',
  dark: 'text-white/70 hover:text-white',
};

export function TranslatedBackLink({
  href,
  translationKey,
  variant = 'light',
  className = '',
}: TranslatedBackLinkProps) {
  const { t } = useTranslation();

  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 transition-colors group ${variantStyles[variant]} ${className}`}
    >
      <ArrowLeft
        className="h-5 w-5 transition-transform group-hover:-translate-x-0.5"
        aria-hidden
      />
      <span>{t(translationKey)}</span>
    </Link>
  );
}
