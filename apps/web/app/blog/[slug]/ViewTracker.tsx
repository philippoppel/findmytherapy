'use client';

import { useEffect } from 'react';

interface ViewTrackerProps {
  slug: string;
}

export default function ViewTracker({ slug }: ViewTrackerProps) {
  useEffect(() => {
    // Track view after a short delay to avoid counting quick bounces
    const timer = setTimeout(() => {
      fetch(`/api/blog/${slug}/view`, {
        method: 'POST',
      }).catch(() => {
        // Silently fail - view tracking shouldn't break the page
      });
    }, 2000); // 2 second delay

    return () => clearTimeout(timer);
  }, [slug]);

  // This component doesn't render anything
  return null;
}
