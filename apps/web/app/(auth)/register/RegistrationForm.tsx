'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { Button, Input, Textarea } from '@mental-health/ui';
import { track } from '../../../lib/analytics';

type AccessRole = 'THERAPIST' | 'ORGANISATION' | 'PRIVATE';
type TherapistFormat = 'ONLINE' | 'PRAESENZ' | 'HYBRID';

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: AccessRole;
  company: string;
  city: string;
  specialties: string[];
  modalities: TherapistFormat[];
  notes: string;
  availabilityNote: string;
  pricingNote: string;
  acceptTerms: boolean;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialState: FormState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'THERAPIST',
  company: '',
  city: '',
  specialties: [],
  modalities: [],
  notes: '',
  availabilityNote: '',
  pricingNote: '',
  acceptTerms: false,
};

const roleLabels: Record<AccessRole, string> = {
  THERAPIST: 'Therapeut:in / Praxis',
  ORGANISATION: 'Unternehmen / HR / BGM',
  PRIVATE: 'Privatperson / Angehörige:r',
};

const specialtyOptions = [
  'Depression & Burnout',
  'Angst & Panik',
  'Trauma & Krisen',
  'ADHS & Neurodiversität',
  'Familie & Beziehungen',
  'Corporate Mental Health',
] as const;

const formatOptions: Array<{ id: TherapistFormat; label: string }> = [
  { id: 'ONLINE', label: 'Online' },
  { id: 'PRAESENZ', label: 'Vor Ort' },
  { id: 'HYBRID', label: 'Hybrid' },
];

export function RegistrationForm() {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<FormErrors>({});
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [submittedRole, setSubmittedRole] = useState<AccessRole | null>(null);

  const accessSummary = useMemo(() => {
    if (form.role === 'THERAPIST') {
      return 'Nach der Registrierung prüfen wir dein Profil und schalten dir das Pilot-Dashboard frei. Du erhältst alle Infos zum Listing und zur Onboarding-Storyline.';
    }

    if (form.role === 'ORGANISATION') {
      return 'Du erhältst einen Überblick über Team-Zugänge, Reporting und Employer Branding. Wir stimmen Termin und Storyline mit dir ab.';
    }

    return 'Wir zeigen dir die Ersteinschätzung inklusive Empfehlungen, Kursübersicht und Follow-up mit dem Care-Team.';
  }, [form.role]);

  const successCopy = useMemo(() => {
    if (submittedRole === 'THERAPIST') {
      return {
        title: 'Danke für deine Registrierung!',
        body: 'Wir haben dein Konto angelegt und prüfen dein Profil. Du erhältst werktags innerhalb von 24 Stunden Zugang zum Pilot-Dashboard und weitere Hinweise zur Verifizierung.',
      };
    }

    return {
      title: 'Vielen Dank! Deine Anfrage ist bei uns angekommen.',
      body: 'Wir melden uns werktags innerhalb von 24 Stunden mit dem passenden Ablauf. Schau gerne gleich in dein Postfach.',
    };
  }, [submittedRole]);

  const handleChange =
    (field: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const value =
        event.target.type === 'checkbox'
          ? (event.target as HTMLInputElement).checked
          : event.target.value;
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  const toggleSpecialty = (value: string) => {
    setForm((prev) => {
      const nextValues = prev.specialties.includes(value)
        ? prev.specialties.filter((item) => item !== value)
        : [...prev.specialties, value];

      return {
        ...prev,
        specialties: nextValues,
      };
    });
    setErrors((prev) => ({ ...prev, specialties: undefined }));
  };

  const toggleFormat = (value: TherapistFormat) => {
    setForm((prev) => {
      const nextValues = prev.modalities.includes(value)
        ? prev.modalities.filter((item) => item !== value)
        : [...prev.modalities, value];

      return {
        ...prev,
        modalities: nextValues,
      };
    });
    setErrors((prev) => ({ ...prev, modalities: undefined }));
  };

  const validate = () => {
    const nextErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = 'Pflichtfeld';
    }
    if (!form.lastName.trim()) {
      nextErrors.lastName = 'Pflichtfeld';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      nextErrors.email = 'Bitte eine gültige E-Mail-Adresse angeben';
    }
    if (!['THERAPIST', 'ORGANISATION', 'PRIVATE'].includes(form.role)) {
      nextErrors.role = 'Bitte Rolle auswählen';
    }
    if (form.role === 'ORGANISATION' && !form.company.trim()) {
      nextErrors.company = 'Bitte Unternehmensname ergänzen';
    }

    if (form.role === 'THERAPIST') {
      if (!form.password.trim()) {
        nextErrors.password = 'Bitte Passwort vergeben';
      } else if (form.password.length < 8) {
        nextErrors.password = 'Mindestens 8 Zeichen';
      }
      if (!form.confirmPassword.trim()) {
        nextErrors.confirmPassword = 'Bitte bestätigen';
      } else if (form.password !== form.confirmPassword) {
        nextErrors.confirmPassword = 'Passwörter stimmen nicht überein';
      }
      if (!form.city.trim()) {
        nextErrors.city = 'Bitte Stadt angeben';
      }
      if (form.specialties.length === 0) {
        nextErrors.specialties = 'Mindestens einen Schwerpunkt auswählen';
      }
      if (form.modalities.length === 0) {
        nextErrors.modalities = 'Mindestens ein Format auswählen';
      }
      if (!form.acceptTerms) {
        nextErrors.acceptTerms = 'Bitte stimme den Bedingungen zu';
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('idle');
    setErrorMessage('');

    const validation = validate();
    if (Object.keys(validation).length > 0) {
      setErrors(validation);
      return;
    }

    setIsSubmitting(true);
    const currentRole = form.role;

    const payload =
      currentRole === 'THERAPIST'
        ? {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            password: form.password,
            confirmPassword: form.confirmPassword,
            city: form.city.trim(),
            specialties: form.specialties,
            modalities: form.modalities,
            acceptTerms: form.acceptTerms,
            notes: form.notes.trim() || undefined,
            availabilityNote: form.availabilityNote.trim() || undefined,
            pricingNote: form.pricingNote.trim() || undefined,
          }
        : {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            email: form.email.trim(),
            role: currentRole,
            company: form.company.trim() || undefined,
            notes: form.notes.trim() || undefined,
          };

    try {
      const endpoint = currentRole === 'THERAPIST' ? '/api/register' : '/api/access-request';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
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
        throw new Error(data.message || 'Ein Fehler ist aufgetreten');
      }

      if (currentRole === 'THERAPIST') {
        track('therapist_registration_submitted', {
          city: form.city.trim(),
          specialties: form.specialties,
          modalities: form.modalities,
        });
      } else {
        track('access_request_submitted', {
          role: currentRole,
          company: form.company.trim() || undefined,
        });
      }

      setSubmittedRole(currentRole);
      setStatus('success');
      setForm(initialState);
      setErrors({});
    } catch (error) {
      console.error('Error submitting registration:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitLabel = form.role === 'THERAPIST' ? 'Registrierung abschließen' : 'Zugang anfragen';

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm sm:p-8">
      <header className="mb-6">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">
          {form.role === 'THERAPIST' ? 'Pilot-Registrierung' : 'Zugangsanfrage'}
        </h2>
        <p className="mt-2 text-sm text-neutral-800">
          Fülle das Formular aus – wir melden uns werktags innerhalb von 24 Stunden.
        </p>
      </header>

      {status === 'success' && (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
        >
          <CheckCircle2 className="mt-0.5 h-5 w-5 flex-none" aria-hidden />
          <div>
            <p className="font-semibold">{successCopy.title}</p>
            <p>{successCopy.body}</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <div
            className="mt-0.5 h-5 w-5 flex-none rounded-full border-2 border-red-600 flex items-center justify-center text-red-600 font-bold"
            aria-hidden
          >
            !
          </div>
          <div>
            <p className="font-semibold">Fehler beim Senden</p>
            <p>{errorMessage || 'Bitte versuche es später erneut oder kontaktiere uns direkt.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="firstName">
            <span className="font-medium text-default">Vorname</span>
            <Input
              id="firstName"
              value={form.firstName}
              onChange={handleChange('firstName')}
              placeholder="Alex"
              hasError={Boolean(errors.firstName)}
              required
            />
            {errors.firstName && <span className="text-xs text-red-600">{errors.firstName}</span>}
          </label>
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="lastName">
            <span className="font-medium text-default">Nachname</span>
            <Input
              id="lastName"
              value={form.lastName}
              onChange={handleChange('lastName')}
              placeholder="Muster"
              hasError={Boolean(errors.lastName)}
              required
            />
            {errors.lastName && <span className="text-xs text-red-600">{errors.lastName}</span>}
          </label>
        </div>

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="email">
          <span className="font-medium text-default">E-Mail</span>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="kontakt@findmytherapy.net"
            hasError={Boolean(errors.email)}
            required
          />
          {errors.email && <span className="text-xs text-red-600">{errors.email}</span>}
        </label>

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="role">
          <span className="font-medium text-default">Ich interessiere mich als</span>
          <select
            id="role"
            value={form.role}
            onChange={handleChange('role')}
            className="input"
            aria-invalid={Boolean(errors.role) || undefined}
          >
            {Object.entries(roleLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.role && <span className="text-xs text-red-600">{errors.role}</span>}
        </label>

        {form.role === 'THERAPIST' && (
          <div className="space-y-5 rounded-2xl border border-divider bg-surface-1/90 p-4">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">
              Profil-Angaben
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1 text-sm text-neutral-700">
                <label htmlFor="password" className="font-medium text-default">
                  Passwort
                </label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange('password')}
                  placeholder="Mindestens 8 Zeichen"
                  hasError={Boolean(errors.password)}
                  required
                  autoComplete="new-password"
                />
                {errors.password && <span className="text-xs text-red-600">{errors.password}</span>}
              </div>
              <div className="space-y-1 text-sm text-neutral-700">
                <label htmlFor="confirmPassword" className="font-medium text-default">
                  Passwort bestätigen
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  placeholder="Passwort wiederholen"
                  hasError={Boolean(errors.confirmPassword)}
                  required
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-600">{errors.confirmPassword}</span>
                )}
              </div>
            </div>

            <label className="space-y-1 text-sm text-neutral-700" htmlFor="city">
              <span className="font-medium text-default">Praxisstandort</span>
              <Input
                id="city"
                value={form.city}
                onChange={handleChange('city')}
                placeholder="z. B. Wien"
                hasError={Boolean(errors.city)}
                required
              />
              {errors.city && <span className="text-xs text-red-600">{errors.city}</span>}
            </label>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-default">Schwerpunkte</legend>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions.map((option) => {
                  const isActive = form.specialties.includes(option);
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => toggleSpecialty(option)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                        isActive
                          ? 'border-primary bg-primary text-primary-foreground shadow-sm shadow-primary/25'
                          : 'border-divider text-muted hover:border-primary/40 hover:text-primary'
                      }`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>
              {errors.specialties && (
                <span className="text-xs text-red-600">{errors.specialties}</span>
              )}
            </fieldset>

            <fieldset className="space-y-2">
              <legend className="text-sm font-medium text-default">Formate</legend>
              <div className="flex flex-wrap gap-2">
                {formatOptions.map((option) => {
                  const isActive = form.modalities.includes(option.id);
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => toggleFormat(option.id)}
                      className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                        isActive
                          ? 'border-secondary-500 bg-secondary-500 text-white shadow-sm shadow-secondary/20'
                          : 'border-divider text-muted hover:border-secondary-400 hover:text-secondary-600'
                      }`}
                    >
                      {option.label}
                    </button>
                  );
                })}
              </div>
              {errors.modalities && (
                <span className="text-xs text-red-600">{errors.modalities}</span>
              )}
            </fieldset>

            <div className="space-y-4 rounded-2xl border border-primary/30 bg-primary/10 p-4 dark:border-primary/50 dark:bg-primary/20">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">
                Sichtbarkeit &amp; Konditionen
              </h4>
              <label className="space-y-1 text-sm text-neutral-700" htmlFor="availabilityNote">
                <span className="font-medium text-default">Freie Termine &amp; Erreichbarkeit</span>
                <Textarea
                  id="availabilityNote"
                  value={form.availabilityNote}
                  onChange={handleChange('availabilityNote')}
                  rows={3}
                  maxLength={500}
                  placeholder="z. B. Erstgespräche ab Juni, Abendtermine Mittwoch & Donnerstag, dringende Slots auf Anfrage …"
                />
                <span className="text-xs text-neutral-900">Optional, max. 500 Zeichen</span>
              </label>

              <label className="space-y-1 text-sm text-neutral-700" htmlFor="pricingNote">
                <span className="font-medium text-default">
                  Preishinweise &amp; Sonderkonditionen
                </span>
                <Textarea
                  id="pricingNote"
                  value={form.pricingNote}
                  onChange={handleChange('pricingNote')}
                  rows={3}
                  maxLength={500}
                  placeholder="z. B. €80–110 pro Einheit, Sozialtarife für Studierende, Firmenabrechnung via FindMyTherapy …"
                />
                <span className="text-xs text-neutral-900">Optional, max. 500 Zeichen</span>
              </label>
            </div>
          </div>
        )}

        {form.role === 'ORGANISATION' && (
          <label className="space-y-1 text-sm text-neutral-700" htmlFor="company">
            <span className="font-medium text-default">Unternehmen / Organisation</span>
            <Input
              id="company"
              value={form.company}
              onChange={handleChange('company')}
              placeholder="FindMyTherapy GmbH"
              hasError={Boolean(errors.company)}
              required
            />
            {errors.company && <span className="text-xs text-red-600">{errors.company}</span>}
          </label>
        )}

        <label className="space-y-1 text-sm text-neutral-700" htmlFor="notes">
          <div className="flex items-center justify-between">
            <span className="font-medium text-default">
              {form.role === 'THERAPIST'
                ? 'Was sollen wir über dich wissen?'
                : 'Worauf sollen wir uns vorbereiten?'}
            </span>
            <span className="text-xs text-neutral-900">Optional</span>
          </div>
          <Textarea
            id="notes"
            value={form.notes}
            onChange={handleChange('notes')}
            placeholder={
              form.role === 'THERAPIST'
                ? 'Z. B. gewünschte Zielgruppen, zusätzliche Qualifikationen, bevorzugte Termine …'
                : 'Z. B. Fokus auf Kursinhalte, Employer Branding, Abrechnung …'
            }
            rows={4}
          />
        </label>

        <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary dark:border-primary/50 dark:bg-primary/20">
          {accessSummary}
        </div>

        {form.role === 'THERAPIST' && (
          <label className="flex items-start gap-3 rounded-2xl border border-divider bg-surface-1/90 p-4 text-sm text-neutral-800">
            <input
              type="checkbox"
              checked={form.acceptTerms}
              onChange={handleChange('acceptTerms')}
              className="mt-1 h-4 w-4 rounded border border-divider"
              required
            />
            <span>
              Ich stimme den{' '}
              <a
                className="text-primary underline"
                href="/terms"
                target="_blank"
                rel="noopener noreferrer"
              >
                Nutzungsbedingungen
              </a>{' '}
              und der{' '}
              <a
                className="text-primary underline"
                href="/privacy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Datenschutzrichtlinie
              </a>{' '}
              zu.
              {errors.acceptTerms && (
                <span className="mt-1 block text-xs text-red-600">{errors.acceptTerms}</span>
              )}
            </span>
          </label>
        )}

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              Wird gesendet …
            </span>
          ) : (
            submitLabel
          )}
        </Button>

        <p className="text-center text-xs text-neutral-800">
          Mit dem Absenden bestätigst du, dass wir dich per E-Mail oder Telefon kontaktieren dürfen.
          Keine Werbung, keine Weitergabe deiner Daten.
        </p>
      </form>
    </div>
  );
}
