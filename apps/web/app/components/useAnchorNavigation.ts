'use client';

import { useCallback } from 'react';

/**
 * Provides a click handler for in-page anchor links that scrolls smoothly without
 * leaving the hash in the URL (prevents the browser from jumping on reload).
 */
export function useAnchorNavigation(offset = 96) {
  return useCallback(
    (event: React.MouseEvent<HTMLElement>, hash?: string) => {
      if (!hash || !hash.startsWith('#')) {
        return;
      }

      if (typeof window === 'undefined') {
        return;
      }

      event.preventDefault();

      const target = document.querySelector(hash);
      if (!target) {
        return;
      }

      const yPosition = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({
        top: yPosition < 0 ? 0 : yPosition,
        behavior: 'smooth',
      });

      if (window.location.hash) {
        const { pathname, search } = window.location;
        window.history.replaceState(null, '', `${pathname}${search}`);
      }
    },
    [offset],
  );
}
