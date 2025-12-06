'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

import { Button, Input } from '@mental-health/ui';
import { track } from '@/lib/analytics';
import { useTranslation } from '@/lib/i18n';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  marketingOptIn: boolean;
  acceptTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  marketingOptIn: true,
  acceptTerms: false,
};

export function ClientRegistrationForm() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string>('');

  const passwordHints = useMemo(
    () => [
      { rule: t('auth.minChars'), ok: form.password.length >= 8 },
      { rule: t('auth.minUppercase'), ok: /[A-Z]/.test(form.password) },
      { rule: t('auth.minLowercase'), ok: /[a-z]/.test(form.password) },
      { rule: t('auth.minNumber'), ok: /\d/.test(form.password) },
    ],
    [form.password, t],
  );

  const handleChange = (field: keyof FormState) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = t('auth.requiredField');
    }
    if (!form.lastName.trim()) {
      nextErrors.lastName = t('auth.requiredField');
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = t('auth.validEmail');
    }
    if (!form.password.trim()) {
      nextErrors.password = t('auth.enterPassword');
    } else {
      if (form.password.length < 8) {
        nextErrors.password = t('auth.minChars');
      } else if (!/[A-Z]/.test(form.password)) {
        nextErrors.password = t('auth.minUppercase');
      } else if (!/[a-z]/.test(form.password)) {
        nextErrors.password = t('auth.minLowercase');
      } else if (!/\d/.test(form.password)) {
        nextErrors.password = t('auth.minNumber');
      }
    }
    if (!form.confirmPassword.trim()) {
      nextErrors.confirmPassword = t('auth.confirmPasswordRequired');
    } else if (form.password !== form.confirmPassword) {
      nextErrors.confirmPassword = t('auth.passwordsMismatch');
    }
    if (!form.acceptTerms) {
      nextErrors.acceptTerms = t('auth.acceptTermsRequired');
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setMessage('');

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/clients/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          acceptTerms: form.acceptTerms,
          marketingOptIn: form.marketingOptIn,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (Array.isArray(data?.errors)) {
          const apiErrors: FormErrors = {};

          for (const error of data.errors) {
            const field = Array.isArray(error?.path) ? error.path[0] : undefined;
            if (typeof field === 'string' && field in initialState) {
              apiErrors[field as keyof FormState] =
                typeof error.message === 'string' ? error.message : undefined;
            }
          }

          setErrors((prev) => ({ ...prev, ...apiErrors }));
        }

        throw new Error(data.message || t('auth.errorOccurred'));
      }

      track('client_registration_submitted', {
        marketingOptIn: form.marketingOptIn,
      });

      setStatus('success');
      setMessage(t('auth.accountCreatedSigningIn'));

      const signInResult = await signIn('credentials', {
        redirect: false,
        email: form.email.trim(),
        password: form.password,
      });

      if (signInResult?.error) {
        setMessage(t('auth.accountCreatedPleaseLogin'));
        router.push('/login?status=registered');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      console.error('Error registering client:', error);
      setStatus('error');
      setMessage(error instanceof Error ? error.message : t('auth.errorOccurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          {t('auth.createAccountTitle')}
        </h2>
        <p className="mt-2 text-sm text-neutral-800">{t('auth.createAccountDesc')}</p>
      </header>

      {status === 'success' && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
          <div>
            <p className="font-semibold">{t('auth.registrationSuccess')}</p>
            <p>{message}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
          <div>
            <p className="font-semibold">{t('auth.registrationError')}</p>
            <p>{message || t('auth.tryAgainLater')}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="firstName">
            <span className="font-medium text-default">{t('auth.firstName')}</span>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={handleChange('firstName')}
              placeholder="Alex"
              hasError={Boolean(errors.firstName)}
              required
              autoComplete="given-name"
            />
            {errors.firstName && <span className="text-xs text-red-600">{errors.firstName}</span>}
          </label>
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="lastName">
            <span className="font-medium text-default">{t('auth.lastName')}</span>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={handleChange('lastName')}
              placeholder="Muster"
              hasError={Boolean(errors.lastName)}
              required
              autoComplete="family-name"
            />
            {errors.lastName && <span className="text-xs text-red-600">{errors.lastName}</span>}
          </label>
        </div>

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="email">
          <span className="font-medium text-default">{t('auth.emailAddress')}</span>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="kunde@findmytherapy.net"
            hasError={Boolean(errors.email)}
            required
            autoComplete="email"
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
        </label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1 text-sm text-neutral-700">
            <label htmlFor="password" className="font-medium text-default">
              {t('auth.password')}
            </label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={handleChange('password')}
              placeholder={t('auth.minChars')}
              hasError={Boolean(errors.password)}
              required
              autoComplete="new-password"
            />
            {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
          </div>
          <div className="space-y-1 text-sm text-neutral-700">
            <label htmlFor="confirmPassword" className="font-medium text-default">
              {t('auth.confirmPassword')}
            </label>
            <Input
              id="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange('confirmPassword')}
              placeholder={t('auth.repeatPassword')}
              hasError={Boolean(errors.confirmPassword)}
              required
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <span className="text-xs text-red-600">{errors.confirmPassword}</span>
            )}
          </div>
        </div>

        <ul className="space-y-1 rounded-xl border border-divider bg-surface-1/90 p-4 text-xs text-muted">
          {passwordHints.map((hint) => (
            <li key={hint.rule} className="flex items-center gap-2">
              <span
                aria-hidden
                className={`h-2 w-2 rounded-full ${hint.ok ? 'bg-emerald-500' : 'bg-neutral-300'}`}
              />
              {hint.rule}
            </li>
          ))}
        </ul>

        <label className="flex items-start gap-3 rounded-2xl border border-divider bg-surface-1/90 p-4 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={form.marketingOptIn}
            onChange={handleChange('marketingOptIn')}
            className="mt-1 h-4 w-4 rounded border border-divider"
          />
          <span>{t('auth.marketingOptInLabel')}</span>
        </label>

        <label className="flex items-start gap-3 rounded-2xl border border-divider bg-surface-1/90 p-4 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={form.acceptTerms}
            onChange={handleChange('acceptTerms')}
            className="mt-1 h-4 w-4 rounded border border-divider"
            required
          />
          <span>
            {t('auth.agreeToTerms')}{' '}
            <Link className="text-primary underline" href="/terms">
              {t('auth.termsOfService')}
            </Link>{' '}
            {t('auth.and')}{' '}
            <Link className="text-primary underline" href="/privacy">
              {t('auth.privacyPolicyLink')}
            </Link>{' '}
            {t('auth.agreeTermsSuffix')}
            {errors.acceptTerms && (
              <span className="mt-1 block text-xs text-red-600">{errors.acceptTerms}</span>
            )}
          </span>
        </label>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              {t('auth.registering')}
            </span>
          ) : (
            t('auth.createAccountTitle')
          )}
        </Button>

        <p className="text-center text-xs text-neutral-700">
          {t('auth.alreadyHaveAccount')}{' '}
          <Link href="/login" className="text-primary underline">
            {t('auth.signInHere')}
          </Link>
        </p>
      </form>
    </div>
  );
}
