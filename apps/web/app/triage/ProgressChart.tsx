'use client';

import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

type TriageDataPoint = {
  date: string;
  phq9Score: number;
  gad7Score: number;
};

type ProgressChartProps = {
  data: TriageDataPoint[];
  className?: string;
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-AT', { day: '2-digit', month: 'short' });
}

function calculateTrend(
  data: TriageDataPoint[],
  metric: 'phq9' | 'gad7',
): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';

  const latest = data[data.length - 1];
  const previous = data[data.length - 2];
  const latestScore = metric === 'phq9' ? latest.phq9Score : latest.gad7Score;
  const previousScore = metric === 'phq9' ? previous.phq9Score : previous.gad7Score;

  const diff = latestScore - previousScore;

  if (diff > 2) return 'up';
  if (diff < -2) return 'down';
  return 'stable';
}

export function ProgressChart({ data, className = '' }: ProgressChartProps) {
  const { t } = useTranslation();

  if (data.length === 0) {
    return (
      <div className={`rounded-2xl border border-divider bg-surface-1/90 p-6 ${className}`}>
        <p className="text-center text-sm text-muted">
          {t('progressChart.noData')}
        </p>
      </div>
    );
  }

  const phq9Trend = calculateTrend(data, 'phq9');
  const gad7Trend = calculateTrend(data, 'gad7');

  const maxPHQ9 = Math.max(...data.map((d) => d.phq9Score), 27);
  const maxGAD7 = Math.max(...data.map((d) => d.gad7Score), 21);

  return (
    <div className={`rounded-2xl border border-divider bg-white p-6 ${className}`} aria-label={t('progressChart.ariaLabel')}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-default">{t('progressChart.title')}</h3>
        <p className="text-sm text-muted" aria-live="polite">{data.length} {t('progressChart.measurements')}</p>
      </div>

      {/* PHQ-9 Chart */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-default">{t('progressChart.phq9Label')}</span>
            {phq9Trend === 'down' && (
              <TrendingDown className="h-4 w-4 text-emerald-600" aria-label={t('progressChart.improving')} />
            )}
            {phq9Trend === 'up' && (
              <TrendingUp className="h-4 w-4 text-red-600" aria-label={t('progressChart.worsening')} />
            )}
            {phq9Trend === 'stable' && <Minus className="h-4 w-4 text-muted" aria-label={t('progressChart.stable')} />}
          </div>
          <span className="text-sm text-muted">{t('progressChart.current')}: {data[data.length - 1]?.phq9Score}/27</span>
        </div>
        <div className="relative h-24 w-full">
          {/* Background grid */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-px w-full bg-divider opacity-30" />
            ))}
          </div>
          {/* Data points and lines */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {/* Area fill */}
            <defs>
              <linearGradient id="phq9Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(59, 130, 246)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={`M ${data.map((d, i) => `${(i / (data.length - 1 || 1)) * 100}%,${100 - (d.phq9Score / maxPHQ9) * 100}%`).join(' L ')} L 100%,100% L 0%,100% Z`}
              fill="url(#phq9Gradient)"
            />
            {/* Line */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1 || 1)) * 100}%,${100 - (d.phq9Score / maxPHQ9) * 100}%`,
                )
                .join(' ')}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {/* Points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={`${(i / (data.length - 1 || 1)) * 100}%`}
                cy={`${100 - (d.phq9Score / maxPHQ9) * 100}%`}
                r="4"
                fill="rgb(59, 130, 246)"
                stroke="white"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          {data.slice(-5).map((d, i) => (
            <span key={i}>{formatDate(d.date)}</span>
          ))}
        </div>
      </div>

      {/* GAD-7 Chart */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-default">{t('progressChart.gad7Label')}</span>
            {gad7Trend === 'down' && (
              <TrendingDown className="h-4 w-4 text-emerald-600" aria-label={t('progressChart.improving')} />
            )}
            {gad7Trend === 'up' && (
              <TrendingUp className="h-4 w-4 text-red-600" aria-label={t('progressChart.worsening')} />
            )}
            {gad7Trend === 'stable' && <Minus className="h-4 w-4 text-muted" aria-label={t('progressChart.stable')} />}
          </div>
          <span className="text-sm text-muted">{t('progressChart.current')}: {data[data.length - 1]?.gad7Score}/21</span>
        </div>
        <div className="relative h-24 w-full">
          {/* Background grid */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="h-px w-full bg-divider opacity-30" />
            ))}
          </div>
          {/* Data points and lines */}
          <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            {/* Area fill */}
            <defs>
              <linearGradient id="gad7Gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="rgb(168, 85, 247)" stopOpacity="0.3" />
                <stop offset="100%" stopColor="rgb(168, 85, 247)" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            <path
              d={`M ${data.map((d, i) => `${(i / (data.length - 1 || 1)) * 100}%,${100 - (d.gad7Score / maxGAD7) * 100}%`).join(' L ')} L 100%,100% L 0%,100% Z`}
              fill="url(#gad7Gradient)"
            />
            {/* Line */}
            <polyline
              points={data
                .map(
                  (d, i) =>
                    `${(i / (data.length - 1 || 1)) * 100}%,${100 - (d.gad7Score / maxGAD7) * 100}%`,
                )
                .join(' ')}
              fill="none"
              stroke="rgb(168, 85, 247)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            {/* Points */}
            {data.map((d, i) => (
              <circle
                key={i}
                cx={`${(i / (data.length - 1 || 1)) * 100}%`}
                cy={`${100 - (d.gad7Score / maxGAD7) * 100}%`}
                r="4"
                fill="rgb(168, 85, 247)"
                stroke="white"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
        <div className="mt-2 flex justify-between text-xs text-muted">
          {data.slice(-5).map((d, i) => (
            <span key={i}>{formatDate(d.date)}</span>
          ))}
        </div>
      </div>

      {/* Trend summary */}
      <div className="mt-4 rounded-lg bg-surface-1 p-3 text-sm" role="status" aria-live="polite">
        <p className="font-semibold text-default">{t('progressChart.summary')}</p>
        <p className="mt-1 text-muted">
          {phq9Trend === 'down' &&
            gad7Trend === 'down' &&
            t('progressChart.bothImproving')}
          {phq9Trend === 'up' &&
            gad7Trend === 'up' &&
            t('progressChart.bothWorsening')}
          {phq9Trend === 'stable' && gad7Trend === 'stable' && t('progressChart.bothStable')}
          {((phq9Trend === 'down' && gad7Trend !== 'down') ||
            (phq9Trend !== 'down' && gad7Trend === 'down')) &&
            t('progressChart.mixedProgress')}
        </p>
      </div>
    </div>
  );
}
