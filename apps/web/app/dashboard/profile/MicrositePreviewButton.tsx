'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Loader2 } from 'lucide-react';

export function MicrositePreviewButton() {
  const [slug, setSlug] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSlug();
  }, []);

  const fetchSlug = async () => {
    try {
      const response = await fetch('/api/therapist/microsite/slug');
      const data = await response.json();

      if (data.success && data.slug) {
        setSlug(data.slug);
      }
    } catch (error) {
      console.error('Error fetching slug:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    if (slug) {
      window.open(`/t/${slug}`, '_blank', 'noopener,noreferrer');
    }
  };

  if (isLoading) {
    return (
      <button
        disabled
        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg text-sm font-medium cursor-not-allowed"
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Lädt...
      </button>
    );
  }

  if (!slug) {
    return null;
  }

  return (
    <button
      onClick={handlePreview}
      className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-primary-500 text-primary-700 rounded-lg text-sm font-medium hover:bg-primary-50 transition shadow-sm"
    >
      <ExternalLink className="h-4 w-4" />
      Microsite-Vorschau
    </button>
  );
}
