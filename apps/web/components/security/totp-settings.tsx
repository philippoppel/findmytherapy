'use client';

import { useState, useTransition } from 'react';
import { Copy, QrCode, Shield, ShieldOff } from 'lucide-react';
import { Button } from '@mental-health/ui';
import { disableTotp, enableTotp, startTotpSetup } from '../../app/dashboard/security/actions';

type Props = {
  email: string;
  totpEnabled: boolean;
};

export function SecuritySettings({ email, totpEnabled }: Props) {
  const [isPending, startTransition] = useTransition();
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [otpauthUrl, setOtpauthUrl] = useState<string | null>(null);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStartSetup = () =>
    startTransition(async () => {
      try {
        const result = await startTotpSetup();
        setSetupSecret(result.secret);
        setOtpauthUrl(result.otpauthUrl);
        setToken('');
        setMessage(null);
      } catch (error) {
        console.error(error);
        setMessage({
          type: 'error',
          text: 'TOTP-Einrichtung konnte nicht gestartet werden.',
        });
      }
    });

  const handleEnable = (event: React.FormEvent) => {
    event.preventDefault();

    if (!setupSecret) {
      setMessage({
        type: 'error',
        text: 'Bitte generiere zuerst einen Setup-Code.',
      });
      return;
    }

    startTransition(async () => {
      const result = await enableTotp(setupSecret, token);

      if (!result.ok) {
        setMessage({
          type: 'error',
          text:
            result.error === 'invalid'
              ? 'Der eingegebene Code ist ungültig oder abgelaufen.'
              : 'Die Aktivierung ist fehlgeschlagen.',
        });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Zwei-Faktor-Authentifizierung wurde aktiviert.',
      });
      setSetupSecret(null);
      setOtpauthUrl(null);
      setToken('');
    });
  };

  const handleDisable = () =>
    startTransition(async () => {
      const result = await disableTotp();

      if (!result.ok) {
        setMessage({
          type: 'error',
          text: 'Die Deaktivierung ist fehlgeschlagen. Bitte versuche es erneut.',
        });
        return;
      }

      setMessage({
        type: 'success',
        text: 'Zwei-Faktor-Authentifizierung wurde deaktiviert.',
      });
      setSetupSecret(null);
      setOtpauthUrl(null);
      setToken('');
    });

  const copySecret = async () => {
    if (!setupSecret) {
      return;
    }

    try {
      await navigator.clipboard.writeText(setupSecret);
      setMessage({ type: 'success', text: 'Setup-Code wurde in die Zwischenablage kopiert.' });
    } catch {
      setMessage({ type: 'error', text: 'Setup-Code konnte nicht kopiert werden.' });
    }
  };

  return (
    <section
      className="bg-white rounded-lg shadow p-6 space-y-6"
      aria-label="Zwei-Faktor-Authentifizierung"
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide">
          <Shield className="h-4 w-4" />
          Sicherheit
        </div>
        <h2 className="text-xl font-semibold text-gray-900">
          Zwei-Faktor-Authentifizierung (TOTP)
        </h2>
        <p className="text-sm text-gray-600">
          Schütze dein Konto mit einem zeitbasierten Einmalpasswort. Verwende z.&nbsp;B. Microsoft
          Authenticator, 1Password oder Google Authenticator.
        </p>
        <p className="text-xs text-gray-500">Aktuelles Konto: {email}</p>
      </header>

      {message && (
        <div
          role="status"
          className={`rounded-md border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-red-200 bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="flex flex-col gap-3 rounded-lg border border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">Aktueller Status</p>
          <p className="text-sm text-gray-600">
            {totpEnabled ? 'Aktiviert' : 'Nicht aktiviert'} – empfohlen für alle Therapeut:innen
            &amp; Admins
          </p>
        </div>
        {totpEnabled ? (
          <Button
            variant="danger"
            size="sm"
            onClick={handleDisable}
            disabled={isPending}
            className="self-start sm:self-auto"
          >
            <ShieldOff className="h-4 w-4 mr-2" />
            Deaktivieren
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={handleStartSetup}
            disabled={isPending}
            className="self-start sm:self-auto"
          >
            <Shield className="h-4 w-4 mr-2" />
            Setup starten
          </Button>
        )}
      </div>

      {setupSecret && otpauthUrl && (
        <form onSubmit={handleEnable} className="space-y-4" noValidate>
          <div className="rounded-lg border border-dashed border-gray-300 p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">Setup-Code</h3>
            <p className="text-sm text-gray-600">
              Scanne den Code mit deiner Authenticator-App oder gib den geheimen Schlüssel manuell
              ein.
            </p>
            <code className="block rounded-md bg-gray-900 text-white text-sm tracking-widest px-4 py-3">
              {setupSecret}
            </code>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={copySecret}>
                <Copy className="h-4 w-4 mr-2" />
                Code kopieren
              </Button>
              <a
                href={otpauthUrl}
                className="inline-flex items-center rounded-md border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <QrCode className="h-4 w-4 mr-2" />
                In Authenticator öffnen
              </a>
            </div>
          </div>

          <div>
            <label htmlFor="totpToken" className="block text-sm font-medium text-gray-700 mb-1">
              Bestätigungs-Code
            </label>
            <input
              id="totpToken"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              value={token}
              onChange={(event) => setToken(event.target.value.replace(/\s+/g, ''))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="123456"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Gib den aktuellen 6-stelligen Code aus deiner Authenticator-App ein.
            </p>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending}>
              Aktivieren
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}
