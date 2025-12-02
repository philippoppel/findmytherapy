'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { LayoutDashboard, LogOut, Shield, User } from 'lucide-react';

export function AuthHeader() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (status === 'loading') {
    return <div className="h-9 w-28 animate-pulse rounded-full bg-primary-100" />;
  }

  if (!session) {
    return (
      <div className="flex w-full flex-wrap items-center gap-2 md:w-auto md:flex-nowrap">
        <Link
          href="/login"
          className="w-full rounded-full border border-neutral-300 px-4 py-2 text-center text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:w-auto"
        >
          Anmelden
        </Link>
        <Link
          href="/register"
          className="w-full rounded-full bg-primary-100 px-4 py-2 text-center text-sm font-semibold text-primary-900 shadow-sm transition hover:bg-primary-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 md:w-auto"
        >
          Registrieren
        </Link>
      </div>
    );
  }

  const role = session.user?.role;
  const isAdmin = role === 'ADMIN';
  const isTherapist = role === 'THERAPIST';
  const isClient = role === 'CLIENT';
  const dashboardHref = isAdmin ? '/admin' : '/dashboard';
  const showSecurityLink = isTherapist || isAdmin;
  const profileHref = isTherapist ? '/dashboard/profile' : isAdmin ? '/admin' : '/settings';
  const profileLabel = isTherapist
    ? 'Profil verwalten'
    : isAdmin
      ? 'Adminbereich'
      : 'Profil & Einstellungen';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsMenuOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full border border-neutral-300 px-2 py-1.5 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:bg-neutral-50 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100">
          <User className="h-4 w-4 text-primary-900" aria-hidden />
        </div>
        <span className="hidden md:block">{session.user?.email?.split('@')[0]}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-neutral-200 bg-white py-3 shadow-xl backdrop-blur-lg">
          <div className="border-b border-neutral-200 px-5 pb-3">
            <p className="text-sm font-semibold text-neutral-900">{session.user?.email}</p>
            <p className="text-xs text-muted">
              {isAdmin ? 'Administrator' : isTherapist ? 'Therapeut:in' : 'Klient:in'}
            </p>
          </div>

          {(isTherapist || isAdmin) && (
            <HeaderMenuLink
              href={dashboardHref}
              label="Dashboard"
              icon={<LayoutDashboard className="h-4 w-4" />}
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {isClient && (
            <HeaderMenuLink
              href="/courses"
              label="Meine Kurse"
              icon={<LayoutDashboard className="h-4 w-4" />}
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          {showSecurityLink && (
            <HeaderMenuLink
              href="/dashboard/security"
              label="Sicherheit"
              icon={<Shield className="h-4 w-4" />}
              onClick={() => setIsMenuOpen(false)}
            />
          )}

          <HeaderMenuLink
            href={profileHref}
            label={profileLabel}
            icon={<User className="h-4 w-4" />}
            onClick={() => setIsMenuOpen(false)}
          />

          <button
            onClick={async () => {
              setIsMenuOpen(false);
              await signOut({ redirect: false });
              window.location.href = '/';
            }}
            className="mt-2 flex w-full items-center justify-start gap-2 border-t border-neutral-200 px-5 pt-3 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            <LogOut className="h-4 w-4" />
            Abmelden
          </button>
        </div>
      )}
    </div>
  );
}

function HeaderMenuLink({
  href,
  label,
  icon,
  onClick,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
      onClick={onClick}
    >
      <span className="text-muted">{icon}</span>
      {label}
    </Link>
  );
}
