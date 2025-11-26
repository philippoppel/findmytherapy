'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Sparkles, SlidersHorizontal } from 'lucide-react';

type TherapistSearchItem = {
  id: string;
  name: string;
  focus: string[];
  city: string | null;
  image: string | null;
  initials: string;
};

export function HeaderSearch() {
  const [therapists, setTherapists] = useState<TherapistSearchItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load therapist data on first interaction
  const loadTherapists = useCallback(async () => {
    if (isLoaded) return;
    try {
      const res = await fetch('/api/therapists/search-index');
      if (res.ok) {
        const data = await res.json();
        setTherapists(data);
      }
    } catch (error) {
      console.error('Failed to load search index:', error);
    } finally {
      setIsLoaded(true);
    }
  }, [isLoaded]);

  // Filter therapists based on query
  const results = query.trim().length >= 2
    ? therapists
        .filter((t) => {
          const q = query.toLowerCase();
          return (
            t.name.toLowerCase().includes(q) ||
            t.focus.some((f) => f.toLowerCase().includes(q)) ||
            (t.city && t.city.toLowerCase().includes(q))
          );
        })
        .slice(0, 5)
    : [];

  // Total selectable items: results + 2 CTAs
  const totalItems = results.length + 2;

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus mobile input when opened
  useEffect(() => {
    if (isMobileOpen && mobileInputRef.current) {
      mobileInputRef.current.focus();
    }
  }, [isMobileOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isOpen && !isMobileOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveIndex((prev) => (prev < totalItems - 1 ? prev + 1 : 0));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalItems - 1));
          break;
        case 'Enter':
          e.preventDefault();
          if (activeIndex >= 0 && activeIndex < results.length) {
            router.push(`/therapists/${results[activeIndex].id}`);
            closeSearch();
          } else if (activeIndex === results.length) {
            router.push('/quiz');
            closeSearch();
          } else if (activeIndex === results.length + 1) {
            router.push('/therapists');
            closeSearch();
          } else if (query.trim()) {
            router.push(`/therapists?q=${encodeURIComponent(query)}`);
            closeSearch();
          }
          break;
        case 'Escape':
          closeSearch();
          break;
      }
    },
    [isOpen, isMobileOpen, activeIndex, results, totalItems, query, router]
  );

  const closeSearch = () => {
    setIsOpen(false);
    setIsMobileOpen(false);
    setQuery('');
    setActiveIndex(-1);
  };

  const handleInputChange = (value: string) => {
    setQuery(value);
    setIsOpen(true);
    setActiveIndex(-1);
  };

  return (
    <>
      {/* Desktop Search */}
      <div ref={containerRef} className="relative hidden lg:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => {
                  setIsOpen(true);
                  loadTherapists();
                }}
            onKeyDown={handleKeyDown}
            placeholder="Therapeut:in suchen..."
            className="h-10 w-64 rounded-full border border-neutral-200 bg-white/80 pl-10 pr-4 text-sm text-neutral-900 placeholder:text-muted transition focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            aria-label="Therapeut:innen suchen"
            aria-expanded={isOpen}
            aria-controls="search-results"
            aria-activedescendant={activeIndex >= 0 ? `search-item-${activeIndex}` : undefined}
            role="combobox"
            autoComplete="off"
          />
        </div>

        {/* Dropdown */}
        {isOpen && (
          <div
            id="search-results"
            role="listbox"
            className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-neutral-200 bg-white p-2 shadow-lg"
          >
            {query.trim().length < 2 ? (
              <div className="px-3 py-4 text-center text-sm text-muted">
                Mind. 2 Zeichen eingeben...
              </div>
            ) : results.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-muted">
                Keine Treffer gefunden
              </div>
            ) : (
              <div className="space-y-1">
                {results.map((therapist, index) => (
                  <Link
                    key={therapist.id}
                    id={`search-item-${index}`}
                    href={`/therapists/${therapist.id}`}
                    onClick={closeSearch}
                    role="option"
                    aria-selected={activeIndex === index}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                      activeIndex === index
                        ? 'bg-primary-50 text-primary-900'
                        : 'hover:bg-neutral-50'
                    }`}
                  >
                    {therapist.image ? (
                      <Image
                        src={therapist.image}
                        alt=""
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                        {therapist.initials}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-neutral-900">
                        {therapist.name}
                      </div>
                      <div className="truncate text-xs text-muted">
                        {therapist.focus.slice(0, 2).join(', ')}
                        {therapist.city && ` • ${therapist.city}`}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* CTAs */}
            <div className="mt-2 border-t border-neutral-100 pt-2">
              <Link
                id={`search-item-${results.length}`}
                href="/quiz"
                onClick={closeSearch}
                role="option"
                aria-selected={activeIndex === results.length}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                  activeIndex === results.length
                    ? 'bg-primary-50 text-primary-900'
                    : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-100 text-secondary-600">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">Matching starten</div>
                  <div className="text-xs text-muted">Finde passende Empfehlungen</div>
                </div>
              </Link>

              <Link
                id={`search-item-${results.length + 1}`}
                href="/therapists"
                onClick={closeSearch}
                role="option"
                aria-selected={activeIndex === results.length + 1}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                  activeIndex === results.length + 1
                    ? 'bg-primary-50 text-primary-900'
                    : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                  <SlidersHorizontal className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900">Erweiterte Filter</div>
                  <div className="text-xs text-muted">Alle Suchoptionen nutzen</div>
                </div>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Button */}
      <button
        type="button"
        onClick={() => {
          setIsMobileOpen(true);
          loadTherapists();
        }}
        className="flex h-10 w-10 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-primary-50 hover:text-primary-700 lg:hidden"
        aria-label="Suche öffnen"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Mobile Fullscreen Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[60] bg-white lg:hidden">
          <div className="flex h-full flex-col">
            {/* Mobile Header */}
            <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  ref={mobileInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Therapeut:in suchen..."
                  className="h-11 w-full rounded-xl border border-neutral-200 bg-neutral-50 pl-10 pr-4 text-base text-neutral-900 placeholder:text-muted focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  autoComplete="off"
                />
              </div>
              <button
                type="button"
                onClick={closeSearch}
                className="flex h-11 w-11 items-center justify-center rounded-xl text-neutral-600 transition hover:bg-neutral-100"
                aria-label="Suche schließen"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Mobile Results */}
            <div className="flex-1 overflow-y-auto p-4">
              {query.trim().length < 2 ? (
                <div className="py-8 text-center text-sm text-muted">
                  Mind. 2 Zeichen eingeben...
                </div>
              ) : results.length === 0 ? (
                <div className="py-8 text-center text-sm text-muted">
                  Keine Treffer gefunden
                </div>
              ) : (
                <div className="space-y-2">
                  {results.map((therapist, index) => (
                    <Link
                      key={therapist.id}
                      href={`/therapists/${therapist.id}`}
                      onClick={closeSearch}
                      className={`flex items-center gap-3 rounded-xl p-3 transition ${
                        activeIndex === index
                          ? 'bg-primary-50'
                          : 'bg-neutral-50 active:bg-neutral-100'
                      }`}
                    >
                      {therapist.image ? (
                        <Image
                          src={therapist.image}
                          alt=""
                          width={48}
                          height={48}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                          {therapist.initials}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-neutral-900">
                          {therapist.name}
                        </div>
                        <div className="truncate text-sm text-muted">
                          {therapist.focus.slice(0, 2).join(', ')}
                          {therapist.city && ` • ${therapist.city}`}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Mobile CTAs */}
              <div className="mt-6 space-y-3">
                <Link
                  href="/quiz"
                  onClick={closeSearch}
                  className="flex items-center gap-4 rounded-2xl border border-secondary-200 bg-secondary-50 p-4 transition active:bg-secondary-100"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary-200 text-secondary-700">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-secondary-900">Matching starten</div>
                    <div className="text-sm text-secondary-700">Finde passende Empfehlungen</div>
                  </div>
                </Link>

                <Link
                  href="/therapists"
                  onClick={closeSearch}
                  className="flex items-center gap-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-4 transition active:bg-neutral-100"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-200 text-neutral-600">
                    <SlidersHorizontal className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-900">Erweiterte Filter</div>
                    <div className="text-sm text-muted">Alle Suchoptionen nutzen</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
