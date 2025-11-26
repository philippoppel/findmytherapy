'use client';

import Link from 'next/link';
import { Sparkles, MessageCircle, Brain, ArrowRight, Heart } from 'lucide-react';

type CTAVariant = 'quiz' | 'search' | 'matching' | 'triage';

interface InlineToolCTAProps {
  variant: CTAVariant;
  context?: string; // z.B. "Angst" für kontextbezogenen Text
  className?: string;
}

const CTA_CONFIG: Record<CTAVariant, {
  href: string;
  icon: typeof Sparkles;
  iconBg: string;
  title: string;
  description: string;
  buttonText: string;
  gradient: string;
  contextTemplates?: Record<string, { title: string; description: string }>;
}> = {
  quiz: {
    href: '/quiz',
    icon: Sparkles,
    iconBg: 'bg-primary-100',
    title: 'Passende Therapeut:innen finden',
    description: '6 kurze Fragen – in 2 Minuten zu personalisierten Empfehlungen.',
    buttonText: 'Quiz starten',
    gradient: 'from-primary-50 via-white to-primary-50/30',
    contextTemplates: {
      Angst: {
        title: 'Hilfe bei Angst finden',
        description: 'Finde Therapeut:innen, die auf Angststörungen spezialisiert sind.',
      },
      Depression: {
        title: 'Unterstützung bei Depression',
        description: 'Finde Therapeut:innen, die dir bei depressiven Symptomen helfen können.',
      },
      Burnout: {
        title: 'Aus dem Burnout finden',
        description: 'Finde Therapeut:innen mit Expertise in Erschöpfung und Burnout.',
      },
      Trauma: {
        title: 'Traumatherapie finden',
        description: 'Finde spezialisierte Traumatherapeut:innen in deiner Nähe.',
      },
      Panik: {
        title: 'Hilfe bei Panikattacken',
        description: 'Finde Therapeut:innen mit Erfahrung in der Behandlung von Panik.',
      },
    },
  },
  search: {
    href: '/therapists',
    icon: MessageCircle,
    iconBg: 'bg-secondary-100',
    title: 'Therapeut:innen durchsuchen',
    description: 'Durchsuche unser Netzwerk nach Standort, Spezialisierung und Verfügbarkeit.',
    buttonText: 'Therapeut:innen finden',
    gradient: 'from-secondary-50 via-white to-secondary-50/30',
  },
  matching: {
    href: '/triage',
    icon: Brain,
    iconBg: 'bg-primary-100',
    title: 'Wissenschaftliche Ersteinschätzung',
    description: 'Validierte Fragebögen helfen dir, deine Situation besser einzuordnen.',
    buttonText: 'Ersteinschätzung starten',
    gradient: 'from-primary-50 via-white to-primary-50/30',
  },
  triage: {
    href: '/triage',
    icon: Heart,
    iconBg: 'bg-rose-100',
    title: 'Brauchst du Unterstützung?',
    description: 'Eine kurze Selbsteinschätzung kann dir helfen, den nächsten Schritt zu finden.',
    buttonText: 'Selbsttest starten',
    gradient: 'from-rose-50 via-white to-rose-50/30',
  },
};

export function InlineToolCTA({ variant, context, className = '' }: InlineToolCTAProps) {
  const config = CTA_CONFIG[variant];
  const Icon = config.icon;

  // Kontextbezogener Text
  let title = config.title;
  let description = config.description;

  if (context && config.contextTemplates) {
    // Suche nach passendem Kontext-Template
    const contextKey = Object.keys(config.contextTemplates).find(
      key => context.toLowerCase().includes(key.toLowerCase())
    );

    if (contextKey && config.contextTemplates[contextKey]) {
      title = config.contextTemplates[contextKey].title;
      description = config.contextTemplates[contextKey].description;
    }
  }

  return (
    <div
      className={`my-8 rounded-2xl bg-gradient-to-br ${config.gradient} border border-primary-100/60 p-6 sm:p-8 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        {/* Icon */}
        <div className={`w-14 h-14 rounded-2xl ${config.iconBg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="w-7 h-7 text-primary-600" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="text-lg font-bold text-primary-900 mb-1">{title}</h3>
          <p className="text-sm text-muted leading-relaxed">{description}</p>
        </div>

        {/* Button */}
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

// Kompakte Version für Sidebar oder kleinere Bereiche
export function InlineToolCTACompact({ variant, context }: Omit<InlineToolCTAProps, 'className'>) {
  const config = CTA_CONFIG[variant];
  const Icon = config.icon;

  let title = config.title;
  if (context && config.contextTemplates) {
    const contextKey = Object.keys(config.contextTemplates).find(
      key => context.toLowerCase().includes(key.toLowerCase())
    );
    if (contextKey && config.contextTemplates[contextKey]) {
      title = config.contextTemplates[contextKey].title;
    }
  }

  return (
    <Link
      href={config.href}
      className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-primary-100 hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className={`w-10 h-10 rounded-lg ${config.iconBg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
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
