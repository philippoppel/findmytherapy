'use client';

import Link from 'next/link';
import { useId, useState } from 'react';
import clsx from 'clsx';
import { Button, Input, Textarea } from '@mental-health/ui';
import { CheckCircle2, Loader2, MailPlus, PenLine } from 'lucide-react';

type Variant = 'newsletter' | 'topic';

type NewsletterFormProps = {
  variant?: Variant;
  className?: string;
  title?: string;
  description?: string;
};

const defaultCopy: Record<Variant, { title: string; description: string }> = {
  newsletter: {
    title: 'Newsletter & Produkt-Updates',
    description:
      'Monatliche Insights zu neuen Features, Studien und mental-health-relevanten Ressourcen.',
  },
  topic: {
    title: 'Themenwunsch teilen',
    description:
      'Sag uns, welche Fragen wir beantworten dürfen – wir bereiten fundierte Artikel und Interviews vor.',
  },
};

const topicMap: Record<Variant, 'orientation' | 'support'> = {
  newsletter: 'orientation',
  topic: 'support',
};

export function NewsletterForm({
  variant = 'newsletter',
  className,
  title,
  description,
}: NewsletterFormProps) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
    consent: false,
  });
  const formId = useId();
  const fieldId = (field: 'name' | 'email' | 'message' | 'consent') => `${formId}-${field}`;
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState<string>('');

  const handleChange =
    (field: 'name' | 'email' | 'message') =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;
      setForm((prev) => ({ ...prev, [field]: value }));
    };

  const toggleConsent = () => {
    setForm((prev) => ({ ...prev, consent: !prev.consent }));
  };

  const isDisabled =
    !form.name ||
    !form.email ||
    form.message.trim().length < 10 ||
    !form.consent ||
    status === 'loading';

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isDisabled) return;

    setStatus('loading');
    setError('');

    try {
      const payload = {
        name: form.name,
        email: form.email,
        phone: '',
        topic: topicMap[variant],
        message: `${variant === 'newsletter' ? 'Newsletter-Opt-in' : 'Themenwunsch'}:\n${form.message}`,
        preferredSlot: 'flexible',
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || 'Senden fehlgeschlagen');
      }

      setStatus('success');
      setForm({
        name: '',
        email: '',
        message: '',
        consent: false,
      });
    } catch (err) {
      console.error('Newsletter form error', err);
      setStatus('error');
      setError(
        err instanceof Error ? err.message : 'Etwas ist schiefgelaufen. Bitte versuche es erneut.',
      );
    } finally {
      setStatus((prev) => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return (
    <div
      className={clsx(
        'rounded-3xl border border-white/25 bg-white/10 p-6 text-white shadow-xl shadow-black/10 backdrop-blur',
        className,
      )}
    >
      <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-white/80">
        {variant === 'newsletter' ? (
          <MailPlus className="h-4 w-4" aria-hidden />
        ) : (
          <PenLine className="h-4 w-4" aria-hidden />
        )}
        {variant === 'newsletter' ? 'Newsletter' : 'Themenwunsch'}
      </div>
      <h3 className="mt-4 text-2xl font-semibold text-white">
        {title ?? defaultCopy[variant].title}
      </h3>
      <p className="mt-2 text-sm text-white/80">
        {description ?? defaultCopy[variant].description}
      </p>

      {status === 'success' && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-emerald-400/60 bg-emerald-500/15 px-4 py-3 text-sm text-white">
          <CheckCircle2 className="h-5 w-5 flex-none text-emerald-300" aria-hidden />
          <div>
            <p className="font-semibold">Danke! Wir haben dich auf die Liste gesetzt.</p>
            <p>Du erhältst eine persönliche Bestätigung per E-Mail.</p>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="mt-4 rounded-2xl border border-red-400/60 bg-red-500/15 px-4 py-3 text-sm text-white">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <label className="space-y-1 text-sm" htmlFor={fieldId('name')}>
          <span className="font-semibold text-white/90">Name</span>
          <Input
            id={fieldId('name')}
            value={form.name}
            onChange={handleChange('name')}
            placeholder="Alex Beispiel"
            required
            className="border-white/30 bg-white/10 text-white placeholder:text-white/60"
          />
        </label>
        <label className="space-y-1 text-sm" htmlFor={fieldId('email')}>
          <span className="font-semibold text-white/90">E-Mail</span>
          <Input
            id={fieldId('email')}
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            placeholder="team@beispiel.at"
            required
            className="border-white/30 bg-white/10 text-white placeholder:text-white/60"
          />
        </label>
        <label className="space-y-1 text-sm" htmlFor={fieldId('message')}>
          <span className="font-semibold text-white/90">
            {variant === 'newsletter'
              ? 'Optional: Welche Updates interessieren dich?'
              : 'Was sollen wir behandeln?'}
          </span>
          <Textarea
            id={fieldId('message')}
            value={form.message}
            onChange={handleChange('message')}
            rows={4}
            placeholder={
              variant === 'newsletter'
                ? 'z. B. Produkt-Roadmap, Unternehmensangebote, Research ...'
                : 'z. B. „Mehr zu PHQ-9 Ergebnissen bei Jugendlichen“'
            }
            required
            className="border-white/30 bg-white/10 text-white placeholder:text-white/60"
          />
          <span className="text-xs text-white/70">
            Mindestens 10 Zeichen – damit wir zielgerichtet antworten können.
          </span>
        </label>

        <div className="flex items-start gap-3 text-xs text-white/80">
          <input
            id={fieldId('consent')}
            type="checkbox"
            checked={form.consent}
            onChange={toggleConsent}
            className="mt-1 h-4 w-4 rounded border-white/50 bg-white/10 text-primary-900 focus:ring-white/50"
            required
          />
          <label htmlFor={fieldId('consent')}>
            Ich bin mit der einmaligen Kontaktaufnahme und der Speicherung meiner Angaben gemäß{' '}
            <Link href="/privacy" className="underline" aria-label="Datenschutzerklärung">
              Datenschutzerklärung
            </Link>{' '}
            einverstanden.
          </label>
        </div>

        <Button
          type="submit"
          disabled={isDisabled}
          className="w-full bg-white text-primary-900 shadow-lg shadow-black/20 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {status === 'loading' ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
              Wird gesendet...
            </>
          ) : variant === 'newsletter' ? (
            'Newsletter abonnieren'
          ) : (
            'Themenwunsch senden'
          )}
        </Button>
        <p className="text-[11px] text-white/70">
          Keine Spam-Mails. Wir melden uns nur, wenn neue Blogposts, Studien oder Produktfeatures
          live gehen.
        </p>
      </form>
    </div>
  );
}
