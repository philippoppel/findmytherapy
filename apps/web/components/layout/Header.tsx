'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Compass, Menu, X } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import { useAnchorNavigation } from '@/app/components/useAnchorNavigation';
import { HeaderSearch } from './HeaderSearch';
import { ThemeToggle } from '../ui/ThemeToggle';

const navItems = [
  { label: 'Wissen', href: '/blog', type: 'link' as const },
  { label: 'Therapeut:innen finden', href: '/therapists', type: 'link' as const },
  { label: 'FAQ', href: '#faq', type: 'anchor' as const },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleAnchorNavigation = useAnchorNavigation();

  return (
    <header className="fixed top-3 left-0 right-0 z-50">
      <div className="header-glass relative mx-auto w-[calc(100%-1rem)] max-w-[1400px] rounded-2xl px-3 py-2 backdrop-blur-xl sm:w-[calc(100%-1.5rem)] sm:px-4 sm:py-3 lg:px-6">
        <div
          aria-hidden
          className="header-gradient pointer-events-none absolute inset-0 rounded-2xl"
        />
        <nav className="relative flex items-center justify-between gap-2 sm:gap-3">
        <Link
          href="/"
          className="group flex items-center gap-3 rounded-xl px-2 py-1.5 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-soft">
            <Compass className="h-5 w-5 text-white" aria-hidden />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-tight text-default">
              FindMyTherapy
            </span>
            <span className="hidden text-xs font-medium text-muted sm:block">Mentale Orientierung</span>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-1.5 lg:flex">
          {navItems.map((item) =>
            item.type === 'anchor' ? (
              <button
                key={item.href}
                onClick={(event) => handleAnchorNavigation(event, item.href)}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-default transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                {item.label}
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2.5 text-sm font-medium text-default transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
              >
                {item.label}
              </Link>
            ),
          )}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <HeaderSearch />
          <ThemeToggle />
          <TherapistMenu />
        </div>

        {/* Mobile: Search icon + Theme + Menu */}
        <div className="flex items-center gap-1 lg:hidden">
          <HeaderSearch />
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-11 w-11 items-center justify-center rounded-xl text-muted transition hover:bg-primary-50 hover:text-default"
            aria-label="Menü öffnen"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>
      {isMenuOpen && (
        <div className="mt-2 rounded-2xl border border-divider bg-surface-1 px-4 py-4 shadow-soft-lg sm:px-6 lg:hidden">
          <div className="space-y-1.5">
            {navItems.map((item) =>
              item.type === 'anchor' ? (
                <button
                  key={item.href}
                  onClick={(event) => {
                    handleAnchorNavigation(event, item.href);
                    setIsMenuOpen(false);
                  }}
                  className="block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-default transition hover:bg-primary-50"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-semibold text-default transition hover:bg-primary-50"
                >
                  {item.label}
                </Link>
              ),
            )}
          </div>
          <div className="mt-4 border-t border-divider pt-4">
            <TherapistMenu dense />
          </div>
        </div>
      )}
      </div>
    </header>
  );
}

function TherapistMenu({ dense = false }: { dense?: boolean }) {
  const { status } = useSession();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const buttonClasses = dense
    ? 'w-full justify-between rounded-xl border border-divider px-4 py-3 text-sm font-semibold text-default transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2'
    : 'inline-flex items-center gap-2 rounded-full border border-divider bg-surface-1 px-4 py-2.5 text-sm font-semibold text-default shadow-soft transition hover:-translate-y-0.5 hover:shadow-soft-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2';

  return (
    <div className="relative" ref={menuRef}>
      <button className={buttonClasses} onClick={() => setOpen((prev) => !prev)}>
        Für Therapeut:innen
        <ChevronDown className="h-4 w-4 text-muted" aria-hidden />
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-64 rounded-2xl border border-divider bg-surface-1 p-2 shadow-soft-xl">
          {status === 'authenticated' ? (
            <div className="space-y-1">
              <MenuItem href="/dashboard" label="Zum Dashboard" onClick={() => setOpen(false)} />
              <MenuItem href="/dashboard/profile" label="Profil & Praxis" onClick={() => setOpen(false)} />
              <button
                onClick={() => {
                  setOpen(false);
                  signOut({ callbackUrl: '/' });
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-danger-700 transition hover:bg-danger-50"
              >
                Abmelden
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <MenuItem href="/for-therapists" label="Überzeugt mich" onClick={() => setOpen(false)} />
              <MenuItem href="/login" label="Anmelden" onClick={() => setOpen(false)} />
              <MenuItem href="/register" label="Registrieren" onClick={() => setOpen(false)} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function MenuItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-xl px-3 py-2 text-sm font-semibold text-default transition hover:bg-primary-50"
    >
      {label}
    </Link>
  );
}
