'use client';

import { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

export default function MicrositeDashboardPage() {
  const { t } = useTranslation();
  const [slug, setSlug] = useState('');
  const [customSlug, setCustomSlug] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PUBLISHED'>('DRAFT');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);
  const [slugChecking, setSlugChecking] = useState(false);
  const [infoBannerDismissed, setInfoBannerDismissed] = useState(false);

  useEffect(() => {
    fetchMicrositeData();
    // Check if info banner was dismissed
    const dismissed = localStorage.getItem('microsite-info-banner-dismissed');
    setInfoBannerDismissed(dismissed === 'true');
  }, []);

  const fetchMicrositeData = async () => {
    try {
      const response = await fetch('/api/therapist/microsite/slug');
      const data = await response.json();

      if (data.success) {
        setSlug(data.slug);
        setCustomSlug(data.slug);
        setStatus(data.status);
      }
    } catch (error) {
      console.error('Error fetching microsite data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkSlugAvailability = async (slugToCheck: string) => {
    if (slugToCheck === slug) {
      setSlugAvailable(true);
      return;
    }

    setSlugChecking(true);
    try {
      const response = await fetch('/api/therapist/microsite/slug/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: slugToCheck }),
      });
      const data = await response.json();
      setSlugAvailable(data.available);
    } catch (error) {
      console.error('Error checking slug:', error);
      setSlugAvailable(null);
    } finally {
      setSlugChecking(false);
    }
  };

  const handleSlugChange = (newSlug: string) => {
    setCustomSlug(newSlug);
    setSlugAvailable(null);

    // Debounce availability check
    const timeoutId = setTimeout(() => {
      if (newSlug.length >= 3) {
        checkSlugAvailability(newSlug);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleSaveSlug = async () => {
    if (customSlug === slug) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/therapist/microsite/slug', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: customSlug }),
      });

      const data = await response.json();

      if (data.success) {
        setSlug(data.slug);
        setMessage({ type: 'success', text: t('microsite.slugUpdated') });
      } else {
        setMessage({ type: 'error', text: data.message || t('microsite.errorSaving') });
      }
    } catch {
      setMessage({ type: 'error', text: t('microsite.errorSaving') });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublishToggle = async () => {
    setIsPublishing(true);
    setMessage(null);

    const action = status === 'PUBLISHED' ? 'unpublish' : 'publish';

    try {
      const response = await fetch('/api/therapist/microsite/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        setStatus(data.status);
        setMessage({ type: 'success', text: data.message });
      } else {
        setMessage({ type: 'error', text: data.message || t('microsite.error') });
      }
    } catch {
      setMessage({ type: 'error', text: t('microsite.errorStatusChange') });
    } finally {
      setIsPublishing(false);
    }
  };

  const handlePreview = async () => {
    // Open preview in new tab
    if (slug) {
      window.open(`/t/${slug}?preview=true`, '_blank');
    }
  };

  const handleDismissInfoBanner = () => {
    localStorage.setItem('microsite-info-banner-dismissed', 'true');
    setInfoBannerDismissed(true);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const micrositeUrl = slug ? `${window.location.origin}/t/${slug}` : '';

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('microsite.title')}</h1>
        <p className="text-gray-600">{t('microsite.subtitle')}</p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg mb-6 ${
            message.type === 'success'
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Info Banner */}
      {!infoBannerDismissed && (
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-5 mb-6 relative">
          <button
            onClick={handleDismissInfoBanner}
            className="absolute top-3 right-3 p-1 rounded-full hover:bg-primary-100 transition text-primary-700"
            aria-label={t('microsite.hideBanner')}
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Info className="h-5 w-5 text-primary-600" />
              </div>
            </div>
            <div className="flex-1 pr-8">
              <h3 className="font-semibold text-primary-900 mb-2">{t('microsite.whatIsMicrosite')}</h3>
              <p className="text-sm text-primary-800 mb-3">
                {t('microsite.micrositeDesc')}
              </p>
              <div className="text-sm text-primary-800">
                <strong>{t('microsite.benefits')}</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  <li>{t('microsite.benefit1')}</li>
                  <li>{t('microsite.benefit2')}</li>
                  <li>{t('microsite.benefit3')}</li>
                  <li>{t('microsite.benefit4')}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{t('microsite.status')}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {status === 'PUBLISHED'
                ? t('microsite.statusPublished')
                : t('microsite.statusDraft')}
            </p>
          </div>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
            }`}
          >
            {status === 'PUBLISHED' ? t('microsite.published') : t('microsite.draft')}
          </span>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePublishToggle}
            disabled={isPublishing}
            className={`px-4 py-2 rounded-md font-medium ${
              status === 'PUBLISHED'
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                : 'bg-primary-600 text-white hover:bg-primary-700'
            } disabled:opacity-50 transition-colors`}
          >
            {isPublishing ? t('microsite.loading') : status === 'PUBLISHED' ? t('microsite.unpublish') : t('microsite.publish')}
          </button>
          <button
            onClick={handlePreview}
            className="px-4 py-2 rounded-md font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t('microsite.preview')}
          </button>
        </div>
      </div>

      {/* Slug Management */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('microsite.urlAddress')}</h2>

        <div className="mb-4">
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
            {t('microsite.yourMicrositeUrl')}
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">{window.location.origin}/t/</span>
            <input
              type="text"
              id="slug"
              value={customSlug}
              onChange={(e) => handleSlugChange(e.target.value.toLowerCase())}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              placeholder="ihr-name"
            />
          </div>
          {slugChecking && <p className="text-sm text-gray-500 mt-1">{t('microsite.checkingAvailability')}</p>}
          {slugAvailable === true && customSlug !== slug && (
            <p className="text-sm text-green-600 mt-1">✓ {t('microsite.available')}</p>
          )}
          {slugAvailable === false && (
            <p className="text-sm text-red-600 mt-1">✗ {t('microsite.alreadyTaken')}</p>
          )}
        </div>

        {micrositeUrl && (
          <div className="p-3 bg-gray-50 rounded-md mb-4">
            <p className="text-sm text-gray-600 mb-1">{t('microsite.currentUrl')}</p>
            <a
              href={micrositeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 font-medium break-all"
            >
              {micrositeUrl}
            </a>
          </div>
        )}

        <button
          onClick={handleSaveSlug}
          disabled={
            isSaving || customSlug === slug || slugAvailable === false || customSlug.length < 3
          }
          className="px-4 py-2 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? t('microsite.saving') : t('microsite.saveSlug')}
        </button>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('microsite.quickLinks')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href="/dashboard/profile"
            className="p-4 border border-gray-200 rounded-md hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1">{t('microsite.editProfile')}</h3>
            <p className="text-sm text-gray-600">
              {t('microsite.editProfileDesc')}
            </p>
          </a>
          <a
            href="/dashboard/therapist/leads"
            className="p-4 border border-gray-200 rounded-md hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <h3 className="font-medium text-gray-900 mb-1">{t('microsite.requests')}</h3>
            <p className="text-sm text-gray-600">
              {t('microsite.requestsDesc')}
            </p>
          </a>
        </div>
      </div>
    </div>
  );
}
