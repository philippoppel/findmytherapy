'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LayoutDashboard, Shield, User, LogOut, Menu, X, Compass } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard/therapist', icon: LayoutDashboard },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
  { name: 'Sicherheit', href: '/dashboard/security', icon: Shield },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-teal-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-105">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/30">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight text-neutral-900">
                  FindMyTherapy
                </span>
                <span className="text-[10px] font-medium text-teal-600">Dashboard</span>
              </div>
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-teal-200 bg-white px-4 py-2 text-sm font-medium text-teal-700 transition hover:bg-teal-50"
          >
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Zur Homepage</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar - Desktop */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <nav className="sticky top-20 space-y-1 p-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                      : 'text-neutral-700 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="mt-4 flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
            >
              <LogOut className="h-5 w-5" />
              Abmelden
            </button>
          </nav>
        </aside>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            onKeyDown={(e) => e.key === 'Escape' && setIsMobileMenuOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Close menu"
          >
            <div
              className="absolute left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white shadow-xl"
              role="navigation"
            >
              <nav className="space-y-1 p-4">
                {navigation.map((item) => {
                  const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="mt-4 flex w-full items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                >
                  <LogOut className="h-5 w-5" />
                  Abmelden
                </button>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
