'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Lock, Eye, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@mental-health/ui';
import { useTranslation } from '@/lib/i18n';

interface HealthDataConsentDialogProps {
  onConsent: () => void;
  onDecline: () => void;
  source?: string;
}

export function HealthDataConsentDialog({
  onConsent,
  onDecline,
  source = 'triage_flow',
}: HealthDataConsentDialogProps) {
  const { t } = useTranslation();
  const [hasRead, setHasRead] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConsent = async () => {
    setIsSubmitting(true);
    try {
      // Save consent to database
      const response = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scope: 'DATA_PROCESSING',
          source,
          metadata: {
            consentVersion: '1.0',
            timestamp: new Date().toISOString(),
          },
        }),
      });

      if (response.ok) {
        onConsent();
      } else {
        console.error('Failed to save consent');
        // Still allow user to proceed even if DB save fails
        onConsent();
      }
    } catch (error) {
      console.error('Error saving consent:', error);
      // Still allow user to proceed
      onConsent();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" />

      {/* Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border border-gray-200 bg-white shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 border-b border-gray-200 bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-8 sm:px-8">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1 text-white">
                <h2 className="mb-2 text-2xl font-bold sm:text-3xl">
                  {t('healthConsent.title')}
                </h2>
                <p className="text-sm text-white/90 sm:text-base">
                  {t('healthConsent.subtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6 p-6 sm:p-8">
            {/* Important Notice */}
            <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-5">
              <div className="flex gap-3">
                <AlertTriangle className="h-6 w-6 shrink-0 text-amber-600" />
                <div className="space-y-2 text-sm text-amber-900">
                  <p className="font-semibold">{t('healthConsent.importantNote')}</p>
                  <p>
                    {t('healthConsent.importantNoteText')}
                  </p>
                  <p className="text-xs text-amber-800">
                    {t('healthConsent.anonymousHint')}
                  </p>
                </div>
              </div>
            </div>

            {/* What data we collect */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <FileText className="h-5 w-5 text-teal-600" />
                {t('healthConsent.whatWeCollect')}
              </h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    {t('healthConsent.phq9Title')}
                  </h4>
                  <p className="text-gray-700">
                    {t('healthConsent.phq9Desc')}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    {t('healthConsent.gad7Title')}
                  </h4>
                  <p className="text-gray-700">
                    {t('healthConsent.gad7Desc')}
                  </p>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h4 className="mb-2 font-semibold text-gray-900">
                    {t('healthConsent.riskTitle')}
                  </h4>
                  <p className="text-gray-700">
                    {t('healthConsent.riskDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* How we protect data */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Lock className="h-5 w-5 text-teal-600" />
                {t('healthConsent.howWeProtect')}
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <h4 className="font-semibold text-teal-900">{t('healthConsent.encryption')}</h4>
                  </div>
                  <p className="text-sm text-teal-800">
                    {t('healthConsent.encryptionDesc')}
                  </p>
                </div>
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <h4 className="font-semibold text-teal-900">{t('healthConsent.accessControl')}</h4>
                  </div>
                  <p className="text-sm text-teal-800">
                    {t('healthConsent.accessControlDesc')}
                  </p>
                </div>
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <h4 className="font-semibold text-teal-900">{t('healthConsent.auditLogs')}</h4>
                  </div>
                  <p className="text-sm text-teal-800">
                    {t('healthConsent.auditLogsDesc')}
                  </p>
                </div>
                <div className="rounded-lg border border-teal-200 bg-teal-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-teal-600" />
                    <h4 className="font-semibold text-teal-900">{t('healthConsent.euServer')}</h4>
                  </div>
                  <p className="text-sm text-teal-800">
                    {t('healthConsent.euServerDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Your rights */}
            <div className="space-y-4">
              <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Eye className="h-5 w-5 text-teal-600" />
                {t('healthConsent.yourRights')}
              </h3>
              <div className="space-y-2 text-sm text-gray-700">
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>
                      <strong>{t('healthConsent.rightRevoke')}</strong> {t('healthConsent.rightRevokeDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>
                      <strong>{t('healthConsent.rightAccess')}</strong> {t('healthConsent.rightAccessDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>
                      <strong>{t('healthConsent.rightDelete')}</strong> {t('healthConsent.rightDeleteDesc')}
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" />
                    <span>
                      <strong>{t('healthConsent.rightControl')}</strong> {t('healthConsent.rightControlDesc')}
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Legal basis */}
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-5 text-sm text-gray-700">
              <p className="mb-2">
                <strong>{t('healthConsent.legalBasis')}</strong> {t('healthConsent.legalBasisText')}
              </p>
              <p>
                <strong>{t('healthConsent.retention')}</strong> {t('healthConsent.retentionText')}
              </p>
            </div>

            {/* Consent checkbox */}
            <div className="rounded-xl border-2 border-gray-300 bg-white p-5">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={hasRead}
                  onChange={(e) => setHasRead(e.target.checked)}
                  className="mt-1 h-5 w-5 shrink-0 cursor-pointer rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-500"
                />
                <span className="text-sm text-gray-900">
                  {t('healthConsent.consentText')}
                </span>
              </label>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <Link
                href="/privacy#health-data"
                target="_blank"
                className="hover:text-teal-600 hover:underline"
              >
                {t('healthConsent.moreInfo')}
              </Link>
              <Link href="/privacy" target="_blank" className="hover:text-teal-600 hover:underline">
                {t('healthConsent.fullPrivacy')}
              </Link>
              <Link href="/contact" target="_blank" className="hover:text-teal-600 hover:underline">
                {t('healthConsent.contactPrivacy')}
              </Link>
            </div>
          </div>

          {/* Actions */}
          <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8">
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={handleConsent}
                disabled={!hasRead || isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
                size="lg"
              >
                {isSubmitting ? t('healthConsent.saving') : t('healthConsent.consentAndContinue')}
              </Button>
              <Button
                onClick={onDecline}
                variant="outline"
                className="sm:w-auto"
                size="lg"
                disabled={isSubmitting}
              >
                {t('healthConsent.decline')}
              </Button>
            </div>
            {!hasRead && (
              <p className="mt-3 text-center text-xs text-gray-500">
                {t('healthConsent.pleaseConfirm')}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
