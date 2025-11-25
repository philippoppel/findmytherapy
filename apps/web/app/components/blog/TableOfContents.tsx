'use client';

import { useEffect, useState } from 'react';
import { BlogPostSection } from '@/lib/blogData';

interface TableOfContentsProps {
  sections: BlogPostSection[];
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function TableOfContents({ sections }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -35% 0%' },
    );

    sections.forEach((section) => {
      const id = slugify(section.heading);
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [sections]);

  if (sections.length <= 2) {
    return null; // Don't show TOC for short articles
  }

  return (
    <nav className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 sm:p-6 mb-8 border border-gray-200 dark:border-gray-800 overflow-hidden">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-primary-600 dark:text-primary-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h16M4 18h16"
          />
        </svg>
        Inhaltsverzeichnis
      </h2>

      <ol className="space-y-2">
        {sections.map((section, index) => {
          const id = slugify(section.heading);
          const isActive = activeId === id;

          return (
            <li key={index}>
              <a
                href={`#${id}`}
                className={`block text-sm transition-colors ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(id);
                  if (element) {
                    const offset = 80; // Header height
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                      top: offsetPosition,
                      behavior: 'smooth',
                    });
                  }
                }}
              >
                {section.heading}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
