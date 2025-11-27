'use client';

import { ChevronDown } from 'lucide-react';

export function HeroScrollIndicator() {
  const handleClick = () => {
    const nextSection = document.querySelector('[data-section-after-hero]');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Fallback: scroll to first section with an id
      const firstSection = document.querySelector('section[id]');
      if (firstSection) {
        firstSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-down {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
        .animate-bounce-down {
          animation: bounce-down 1.5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-bounce-down {
            animation: none;
          }
        }
      `}} />
      <button
        onClick={handleClick}
        className="flex flex-col items-center gap-1.5 text-neutral-500 hover:text-primary-700 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-lg px-4 py-2"
        aria-label="Nach unten scrollen"
      >
        <span className="text-sm font-medium">Mehr entdecken</span>
        <div className="animate-bounce-down">
          <ChevronDown className="h-5 w-5" />
        </div>
      </button>
    </>
  );
}
