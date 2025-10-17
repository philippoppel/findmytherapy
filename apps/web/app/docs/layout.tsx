import type { Metadata } from 'next';
import Link from 'next/link';

import { ThemeSwitcher } from '../../components/docs/ThemeSwitcher';

export const metadata: Metadata = {
  title: 'Design Tokens & Komponenten – Klarthera',
  description:
    'Design System Dokumentation für Farben, Komponenten und die neue Klarthera Brand Identity.',
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-surface">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-12 sm:px-10 lg:px-12">
        <header className="space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Design System: Farben & Komponenten
              </h1>
              <p className="max-w-2xl text-subtle">
                Barrierefreie Farb- und Komponenten-Bibliothek für eine senior*innenfreundliche Mental-Health-Erfahrung in
                ganz Österreich. Tokens folgen WCAG 2.2 AA und unterstützen Light, Dark & Simple Mode.
              </p>
            </div>
            <ThemeSwitcher />
          </div>
          <nav className="flex flex-wrap gap-3 text-sm font-semibold text-subtle">
            <Link className="btn btn-ghost btn-sm" href="/docs">
              Übersicht
            </Link>
            <Link className="btn btn-ghost btn-sm" href="/docs/colors">
              Farben
            </Link>
            <Link className="btn btn-ghost btn-sm" href="/docs/components">
              Komponenten
            </Link>
            <Link className="btn btn-ghost btn-sm" href="/docs/migration">
              Migration
            </Link>
          </nav>
        </header>
        <main className="pb-16">{children}</main>
      </div>
    </div>
  );
}
