'use client';

import { Clock, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

type AvailabilityStatus = 'AVAILABLE' | 'LIMITED' | 'WAITLIST' | 'UNAVAILABLE';

interface AvailabilityBadgeProps {
  status?: AvailabilityStatus | null;
  estimatedWaitWeeks?: number | null;
  acceptingClients?: boolean;
  variant?: 'compact' | 'default' | 'detailed';
  className?: string;
}

export function AvailabilityBadge({
  status,
  estimatedWaitWeeks,
  acceptingClients,
  variant = 'default',
  className = '',
}: AvailabilityBadgeProps) {
  const { t } = useTranslation();

  // Fallback: wenn kein Status, aber acceptingClients gesetzt ist
  if (!status && acceptingClients !== undefined) {
    status = acceptingClients ? 'AVAILABLE' : 'WAITLIST';
  }

  // Kein Status verfügbar
  if (!status) {
    return null;
  }

  const config = getStatusConfig(status, estimatedWaitWeeks, t);

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1.5 ${className}`}>
        <div className={`h-2.5 w-2.5 rounded-full ${config.dotColor} shadow-sm`} />
        {variant !== 'compact' && (
          <span className="text-xs font-medium text-gray-700">{config.label}</span>
        )}
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ${config.bgColor} ${config.textColor} shadow-sm ${className}`}
      >
        <config.icon className="h-4 w-4" />
        <div className="flex flex-col">
          <span className="text-xs font-semibold">{config.label}</span>
          {config.sublabel && <span className="text-[10px] opacity-80">{config.sublabel}</span>}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 ${config.bgColor} ${config.textColor} shadow-sm ${className}`}
    >
      <config.icon className="h-3.5 w-3.5" />
      <span className="text-xs font-semibold">{config.label}</span>
    </div>
  );
}

function getStatusConfig(
  status: AvailabilityStatus,
  estimatedWaitWeeks: number | null | undefined,
  t: (key: string, params?: Record<string, string | number>) => string
) {
  switch (status) {
    case 'AVAILABLE':
      return {
        label: t('availabilityBadge.available'),
        sublabel: t('availabilityBadge.availableDesc'),
        icon: CheckCircle,
        bgColor: 'bg-green-100',
        textColor: 'text-green-800',
        dotColor: 'bg-green-500',
      };

    case 'LIMITED': {
      const waitText = estimatedWaitWeeks
        ? t('availabilityBadge.waitlistWeeks', { weeks: estimatedWaitWeeks })
        : t('availabilityBadge.limitedDesc');
      return {
        label: t('availabilityBadge.limited'),
        sublabel: waitText,
        icon: Clock,
        bgColor: 'bg-amber-100',
        textColor: 'text-amber-800',
        dotColor: 'bg-amber-500',
      };
    }

    case 'WAITLIST': {
      const waitlistText =
        estimatedWaitWeeks && estimatedWaitWeeks > 0
          ? t('availabilityBadge.waitlistDesc', { weeks: estimatedWaitWeeks })
          : t('availabilityBadge.waitlist');
      return {
        label: t('availabilityBadge.waitlist'),
        sublabel: waitlistText,
        icon: AlertCircle,
        bgColor: 'bg-orange-100',
        textColor: 'text-orange-800',
        dotColor: 'bg-orange-500',
      };
    }

    case 'UNAVAILABLE':
      return {
        label: t('availabilityBadge.unavailable'),
        sublabel: t('availabilityBadge.unavailableDesc'),
        icon: XCircle,
        bgColor: 'bg-red-100',
        textColor: 'text-red-800',
        dotColor: 'bg-red-500',
      };
  }
}
