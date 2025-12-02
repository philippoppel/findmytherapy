'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LayoutDashboard,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  Compass,
  Globe,
  Mail,
  BarChart3,
  FileText,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { FEATURES } from '@/lib/features';

const baseNavigation = [
  { name: 'Dashboard', href: '/dashboard/therapist', icon: LayoutDashboard },
  { name: 'Profil', href: '/dashboard/profile', icon: User },
  ...(FEATURES.MICROSITE
    ? [{ name: 'Meine Microsite', href: '/dashboard/therapist/microsite', icon: Globe }]
    : []),
  { name: 'Blog-Beiträge', href: '/dashboard/therapist/blog', icon: FileText },
  { name: 'Analytics', href: '/dashboard/therapist/analytics', icon: BarChart3 },
  { name: 'Kontaktanfragen', href: '/dashboard/therapist/leads', icon: Mail },
  { name: 'Sicherheit', href: '/dashboard/security', icon: Shield },
];

const navigation = baseNavigation;

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadLeadsCount, setUnreadLeadsCount] = useState(0);

  useEffect(() => {
    // Fetch unread leads count
    const fetchUnreadCount = async () => {
      try {
        const response = await fetch('/api/therapist/leads/unread-count');
        const data = await response.json();
        if (data.success) {
          setUnreadLeadsCount(data.count);
        }
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    // Poll every 30 seconds for updates
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-primary-50 to-primary-100">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-primary-200 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-2 text-muted hover:bg-neutral-100 lg:hidden"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-transform hover:scale-105"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary-500 to-primary-1000 shadow-lg shadow-primary-500/30">
                <Compass className="h-5 w-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold leading-tight text-neutral-900">
                  FindMyTherapy
                </span>
                <span className="text-[10px] font-medium text-primary-900">Dashboard</span>
              </div>
            </Link>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 rounded-full border border-primary-200 bg-white px-4 py-2 text-sm font-medium text-primary-900 transition hover:bg-primary-50"
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
              const showBadge = item.href === '/dashboard/therapist/leads' && unreadLeadsCount > 0;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition relative ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-500 to-primary-1000 text-white shadow-lg shadow-primary-500/30'
                      : 'text-neutral-700 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  {showBadge && (
                    <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                      {unreadLeadsCount > 9 ? '9+' : unreadLeadsCount}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = '/';
              }}
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
                  const showBadge =
                    item.href === '/dashboard/therapist/leads' && unreadLeadsCount > 0;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition relative ${
                        isActive
                          ? 'bg-gradient-to-r from-primary-500 to-primary-1000 text-white shadow-lg shadow-primary-500/30'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                      {showBadge && (
                        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                          {unreadLeadsCount > 9 ? '9+' : unreadLeadsCount}
                        </span>
                      )}
                    </Link>
                  );
                })}

                <button
                  onClick={async () => {
                    await signOut({ redirect: false });
                    window.location.href = '/';
                  }}
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
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
