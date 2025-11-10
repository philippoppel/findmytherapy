'use client';

import { useEffect } from 'react';

interface MicrositeAnalyticsProps {
  profileId: string;
  slug: string;
}

export function MicrositeAnalytics({ profileId, slug }: MicrositeAnalyticsProps) {
  useEffect(() => {
    // Track pageview
    const trackPageView = async () => {
      try {
        // Generate session ID (stored in sessionStorage for deduplication)
        let sessionId = sessionStorage.getItem('microsite_session_id');
        if (!sessionId) {
          sessionId = `${Date.now()}-${Math.random().toString(36).substring(2)}`;
          sessionStorage.setItem('microsite_session_id', sessionId);
        }

        // Get referrer and user agent
        const source = document.referrer || 'direct';
        const userAgent = navigator.userAgent;

        // Send tracking data (fire and forget)
        fetch('/api/microsites/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            profileId,
            slug,
            sessionId,
            source,
            userAgent,
          }),
        }).catch((error) => {
          // Silent fail - analytics should not break UX
          console.debug('Analytics tracking failed:', error);
        });

        // Also track with Plausible if available
        if (typeof window !== 'undefined' && 'plausible' in window) {
          // @ts-expect-error - plausible is injected at runtime
          window.plausible('Microsite View', {
            props: { slug, profileId },
          });
        }
      } catch (error) {
        console.debug('Analytics error:', error);
      }
    };

    trackPageView();
  }, [profileId, slug]);

  return null; // This component doesn't render anything
}
