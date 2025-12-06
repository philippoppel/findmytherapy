'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Sparkles, Search, BookOpen } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

export type SearchMode = 'filter' | 'guided' | 'quiz';

interface SearchModeSelectorProps {
  initialMode?: SearchMode;
  onModeChange?: (mode: SearchMode) => void;
}

function SearchModeSelectorInner({ initialMode = 'filter', onModeChange }: SearchModeSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [activeMode, setActiveMode] = useState<SearchMode>(initialMode);

  // Sync with URL on mount
  useEffect(() => {
    const matching = searchParams.get('matching');
    const mode = searchParams.get('mode');

    if (matching === 'true') {
      setActiveMode('guided');
    } else if (mode === 'quiz') {
      setActiveMode('quiz');
    } else {
      setActiveMode('filter');
    }
  }, [searchParams]);

  const handleModeChange = useCallback((mode: SearchMode) => {
    setActiveMode(mode);
    onModeChange?.(mode);

    // Update URL without full page reload
    if (mode === 'guided') {
      router.push('/therapists?matching=true', { scroll: false });
    } else if (mode === 'quiz') {
      router.push('/therapists?mode=quiz', { scroll: false });
    } else {
      router.push('/therapists', { scroll: false });
    }
  }, [router, onModeChange]);

  const modes = [
    { id: 'guided' as const, label: t('searchMode.guidedSearch'), shortLabel: t('searchMode.guided'), icon: Sparkles },
    { id: 'filter' as const, label: t('searchMode.filterYourself'), shortLabel: t('searchMode.filter'), icon: Search },
    { id: 'quiz' as const, label: t('searchMode.quickQuiz'), shortLabel: t('searchMode.quiz'), icon: BookOpen },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = activeMode === mode.id;

        return (
          <button
            key={mode.id}
            onClick={() => handleModeChange(mode.id)}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-primary-700 shadow-lg'
                : 'bg-black/40 text-white hover:bg-black/50 active:bg-black/60 backdrop-blur-md border border-white/20'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.label}</span>
            <span className="sm:hidden">{mode.shortLabel}</span>
          </button>
        );
      })}
    </div>
  );
}

export function SearchModeSelector(props: SearchModeSelectorProps) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center gap-1.5 sm:gap-3">
        {['Geführt', 'Filter', 'Quiz'].map((label, i) => (
          <div
            key={label}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium ${
              i === 1 ? 'bg-white text-primary-700 shadow-lg' : 'bg-black/40 text-white backdrop-blur-md border border-white/20'
            }`}
          >
            <div className="w-4 h-4 bg-current opacity-50 rounded" />
            <span className="sm:hidden">{label}</span>
          </div>
        ))}
      </div>
    }>
      <SearchModeSelectorInner {...props} />
    </Suspense>
  );
}

// Standalone navigation pills for pages that don't use the unified search
export function NavigationPills({ active }: { active: SearchMode }) {
  const { t } = useTranslation();
  const modes = [
    { id: 'guided' as const, label: t('searchMode.guidedSearch'), shortLabel: t('searchMode.guided'), icon: Sparkles, href: '/therapists?matching=true' },
    { id: 'filter' as const, label: t('searchMode.filterYourself'), shortLabel: t('searchMode.filter'), icon: Search, href: '/therapists' },
    { id: 'quiz' as const, label: t('searchMode.quickQuiz'), shortLabel: t('searchMode.quiz'), icon: BookOpen, href: '/quiz' },
  ];

  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-3">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isActive = active === mode.id;

        return (
          <Link
            key={mode.id}
            href={mode.href}
            prefetch={true}
            className={`inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all ${
              isActive
                ? 'bg-white text-primary-700 shadow-lg'
                : 'bg-black/40 text-white hover:bg-black/50 active:bg-black/60 backdrop-blur-md border border-white/20'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{mode.label}</span>
            <span className="sm:hidden">{mode.shortLabel}</span>
          </Link>
        );
      })}
    </div>
  );
}
