'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle, Circle, X, Rocket, ExternalLink } from 'lucide-react';

interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  completed: boolean;
  link?: string;
}

const WIDGET_DISMISSED_KEY = 'getting-started-widget-dismissed';

export function GettingStartedWidget({
  profileComplete,
  micrositePublished,
  hasLeads,
}: {
  profileComplete: boolean;
  micrositePublished: boolean;
  hasLeads: boolean;
}) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(WIDGET_DISMISSED_KEY);
    setIsDismissed(dismissed === 'true');
  }, []);

  const checklist: ChecklistItem[] = [
    {
      id: 'profile',
      label: 'Profil vervollständigen',
      description: 'Mindestens 3 Spezialisierungen, Headline und Erfahrung hinzufügen',
      completed: profileComplete,
      link: '/dashboard/profile',
    },
    {
      id: 'microsite',
      label: 'Microsite veröffentlichen',
      description: 'Ihre persönliche Website online stellen',
      completed: micrositePublished,
      link: '/dashboard/therapist/microsite',
    },
    {
      id: 'leads',
      label: 'Erste Kontaktanfrage erhalten',
      description: 'Teilen Sie Ihre Microsite-URL, um Anfragen zu empfangen',
      completed: hasLeads,
      link: '/dashboard/therapist/leads',
    },
  ];

  const completedCount = checklist.filter((item) => item.completed).length;
  const totalCount = checklist.length;
  const progress = Math.round((completedCount / totalCount) * 100);
  const isComplete = completedCount === totalCount;

  const handleDismiss = () => {
    localStorage.setItem(WIDGET_DISMISSED_KEY, 'true');
    setIsDismissed(true);
  };

  // Don't show if dismissed or everything is completed
  if (isDismissed || isComplete) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200 rounded-2xl p-6 shadow-lg relative">
      <button
        onClick={handleDismiss}
        className="absolute top-4 right-4 p-1 rounded-full hover:bg-primary-100 transition text-primary-700"
        aria-label="Widget ausblenden"
      >
        <X className="h-4 w-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-primary-1000 rounded-xl shadow-lg shadow-primary-500/30">
          <Rocket className="h-6 w-6 text-white" />
        </div>

        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Starten Sie durch!</h3>
          <p className="text-gray-600 mb-4">
            Vervollständigen Sie Ihre Einrichtung, um das volle Potenzial Ihrer Microsite
            auszuschöpfen.
          </p>

          {/* Progress Bar */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">
                Fortschritt: {completedCount} von {totalCount}
              </span>
              <span className="text-sm font-bold text-primary-600">{progress}%</span>
            </div>
            <div className="h-3 bg-white rounded-full overflow-hidden border border-primary-200">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-primary-1000 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            {checklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition ${
                  item.completed ? 'bg-white/50' : 'bg-white hover:shadow-md'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-primary-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div
                    className={`font-medium ${item.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
                  >
                    {item.label}
                  </div>
                  <div className="text-sm text-gray-600 mt-0.5">{item.description}</div>
                </div>

                {!item.completed && item.link && (
                  <Link
                    href={item.link}
                    className="flex-shrink-0 px-3 py-1.5 text-sm font-medium text-primary-700 hover:text-primary-800 hover:bg-primary-100 rounded-md transition flex items-center gap-1"
                  >
                    Los
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
