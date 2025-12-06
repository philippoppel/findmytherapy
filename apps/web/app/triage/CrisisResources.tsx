'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  Phone,
  Heart,
  Wind,
  Info,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

type CrisisResourcesProps = {
  className?: string;
};

export function CrisisResources({ className = '' }: CrisisResourcesProps) {
  const { t } = useTranslation();
  const [expandedExercise, setExpandedExercise] = useState<number | null>(null);

  const emergencyContacts = [
    {
      name: t('crisis.telefonseelsorge'),
      number: '142',
      description: t('crisis.telefonseelsorgeDesc'),
      available: '24/7',
      type: 'crisis' as const,
    },
    {
      name: t('crisis.kiz'),
      number: '01 406 95 95',
      description: t('crisis.kizDesc'),
      available: 'Mo-Fr 10-17',
      website: 'https://www.kriseninterventionszentrum.at',
      type: 'crisis' as const,
    },
    {
      name: t('crisis.psychiatricHelp'),
      number: '01 313 30',
      description: t('crisis.psychiatricHelpDesc'),
      available: '24/7',
      type: 'emergency' as const,
    },
    {
      name: t('crisis.emergencyCall'),
      number: '144',
      description: t('crisis.emergencyCallDesc'),
      available: '24/7',
      type: 'emergency' as const,
    },
  ];

  const immediateExercises = [
    {
      title: t('crisis.grounding'),
      icon: Wind,
      description: t('crisis.groundingDesc'),
      steps: [
        t('crisis.groundingStep1'),
        t('crisis.groundingStep2'),
        t('crisis.groundingStep3'),
        t('crisis.groundingStep4'),
        t('crisis.groundingStep5'),
      ],
    },
    {
      title: t('crisis.breathing'),
      icon: Heart,
      description: t('crisis.breathingDesc'),
      steps: [
        t('crisis.breathingStep1'),
        t('crisis.breathingStep2'),
        t('crisis.breathingStep3'),
        t('crisis.breathingStep4'),
      ],
    },
  ];

  return (
    <div className={`rounded-3xl border-2 border-red-300 bg-red-50 p-6 shadow-lg ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white">
          <AlertTriangle className="h-6 w-6" aria-hidden />
        </div>
        <div>
          <h3 className="text-xl font-bold text-red-900">{t('crisis.immediateSupport')}</h3>
          <p className="text-sm text-red-800">{t('crisis.notAlone')}</p>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="mb-6 rounded-xl bg-red-100 p-4">
        <p className="text-sm font-semibold text-red-900">
          {t('crisis.dangerWarning')}
        </p>
      </div>

      {/* Emergency Contacts */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-900">
          {t('crisis.emergencyNumbersAustria')}
        </h4>
        <div className="space-y-2">
          {emergencyContacts.map((contact) => (
            <div key={contact.name} className="rounded-xl border border-red-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h5 className="font-semibold text-default">{contact.name}</h5>
                  <p className="mt-0.5 text-xs text-muted">{contact.description}</p>
                  <p className="mt-1 text-xs text-muted">{t('crisis.available')}: {contact.available}</p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end">
                  {contact.number && (
                    <a
                      href={`tel:${contact.number.replace(/\s/g, '')}`}
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-red-500 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 sm:w-auto"
                    >
                      <Phone className="h-4 w-4" aria-hidden />
                      {contact.number}
                    </a>
                  )}
                  {contact.website && (
                    <a
                      href={contact.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border-2 border-primary-600 bg-white px-3 py-1.5 text-sm font-semibold text-primary-700 transition hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 sm:w-auto"
                    >
                      {t('crisis.website')}
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Exercises */}
      <div>
        <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide text-red-900">
          {t('crisis.immediateExercises')}
        </h4>
        <div className="space-y-2">
          {immediateExercises.map((exercise, index) => (
            <div key={exercise.title} className="rounded-xl border border-red-200 bg-white p-4">
              <button
                type="button"
                onClick={() => setExpandedExercise(expandedExercise === index ? null : index)}
                className="flex w-full items-start justify-between gap-3 text-left"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <exercise.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div>
                    <h5 className="font-semibold text-default">{exercise.title}</h5>
                    <p className="mt-0.5 text-sm text-muted">{exercise.description}</p>
                  </div>
                </div>
                {expandedExercise === index ? (
                  <ChevronUp className="h-5 w-5 flex-none text-muted" aria-hidden />
                ) : (
                  <ChevronDown className="h-5 w-5 flex-none text-muted" aria-hidden />
                )}
              </button>
              {expandedExercise === index && (
                <div className="mt-3 rounded-lg bg-surface-1 p-3">
                  <ol className="space-y-2 text-sm text-default">
                    {exercise.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start gap-2">
                        <span className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {stepIndex + 1}
                        </span>
                        <span className="mt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-6 flex items-start gap-2 rounded-lg bg-red-100 p-3">
        <Info className="h-4 w-4 flex-none text-red-800" aria-hidden />
        <p className="text-xs text-red-800">
          {t('crisis.disclaimer')}
        </p>
      </div>
    </div>
  );
}
