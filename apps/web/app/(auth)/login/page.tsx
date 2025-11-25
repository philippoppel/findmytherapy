'use client';

import { useState } from 'react';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Ungültige E-Mail oder Passwort',
  TOTP_REQUIRED: '2FA-Code erforderlich',
  TOTP_INVALID: 'Ungültiger 2FA-Code',
  INTERNAL_ERROR: 'Ein interner Fehler ist aufgetreten',
};

export default function LoginPage() {
  const [email, setEmail] = useState('dr.mueller@example.com');
  const [password, setPassword] = useState('Therapist123!');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth-custom/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password,
          totp: '',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = ERROR_MESSAGES[data.error] || data.error || 'Login fehlgeschlagen';
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Success! Wait a moment for cookie to be set, then redirect
      await new Promise((resolve) => setTimeout(resolve, 100));
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-primary-950 via-neutral-900 to-primary-950 flex items-center justify-center py-12 px-4">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-primary-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-primary-1000/25 blur-3xl" />
      </div>

      <div className="relative max-w-md w-full">
        <div className="mb-6 flex justify-end">
          <a href="/" className="text-sm font-medium text-white/70 transition hover:text-white">
            Zur Startseite
          </a>
        </div>

        <div className="space-y-8 p-8 bg-white/10 rounded-3xl border border-white/10 shadow-2xl backdrop-blur">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white/80 mb-4">
              Therapeuten-Login
            </div>
            <h2 className="text-3xl font-bold text-white">Anmelden</h2>
            <p className="mt-2 text-sm text-white/70">
              Melde dich mit deinem Therapeuten-Account an
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                autoComplete="email"
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:opacity-50 transition"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 border border-white/20 rounded-xl bg-white/5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent disabled:opacity-50 transition"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-400/20 border border-red-400/30 rounded-xl text-red-200 text-sm backdrop-blur">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-700 text-white py-3 px-4 rounded-xl hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-lg"
            >
              {isLoading ? 'Lädt...' : 'Anmelden'}
            </button>

            <div className="text-sm text-white/60 p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur">
              <strong className="text-white/80">Test-Zugangsdaten:</strong>
              <br />
              <span className="text-white/70">dr.mueller@example.com / Therapist123!</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
