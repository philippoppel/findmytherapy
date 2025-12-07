'use client';

import Link from 'next/link';
import {
  ArrowRight,
  BookOpenCheck,
  CalendarHeart,
  CheckCircle2,
  Compass,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n/useTranslation';

type Enrollment = {
  id: string;
  createdAt: Date;
  course: {
    id: string;
    title: string;
    slug: string;
    price: number;
    currency: string;
    status: string;
    lessons: { id: string }[];
    therapist: {
      user: {
        firstName: string | null;
        lastName: string | null;
      } | null;
      city: string | null;
    } | null;
  };
};

type Order = {
  id: string;
  createdAt: Date;
  status: string;
  amount: number;
  currency: string;
  metadata: unknown;
};

type Match = {
  id: string;
  score: number;
  reason: string[] | null;
  therapist: {
    specialties: string[];
    city: string | null;
    priceMin: number | null;
    priceMax: number | null;
    status: string;
    user: {
      firstName: string | null;
      lastName: string | null;
    } | null;
  } | null;
};

type TriageSession = {
  id: string;
  createdAt: Date;
  phq9Score: number | null;
  gad7Score: number | null;
  riskLevel: string;
  recommendedNextStep: string | null;
};

type ClientDashboardContentProps = {
  firstName: string;
  enrollments: Enrollment[];
  orders: Order[];
  matches: Match[];
  triageSession: TriageSession | null;
};

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value / 100);

const computeProgress = (createdAt: Date, lessons: number, index: number) => {
  const daysSince = Math.max(
    1,
    Math.floor((Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)),
  );
  const base = Math.min(95, daysSince * 12 + index * 8);
  if (!Number.isFinite(base) || base <= 0) {
    return 25;
  }
  return Math.min(lessons > 0 ? Math.round(base) : Math.round(base / 2), 95);
};

export function ClientDashboardContent({
  firstName,
  enrollments,
  orders,
  matches,
  triageSession,
}: ClientDashboardContentProps) {
  const { t } = useTranslation();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-4 w-4" aria-hidden />
          {t('clientDashboard.badge')}
        </div>
        <h1 className="text-3xl font-bold text-neutral-950">
          {t('clientDashboard.welcome', { name: firstName })}
        </h1>
        <p className="text-sm text-neutral-700 max-w-2xl">
          {t('clientDashboard.description')}
        </p>
      </header>

      <section aria-label={t('clientDashboard.yourPrograms')} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-950">{t('clientDashboard.yourPrograms')}</h2>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-4 py-1.5 border border-primary/30"
          >
            {t('clientDashboard.discoverMore')}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-divider bg-surface-1/80 p-6 text-sm text-neutral-700">
            {t('clientDashboard.noProgramsYet')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {enrollments.map((enrollment, index) => {
              const lessonCount = enrollment.course.lessons.length;
              const progress = computeProgress(enrollment.createdAt, lessonCount, index);
              const completedLessons = Math.max(
                1,
                Math.round((progress / 100) * Math.max(lessonCount, 4)),
              );

              const therapistName = enrollment.course.therapist?.user
                ? [
                    enrollment.course.therapist.user.firstName,
                    enrollment.course.therapist.user.lastName,
                  ]
                    .filter(Boolean)
                    .join(' ')
                : null;

              return (
                <article
                  key={enrollment.id}
                  className="flex h-full flex-col justify-between rounded-3xl border border-divider bg-white/90 p-6 shadow-sm shadow-primary/10"
                >
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                        <BookOpenCheck className="h-4 w-4" aria-hidden />
                        {t('clientDashboard.active')}
                      </span>
                      <h3 className="text-xl font-semibold text-neutral-950">
                        {enrollment.course.title}
                      </h3>
                      {therapistName && (
                        <p className="text-xs text-muted">
                          {t('clientDashboard.developedBy')} {therapistName}
                          {enrollment.course.therapist?.city
                            ? ` • ${enrollment.course.therapist.city}`
                            : null}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span>{t('clientDashboard.progress')}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-neutral-200">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-muted">
                        {t('clientDashboard.lessonsCompleted', {
                          completed: completedLessons,
                          total: Math.max(lessonCount, completedLessons),
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-divider pt-4 text-xs text-muted">
                    <span>{t('clientDashboard.startedOn')} {new Date(enrollment.createdAt).toLocaleDateString('de-AT')}</span>
                    <span>
                      {formatCurrency(enrollment.course.price, enrollment.course.currency)}
                    </span>
                    <Link
                      href={`/courses/${enrollment.course.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                    >
                      {t('clientDashboard.openCourseDetails')}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section
        aria-label={t('clientDashboard.yourAssessment')}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="rounded-3xl border border-divider bg-surface-1/90 p-6 shadow-sm shadow-primary/10">
          <h2 className="text-lg font-semibold text-neutral-950 flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" aria-hidden />
            {t('clientDashboard.yourAssessment')}
          </h2>

          {triageSession ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-neutral-700">
                {t('clientDashboard.lastFilledOn')}{' '}
                <strong>{new Date(triageSession.createdAt).toLocaleDateString('de-AT')}</strong>. {t('clientDashboard.recommendedFocus')}{' '}
                <strong>
                  {triageSession.recommendedNextStep === 'THERAPIST'
                    ? t('clientDashboard.focusTherapist')
                    : t('clientDashboard.focusProgram')}
                </strong>
                .
              </p>

              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary space-y-2 dark:border-primary/50 dark:bg-primary/20">
                <p className="font-semibold">{t('clientDashboard.summary')}</p>
                <ul className="space-y-2">
                  {typeof triageSession.phq9Score === 'number' && (
                    <li>
                      PHQ-9 Score: <strong>{triageSession.phq9Score}</strong>
                    </li>
                  )}
                  {typeof triageSession.gad7Score === 'number' && (
                    <li>
                      GAD-7 Score: <strong>{triageSession.gad7Score}</strong>
                    </li>
                  )}
                  <li>
                    {t('clientDashboard.riskAssessment')} <strong>{triageSession.riskLevel}</strong>
                  </li>
                </ul>
              </div>

              <Link
                href="/triage"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                {t('clientDashboard.retakeAssessment')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-divider bg-white/70 p-5 text-sm text-muted">
              {t('clientDashboard.noAssessmentYet')}
              <div className="mt-3">
                <Link
                  href="/triage"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  {t('clientDashboard.startNow')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-divider bg-white/90 p-6 shadow-sm shadow-primary/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-950 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
              {t('clientDashboard.recommendationsMatches')}
            </h2>
            <Link
              href="/match"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-4 py-1.5 border border-primary/30"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              {t('clientDashboard.newSearch')}
            </Link>
          </div>

          {matches.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-divider bg-surface-1/70 p-5 text-center">
              <div className="mx-auto max-w-md space-y-3">
                <p className="text-sm text-neutral-700">
                  {t('clientDashboard.noMatchesYet')}
                </p>
                <Link
                  href="/match"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  <Sparkles className="h-4 w-4" aria-hidden />
                  {t('clientDashboard.startMatching')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <ul className="space-y-3">
                {matches.map((match) => {
                  const therapistName = [
                    match.therapist?.user?.firstName,
                    match.therapist?.user?.lastName,
                  ]
                    .filter(Boolean)
                    .join(' ');

                  return (
                    <li
                      key={match.id}
                      className="rounded-2xl border border-divider bg-surface-1/90 px-4 py-3 text-sm text-neutral-800 hover:bg-surface-1 transition-colors"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-neutral-950">
                          {therapistName || t('clientDashboard.pilotTherapist')}
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                          {Math.round(match.score * 100)}%
                        </span>
                      </div>
                      <p className="text-xs text-muted mt-1">
                        {match.therapist?.city ?? t('clientDashboard.online')} •{' '}
                        {match.therapist?.specialties.slice(0, 2).join(', ')}
                      </p>
                      {typeof match.therapist?.priceMin === 'number' &&
                        typeof match.therapist?.priceMax === 'number' && (
                          <p className="text-xs text-muted mt-1">
                            {formatCurrency(match.therapist.priceMin, 'EUR')} –{' '}
                            {formatCurrency(match.therapist.priceMax, 'EUR')}
                          </p>
                        )}
                      {match.reason && match.reason.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-divider/50">
                          <p className="text-xs text-muted">
                            <strong className="text-neutral-700">{t('clientDashboard.whyItFits')}</strong>{' '}
                            {match.reason[0]}
                          </p>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
              <div className="mt-4 pt-4 border-t border-divider/50">
                <Link
                  href="/therapists"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                >
                  {t('clientDashboard.browseAllTherapists')}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      <section
        aria-label={t('clientDashboard.yourOrders')}
        className="rounded-3xl border border-divider bg-white/90 p-6 shadow-sm shadow-primary/10"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-950">{t('clientDashboard.yourOrders')}</h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            {t('clientDashboard.askAccountQuestion')}
            <CalendarHeart className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-700">
            {t('clientDashboard.noOrdersYet')}
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="py-2 pr-4">{t('clientDashboard.tableDate')}</th>
                  <th className="py-2 pr-4">{t('clientDashboard.tableProduct')}</th>
                  <th className="py-2 pr-4">{t('clientDashboard.tableStatus')}</th>
                  <th className="py-2 pr-4 text-right">{t('clientDashboard.tableAmount')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 pr-4 text-neutral-700">
                      {new Date(order.createdAt).toLocaleDateString('de-AT')}
                    </td>
                    <td className="py-3 pr-4 text-default font-medium">
                      {(order.metadata as { courseTitle?: string })?.courseTitle ?? t('clientDashboard.program')}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                          order.status === 'PAID'
                            ? 'bg-success-50 text-success-700'
                            : order.status === 'REQUIRES_PAYMENT'
                              ? 'bg-warning-50 text-warning-700'
                              : 'bg-neutral-100 text-neutral-700'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-default font-semibold">
                      {formatCurrency(order.amount, order.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
