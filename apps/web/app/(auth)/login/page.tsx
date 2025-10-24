'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: 'Ungültige E-Mail oder Passwort',
  TOTP_REQUIRED: '2FA-Code erforderlich',
  TOTP_INVALID: 'Ungültiger 2FA-Code',
  INTERNAL_ERROR: 'Ein interner Fehler ist aufgetreten',
};

export default function LoginPage() {
  const router = useRouter();
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
      await new Promise(resolve => setTimeout(resolve, 100));
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError('Ein unerwarteter Fehler ist aufgetreten');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
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
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isLoading ? 'Lädt...' : 'Anmelden'}
          </button>

          <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded">
            <strong>Test-Zugangsdaten:</strong>
            <br />
            dr.mueller@example.com / Therapist123!
          </div>
        </form>
      </div>
    </div>
  );
}
