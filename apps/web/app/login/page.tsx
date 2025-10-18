'use client';

import { Suspense, useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle, ArrowRight, CheckCircle2, Lock, Mail, ShieldCheck, Sparkles } from 'lucide-react';

type ErrorCode =
  | 'INVALID_CREDENTIALS'
  | 'TOTP_REQUIRED'
  | 'TOTP_INVALID'
  | 'EMAIL_TWO_FACTOR_DISABLED'
  | 'CredentialsSignin'
  | 'EMAIL_DELIVERY_FAILED'
  | 'default';

const errorMessages: Record<ErrorCode, string> = {
  INVALID_CREDENTIALS: 'E-Mail oder Passwort ist ungültig.',
  CredentialsSignin: 'Die Anmeldung ist fehlgeschlagen. Bitte überprüfe deine Daten.',
  TOTP_REQUIRED:
    'Für dieses Konto ist Zwei-Faktor-Authentifizierung notwendig. Bitte gib den aktuellen 6-stelligen Code ein.',
  TOTP_INVALID: 'Der eingegebene Sicherheitscode ist ungültig oder abgelaufen.',
  EMAIL_TWO_FACTOR_DISABLED:
    'Für dieses Konto ist die Anmeldung per Magic Link deaktiviert. Bitte melde dich mit Passwort und TOTP an.',
  EMAIL_DELIVERY_FAILED:
    'Der Login-Link konnte nicht versendet werden. Bitte versuche es erneut oder nutze die Passwort-Anmeldung.',
  default: 'Ein Fehler ist aufgetreten. Bitte versuche es später erneut.',
};

const successMessages = {
  magicLinkSent:
    'Falls ein Konto existiert, wurde ein Login-Link versendet. Bitte prüfe dein Postfach (oder den Spam-Ordner).',
};

type PrefilledAccount = {
  id: string;
  role: string;
  email: string;
  password?: string;
  totpHint?: string;
  description: string;
  focus: string;
};

const preparedAccounts: PrefilledAccount[] = [
  {
    id: 'therapist',
    role: 'Therapeut:in',
    email: 'dr.mueller@example.com',
    password: 'Therapist123!',
    totpHint: 'Bei Bedarf 000000 eingeben.',
    description: 'Zugang zum Dashboard mit Kursverwaltung, Auszahlungen und Sicherheitscenter.',
    focus: 'Ideal für die Anbieter-Perspektive.',
  },
  {
    id: 'admin',
    role: 'Admin',
    email: 'admin@mental-health-platform.com',
    password: 'Admin123!',
    totpHint: 'Aktuell optional, bei Bedarf leer lassen.',
    description: 'Admin-Konsole mit Verifizierungs-Queue, Notfallmeldungen und Systemüberblick.',
    focus: 'Zeigt Governance, Sicherheits- und Monitoring-Funktionen.',
  },
  {
    id: 'client',
    role: 'Klient:in',
    email: 'demo.client@example.com',
    password: 'Client123!',
    description: 'Ersteinschätzung, Kursübersicht und persönliche Empfehlungen.',
    focus: 'Nutze diesen Zugang für die Nutzer:innen-Perspektive.',
  },
];

const mapErrorCode = (code?: string | null): ErrorCode => {
  if (!code) {
    return 'default';
  }

  const normalised = code.replace('Error:', '').trim();

  if (normalised === 'email_twofa') {
    return 'EMAIL_TWO_FACTOR_DISABLED';
  }

  if (normalised in errorMessages) {
    return normalised as ErrorCode;
  }

  return 'default';
};

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<'password' | 'magic'>('password');
  const [credentialsEmail, setCredentialsEmail] = useState('');
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [magicEmail, setMagicEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [prefilledAccount, setPrefilledAccount] = useState<PrefilledAccount | null>(null);

  useEffect(() => {
    const errorParam = searchParams.get('error');
    const statusParam = searchParams.get('status');

    if (errorParam) {
      const code = mapErrorCode(errorParam);
      setError(errorMessages[code]);
      setSuccess(null);
    } else if (statusParam === 'registered') {
      setSuccess('Account erstellt. Melde dich jetzt mit deinem Passwort an.');
      setError(null);
    }
  }, [searchParams]);

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setPrefilledAccount(null);

    try {
      const result = await signIn('credentials', {
        email: credentialsEmail,
        password,
        totp,
        redirect: false,
      });

      if (result?.error || result === undefined) {
        const code = mapErrorCode(result?.error ?? 'CredentialsSignin');
        const extra =
          code === 'CredentialsSignin'
            ? ' Tipp: Übernimm mit einem Klick die vorbereiteten Zugangsdaten rechts und versuche es erneut.'
            : '';
        setError(`${errorMessages[code]}${extra}`);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError(errorMessages.default);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      try {
        const result = await signIn('email', {
          email: magicEmail,
          redirect: false,
        });

        if (result?.error || result === undefined) {
          const code = mapErrorCode(result?.error ?? 'default');
          setError(`${errorMessages[code]} Wir empfehlen in diesem Fall die Anmeldung per Passwort – nutze die vorbereiteten Zugänge.`);
          return;
        }

        setSuccess(successMessages.magicLinkSent);
      } catch {
        setError('Der Magic Link konnte nicht versendet werden. Bitte nutze die vorbereiteten Passwort-Zugänge.');
      }
    });
  };

  const handlePrefill = (account: PrefilledAccount) => {
    setMode('password');
    setCredentialsEmail(account.email);
    setPassword(account.password ?? '');
    setTotp('');
    setMagicEmail(account.email);
    setPrefilledAccount(account);
    setError(null);
    setSuccess(null);
  };

  const activePrefillInfo = useMemo(() => {
    if (!prefilledAccount) {
      return null;
    }

    return `Zugangsdaten für „${prefilledAccount.role}” wurden übernommen. Passe den Zwei-Faktor-Code bei Bedarf an.`;
  }, [prefilledAccount]);

  const activeError = error;
  const activeSuccess = success;

  return (
    <div className="bg-surface">
      <section className="relative overflow-hidden py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-36 right-[-6rem] h-96 w-96 rounded-full bg-blue-50/30 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[-4rem] h-80 w-80 rounded-full bg-blue-50/30 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-1 text-sm font-semibold text-primary shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden />
              Vorkonfigurierte Logins &amp; Sicherheitsfeatures
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-default md:text-5xl">Anmelden</h1>
            <p className="text-lg leading-relaxed text-muted">
              Nutze die vorbereiteten Zugangsdaten oder melde dich mit eigenen Testkonten an. Alle Logins sind für Präsentationen vorkonfiguriert.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-3xl border border-divider bg-white/90 p-8 shadow-lg shadow-primary/10 backdrop-blur">
              <div className="mb-6 flex gap-2" role="tablist" aria-label="Anmeldemethode wählen">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'password'}
                  className={`flex-1 border rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'password'
                      ? 'border-primary-800 bg-primary-800 text-white'
                      : 'border-neutral-300 text-default hover:border-primary-700'
                  }`}
                  onClick={() => {
                    setMode('password');
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Passwort &amp; TOTP
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'magic'}
                  className={`flex-1 border rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                    mode === 'magic'
                      ? 'border-primary-800 bg-primary-800 text-white'
                      : 'border-neutral-300 text-default hover:border-primary-700'
                  }`}
                  onClick={() => {
                    setMode('magic');
                    setError(null);
                    setSuccess(null);
                  }}
                >
                  Magic Link
                </button>
              </div>

              {activePrefillInfo && (
                <div
                  role="status"
                  className="mb-4 flex items-start gap-3 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary dark:border-primary/50 dark:bg-primary/20"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
                  <p>{activePrefillInfo}</p>
                </div>
              )}

              {activeError && (
                <div
                  role="alert"
                  className="mb-4 flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <p className="text-sm text-red-600">{activeError}</p>
                </div>
              )}

              {activeSuccess && (
                <div
                  role="status"
                  className="mb-4 flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 p-3"
                >
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  <p className="text-sm text-emerald-700">{activeSuccess}</p>
                </div>
              )}

              {mode === 'password' ? (
            <form onSubmit={handleCredentialsSignIn} className="space-y-4" noValidate>
              <div>
                <label htmlFor="credentials-email" className="block text-sm font-medium text-default mb-1">
                  E-Mail-Adresse
                </label>
                <div className="relative">
                  <input
                    id="credentials-email"
                    type="email"
                    value={credentialsEmail}
                    onChange={(e) => setCredentialsEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                    placeholder="therapeut@beispiel.com"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-600" />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-default mb-1">
                  Passwort
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute left-3 top-2.5 h-5 w-5 text-neutral-600" />
                </div>
              </div>

              <div>
                <label htmlFor="totp" className="block text-sm font-medium text-default mb-1">
                  Zwei-Faktor-Code
                </label>
                <input
                  id="totp"
                  type="text"
                  inputMode="numeric"
                  pattern="\d{6}"
                  value={totp}
                  onChange={(e) => setTotp(e.target.value.replace(/\s+/g, ''))}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                  placeholder="123456"
                  aria-describedby="totp-hint"
                />
                <p id="totp-hint" className="text-xs text-neutral-700 mt-1">
                  Für Admins und Therapeut:innen empfohlen. Bei Bedarf genügt „000000“ oder lasse das Feld leer.
                </p>
              </div>

              <div className="flex items-center justify-between">
                <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Passwort vergessen?
                </Link>
                <span className="text-xs text-neutral-700">Unterstützt Passwort + TOTP</span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-primary-800 text-white py-2 px-4 rounded-md hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Anmeldung läuft…' : 'Anmelden'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleMagicLink} className="space-y-4" noValidate>
              <div>
                <label htmlFor="magic-email" className="block text-sm font-medium text-default mb-1">
                  E-Mail-Adresse
                </label>
                <div className="relative">
                  <input
                    id="magic-email"
                    type="email"
                    value={magicEmail}
                    onChange={(e) => setMagicEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-800 focus:border-transparent"
                    placeholder="client@beispiel.com"
                  />
                  <Mail className="absolute left-3 top-2.5 h-5 w-5 text-neutral-600" />
                </div>
                <p className="text-xs text-neutral-700 mt-1">
                  Wir senden dir einen einmaligen Link zum Einloggen. Für Konten mit TOTP-Pflicht nicht verfügbar.
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full bg-primary-800 text-white py-2 px-4 rounded-md hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? 'Sende Login-Link…' : 'Login-Link senden'}
              </button>
            </form>
          )}

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-700">Neu hier?</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href="/signup"
                className="w-full flex justify-center py-2 px-4 border-2 border-primary-900 text-primary rounded-md hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary-800 focus:ring-offset-2 transition-colors"
              >
                Kostenloses Konto erstellen
              </Link>
            </div>
          </div>
            </div>

            <aside className="rounded-3xl border border-divider bg-surface-1/90 p-6 shadow-md shadow-primary/10 backdrop-blur">
              <header className="space-y-2">
                <h2 className="text-2xl font-semibold text-default">Schnelle Zugänge</h2>
                <p className="text-sm leading-relaxed text-muted">
                  Übernimm vorbereitete Zugangsdaten mit einem Klick. Das Formular links wird automatisch ausgefüllt und ist
                  sofort einsatzbereit.
                </p>
              </header>

              <ul className="mt-6 space-y-4">
                {preparedAccounts.map((account) => (
                  <li
                    key={account.id}
                    className="rounded-2xl border border-divider bg-white/75 p-5 shadow-sm shadow-primary/5 transition hover:-translate-y-0.5 hover:shadow-primary/10"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">{account.role}</p>
                        <p className="text-base font-medium text-default">{account.description}</p>
                        <p className="text-xs text-muted">{account.focus}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handlePrefill(account)}
                        className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
                      >
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                        Daten übernehmen
                      </button>
                    </div>

                    <dl className="mt-4 grid grid-cols-1 gap-2 text-xs text-muted">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-default">E-Mail:</span>
                        <span className="break-all">{account.email}</span>
                      </div>
                      {account.password && (
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-default">Passwort:</span>
                          <span>{account.password}</span>
                        </div>
                      )}
                      {account.totpHint && (
                        <div className="flex items-start gap-2">
                          <span className="font-semibold text-default">TOTP:</span>
                          <span className="text-xs leading-normal">{account.totpHint}</span>
                        </div>
                      )}
                    </dl>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Laden...</div>}>
      <LoginContent />
    </Suspense>
  );
}
