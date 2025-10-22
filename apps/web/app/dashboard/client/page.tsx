import Link from 'next/link';

import { prisma } from '@mental-health/db';
import { ArrowRight, BookOpenCheck, CalendarHeart, CheckCircle2, Compass, Sparkles, TrendingUp } from 'lucide-react';

import { requireClient } from '../../../lib/auth-guards';

const formatCurrency = (value: number, currency: string) =>
  new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(value / 100);

const computeProgress = (createdAt: Date, lessons: number, index: number) => {
  const daysSince = Math.max(
    1,
    Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
  );
  const base = Math.min(95, daysSince * 12 + index * 8);
  if (!Number.isFinite(base) || base <= 0) {
    return 25;
  }
  return Math.min(lessons > 0 ? Math.round(base) : Math.round(base / 2), 95);
};

const fetchClientData = async (userId: string) => {
  const [enrollments, orders, matches, triageSession] = await Promise.all([
    prisma.enrollment.findMany({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            currency: true,
            status: true,
            lessons: {
              select: {
                id: true,
              },
            },
            therapist: {
              select: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
                city: true,
              },
            },
          },
        },
      },
    }),
    prisma.order.findMany({
      where: { buyerId: userId, type: 'COURSE' },
      orderBy: { createdAt: 'desc' },
      take: 6,
    }),
    prisma.match.findMany({
      where: { clientId: userId },
      orderBy: { score: 'desc' },
      take: 3,
      include: {
        therapist: {
          select: {
            specialties: true,
            city: true,
            priceMin: true,
            priceMax: true,
            status: true,
            user: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    }),
    prisma.triageSession.findFirst({
      where: { clientId: userId },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  return { enrollments, orders, matches, triageSession };
};

export default async function ClientDashboardPage() {
  const session = await requireClient();
  const { enrollments, orders, matches, triageSession } = await fetchClientData(session.user.id);

  const firstName =
    typeof session.user.firstName === 'string' && session.user.firstName.length > 0
      ? session.user.firstName
      : session.user.email.split('@')[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-4 w-4" aria-hidden />
          Dein FindMyTherapy-Bereich
        </div>
        <h1 className="text-3xl font-bold text-neutral-950">
          Hallo {firstName}, willkommen zurück!
        </h1>
        <p className="text-sm text-neutral-700 max-w-2xl">
          Behalte deine Programme, Termine und Empfehlungen im Blick. Wir synchronisieren Kursdaten, Ersteinschätzungen und
          persönliche Matches für Storytelling.
        </p>
      </header>

      <section aria-label="Aktive Programme" className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-950">Deine Programme</h2>
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-full px-4 py-1.5 border border-primary/30"
          >
            Weitere Programme entdecken
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {enrollments.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-divider bg-surface-1/80 p-6 text-sm text-neutral-700">
            Noch keine Programme gebucht. Starte mit der Ersteinschätzung oder buche einen Kurs aus dem Katalog.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {enrollments.map((enrollment, index) => {
              const lessonCount = enrollment.course.lessons.length;
              const progress = computeProgress(enrollment.createdAt, lessonCount, index);
              const completedLessons = Math.max(1, Math.round((progress / 100) * Math.max(lessonCount, 4)));

              const therapistName = enrollment.course.therapist?.user
                ? [enrollment.course.therapist.user.firstName, enrollment.course.therapist.user.lastName]
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
                        Aktiv
                      </span>
                      <h3 className="text-xl font-semibold text-neutral-950">
                        {enrollment.course.title}
                      </h3>
                      {therapistName && (
                        <p className="text-xs text-neutral-600">
                          Entwickelt von {therapistName}
                          {enrollment.course.therapist?.city
                            ? ` • ${enrollment.course.therapist.city}`
                            : null}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-semibold text-neutral-700">
                        <span>Fortschritt</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-neutral-200">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="mt-2 text-xs text-neutral-600">
                        {completedLessons} von {Math.max(lessonCount, completedLessons)} Lektionen bearbeitet
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-divider pt-4 text-xs text-neutral-600">
                    <span>Gestartet am {enrollment.createdAt.toLocaleDateString('de-AT')}</span>
                    <span>{formatCurrency(enrollment.course.price, enrollment.course.currency)}</span>
                    <Link
                      href={`/courses/${enrollment.course.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
                    >
                      Kursdetails öffnen
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section aria-label="Ersteinschätzung & Nächste Schritte" className="grid grid-cols-1 gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-divider bg-surface-1/90 p-6 shadow-sm shadow-primary/10">
          <h2 className="text-lg font-semibold text-neutral-950 flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" aria-hidden />
            Deine Ersteinschätzung
          </h2>

          {triageSession ? (
            <div className="mt-4 space-y-4">
              <p className="text-sm text-neutral-700">
                Zuletzt ausgefüllt am{' '}
                <strong>{triageSession.createdAt.toLocaleDateString('de-AT')}</strong>. Empfohlener Fokus:{' '}
                <strong>{triageSession.recommendedNextStep === 'THERAPIST' ? 'Pilot-Therapeut:in' : 'Programm'}</strong>.
              </p>

              <div className="rounded-2xl border border-primary/30 bg-primary/10 p-4 text-sm text-primary space-y-2 dark:border-primary/50 dark:bg-primary/20">
                <p className="font-semibold">Zusammenfassung</p>
                <ul className="space-y-2">
                  {typeof triageSession.phq9Score === 'number' && (
                    <li>PHQ-9 Score: <strong>{triageSession.phq9Score}</strong></li>
                  )}
                  {typeof triageSession.gad7Score === 'number' && (
                    <li>GAD-7 Score: <strong>{triageSession.gad7Score}</strong></li>
                  )}
                  <li>Risikoeinschätzung: <strong>{triageSession.riskLevel}</strong></li>
                </ul>
              </div>

              <Link
                href="/triage"
                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
              >
                Ersteinschätzung erneut durchlaufen
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-divider bg-white/70 p-5 text-sm text-neutral-600">
              Noch keine Ersteinschätzung hinterlegt. Starte mit ein paar Fragen und erhalte direkt Empfehlungen.
              <div className="mt-3">
                <Link
                  href="/triage"
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-primary/25 transition hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                >
                  Jetzt starten
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-divider bg-white/90 p-6 shadow-sm shadow-primary/10">
          <h2 className="text-lg font-semibold text-neutral-950 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" aria-hidden />
            Empfehlungen & Matches
          </h2>
          {matches.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-700">
              Sobald wir mehr über deine Ziele wissen, erscheinen hier passende Therapeut:innen aus dem Pilot.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
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
                    className="rounded-2xl border border-divider bg-surface-1/90 px-4 py-3 text-sm text-neutral-800"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-neutral-950">
                        {therapistName || 'Pilot-Therapeut:in'}
                      </p>
                      <span className="text-xs font-semibold text-primary">
                        Match Score {Math.round(match.score * 100)}%
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 mt-1">
                      {match.therapist?.city ?? 'Online'} •{' '}
                      {match.therapist?.specialties.slice(0, 2).join(', ')}
                    </p>
                    {typeof match.therapist?.priceMin === 'number' && typeof match.therapist?.priceMax === 'number' && (
                      <p className="text-xs text-neutral-600 mt-1">
                        {formatCurrency(match.therapist.priceMin, 'EUR')} –{' '}
                        {formatCurrency(match.therapist.priceMax, 'EUR')}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <section aria-label="Bestellungen" className="rounded-3xl border border-divider bg-white/90 p-6 shadow-sm shadow-primary/10">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-950">Deine Bestellungen</h2>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded"
          >
            Frage zum Account stellen
            <CalendarHeart className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-700">
            Noch keine Bestellungen. Sobald du ein Programm buchst, erscheinen hier Rechnungen und Status-Updates.
          </p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="py-2 pr-4">Datum</th>
                  <th className="py-2 pr-4">Produkt</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4 text-right">Betrag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="py-3 pr-4 text-neutral-700">
                      {order.createdAt.toLocaleDateString('de-AT')}
                    </td>
                    <td className="py-3 pr-4 text-default font-medium">
                      {(order.metadata as { courseTitle?: string })?.courseTitle ?? 'Programm'}
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
