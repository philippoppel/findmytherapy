'use client';

import Link from 'next/link';
import { Sparkles, MessageCircle, Brain, ArrowRight, Heart } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

type CTAVariant = 'quiz' | 'search' | 'matching' | 'triage';

interface InlineToolCTAProps {
  variant: CTAVariant;
  context?: string;
  className?: string;
}

export function InlineToolCTA({ variant, context, className = '' }: InlineToolCTAProps) {
  const { t } = useTranslation();

  const getCTAConfig = (v: CTAVariant) => {
    switch (v) {
      case 'quiz':
        return {
          href: '/quiz',
          icon: Sparkles,
          iconBg: 'bg-primary-100',
          title: t('inlineToolCTA.findTherapists'),
          description: t('inlineToolCTA.findTherapistsDesc'),
          buttonText: t('inlineToolCTA.startQuiz'),
          gradient: 'from-primary-50 via-white to-primary-50/30',
          contextTemplates: {
            Angst: {
              title: t('inlineToolCTA.anxietyHelp'),
              description: t('inlineToolCTA.anxietyHelpDesc'),
            },
            Depression: {
              title: t('inlineToolCTA.depressionSupport'),
              description: t('inlineToolCTA.depressionSupportDesc'),
            },
            Burnout: {
              title: t('inlineToolCTA.burnoutRelief'),
              description: t('inlineToolCTA.burnoutReliefDesc'),
            },
            Trauma: {
              title: t('inlineToolCTA.traumaTherapy'),
              description: t('inlineToolCTA.traumaTherapyDesc'),
            },
            Panik: {
              title: t('inlineToolCTA.panicHelp'),
              description: t('inlineToolCTA.panicHelpDesc'),
            },
          },
        };
      case 'search':
        return {
          href: '/therapists',
          icon: MessageCircle,
          iconBg: 'bg-secondary-100',
          title: t('inlineToolCTA.browseTherapists'),
          description: t('inlineToolCTA.browseTherapistsDesc'),
          buttonText: t('inlineToolCTA.findTherapistsButton'),
          gradient: 'from-secondary-50 via-white to-secondary-50/30',
        };
      case 'matching':
        return {
          href: '/triage',
          icon: Brain,
          iconBg: 'bg-primary-100',
          title: t('inlineToolCTA.scientificAssessment'),
          description: t('inlineToolCTA.scientificAssessmentDesc'),
          buttonText: t('inlineToolCTA.startAssessment'),
          gradient: 'from-primary-50 via-white to-primary-50/30',
        };
      case 'triage':
        return {
          href: '/triage',
          icon: Heart,
          iconBg: 'bg-rose-100',
          title: t('inlineToolCTA.needSupport'),
          description: t('inlineToolCTA.needSupportDesc'),
          buttonText: t('inlineToolCTA.startSelfTest'),
          gradient: 'from-rose-50 via-white to-rose-50/30',
        };
    }
  };

  const config = getCTAConfig(variant);
  const Icon = config.icon;

  let title = config.title;
  let description = config.description;

  if (context && 'contextTemplates' in config && config.contextTemplates) {
    const contextKey = Object.keys(config.contextTemplates).find((key) =>
      context.toLowerCase().includes(key.toLowerCase())
    );

    if (contextKey && config.contextTemplates[contextKey as keyof typeof config.contextTemplates]) {
      const template = config.contextTemplates[contextKey as keyof typeof config.contextTemplates];
      title = template.title;
      description = template.description;
    }
  }

  return (
    <div
      className={`my-8 rounded-2xl bg-gradient-to-br ${config.gradient} border border-primary-100/60 p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div
          className={`w-14 h-14 rounded-2xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className="w-7 h-7 text-primary-600" />
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-primary-900 mb-1">{title}</h3>
          <p className="text-sm text-muted leading-relaxed">{description}</p>
        </div>

        <Link
          href={config.href}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary-600 text-white font-medium hover:bg-primary-700 transition-all hover:shadow-lg hover:-translate-y-0.5 flex-shrink-0"
        >
          {config.buttonText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

export function InlineToolCTACompact({ variant, context }: Omit<InlineToolCTAProps, 'className'>) {
  const { t } = useTranslation();

  const getCTAConfig = (v: CTAVariant) => {
    switch (v) {
      case 'quiz':
        return {
          href: '/quiz',
          icon: Sparkles,
          iconBg: 'bg-primary-100',
          title: t('inlineToolCTA.findTherapists'),
          contextTemplates: {
            Angst: { title: t('inlineToolCTA.anxietyHelp') },
            Depression: { title: t('inlineToolCTA.depressionSupport') },
            Burnout: { title: t('inlineToolCTA.burnoutRelief') },
            Trauma: { title: t('inlineToolCTA.traumaTherapy') },
            Panik: { title: t('inlineToolCTA.panicHelp') },
          },
        };
      case 'search':
        return {
          href: '/therapists',
          icon: MessageCircle,
          iconBg: 'bg-secondary-100',
          title: t('inlineToolCTA.browseTherapists'),
        };
      case 'matching':
        return {
          href: '/triage',
          icon: Brain,
          iconBg: 'bg-primary-100',
          title: t('inlineToolCTA.scientificAssessment'),
        };
      case 'triage':
        return {
          href: '/triage',
          icon: Heart,
          iconBg: 'bg-rose-100',
          title: t('inlineToolCTA.needSupport'),
        };
    }
  };

  const config = getCTAConfig(variant);
  const Icon = config.icon;

  let title = config.title;
  if (context && 'contextTemplates' in config && config.contextTemplates) {
    const contextKey = Object.keys(config.contextTemplates).find((key) =>
      context.toLowerCase().includes(key.toLowerCase())
    );
    if (contextKey && config.contextTemplates[contextKey as keyof typeof config.contextTemplates]) {
      title = config.contextTemplates[contextKey as keyof typeof config.contextTemplates].title;
    }
  }

  return (
    <Link
      href={config.href}
      className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-primary-100 hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div
        className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
      >
        <Icon className="w-5 h-5 text-primary-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-primary-900 text-sm truncate group-hover:text-primary-600 transition-colors">
          {title}
        </p>
      </div>
      <ArrowRight className="w-4 h-4 text-primary-400 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}
