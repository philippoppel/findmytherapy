'use client';

import { useMemo } from 'react';
import {
  Alert,
  Badge,
  Button,
  FormField,
  Input,
  Link as UiLink,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from '@mental-health/ui';
import { AlertTriangle, CheckCircle2, Info, LinkIcon } from 'lucide-react';

import { ThemePreview } from '../../../components/docs/ThemePreview';

const themes = [
  {
    id: 'theme-light' as const,
    title: 'Light Theme',
    description: 'Standard-Variante für Tageslicht-Umgebungen. Ruhige Oberflächen und neutrale Typografie.',
  },
  {
    id: 'theme-dark' as const,
    title: 'Dark Theme',
    description: 'Für geringe Umgebungshelligkeit. Primärtöne werden weicher, Fokus-Ringe bleiben bei >= 3:1.',
  },
  {
    id: 'theme-simple' as const,
    title: 'Simple Mode',
    description: 'Senior*innenfreundliche Variante mit hohen Kontrasten, kräftigen Buttons und dicken Fokus-Ringen.',
  },
] satisfies Array<{
  id: 'theme-light' | 'theme-dark' | 'theme-simple';
  title: string;
  description: string;
}>;

const buttonIcons = {
  info: <Info size={16} aria-hidden />,
  success: <CheckCircle2 size={16} aria-hidden />,
  warning: <AlertTriangle size={16} aria-hidden />,
};

export default function ComponentsDocsPage() {
  const formOptions = useMemo(
    () => [
      { value: 'cbt', label: 'Kognitive Verhaltenstherapie' },
      { value: 'systemic', label: 'Systemische Therapie' },
      { value: 'mindfulness', label: 'Achtsamkeitsbasierte Verfahren' },
    ],
    [],
  );

  return (
    <div className="space-y-16">
      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold">Buttons</h2>
          <p className="text-subtle leading-relaxed">
            Primäre Aktionen verwenden Primary 600 (Simple Mode 800). Hover-States werden automatisch aus den Token-Aliases
            berechnet, Disabled-Zustände reduzieren Sättigung und setzen Pointer-Events aus.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme.id} title={theme.title} description={theme.description}>
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">
                  Handeln <span aria-hidden="true">&rarr;</span>
                </Button>
                <Button variant="secondary">Sekundär</Button>
                <Button variant="accent">Akzent</Button>
                <Button variant="danger">Gefahr</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="primary" disabled>
                  Deaktiviert
                </Button>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="sm" variant="primary">
                  Klein
                </Button>
                <Button size="lg" variant="primary">
                  Groß
                </Button>
                <Button size="icon" variant="secondary" aria-label="Information">
                  {buttonIcons.info}
                </Button>
                <Button size="icon" variant="danger" aria-label="Warnung">
                  {buttonIcons.warning}
                </Button>
              </div>
            </ThemePreview>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold">Alerts</h2>
          <p className="text-subtle leading-relaxed">
            Alerts setzen auf semantische Paletten: Info-Blau, Success-Grün, Warning-Orange, Danger-Rot. Titel sind
            semibold, Beschreibungen nutzen Text Subtle. Screenreader erhalten die passenden ARIA-Rollen.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme.id} title={theme.title} description="Semantische Varianten">
              <div className="space-y-4">
                <Alert
                  variant="info"
                  title="Neues Angebot verfügbar"
                  description="Wöchentliche Gruppensitzung für Angehörige ergänzt das Kursprogramm."
                />
                <Alert
                  variant="success"
                  title="Ziel erreicht"
                  description="Ihre tägliche Achtsamkeitsübung wurde sieben Tage in Folge abgeschlossen."
                />
                <Alert
                  variant="warning"
                  title="Terminbestätigung offen"
                  description="Bitte bestätigen Sie bis morgen 12 Uhr, sonst wird der Slot wieder freigegeben."
                />
                <Alert
                  variant="danger"
                  title="Zahlung fehlgeschlagen"
                  description="Wir konnten Ihre SEPA-Lastschrift nicht einziehen. Bitte Zahlungsdaten prüfen."
                />
              </div>
            </ThemePreview>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold">Formulare</h2>
          <p className="text-subtle leading-relaxed">
            Form Controls nutzen verstärkte Fokus-Ringe und klare Fehlermeldungen. Simple Mode setzt höhere Border-Kontraste
            und größere Abstände für motorische Sicherheit.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme.id} title={theme.title} description="Input, Select & Textarea">
              <form className="space-y-5">
                <FormField
                  id={`fullname-${theme.id}`}
                  label="Name der Klientin"
                  helperText="Volle Schreibweise inkl. akademischer Titel."
                  required
                >
                  <Input placeholder="Dr. Marie Schneider" />
                </FormField>
                <FormField
                  id={`therapy-${theme.id}`}
                  label="Therapieschwerpunkt"
                  errorText={theme.id === 'theme-simple' ? undefined : 'Bitte wählen Sie einen Schwerpunkt aus'}
                  required
                >
                  <Select defaultValue={formOptions[0]?.value}>
                    <SelectTrigger
                      hasError={theme.id !== 'theme-simple' ? true : undefined}
                      aria-label="Therapieschwerpunkt"
                    >
                      <SelectValue placeholder="Auswahl treffen" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormField>
                <FormField
                  id={`notes-${theme.id}`}
                  label="Sitzungsnotizen"
                  helperText="Sichtbar für Team-Mitglieder und Supervision."
                >
                  <Textarea placeholder="Kurze Stichpunkte, Fokus auf Stimmung und Ziele..." rows={4} />
                </FormField>
              </form>
            </ThemePreview>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold">Badges & Links</h2>
          <p className="text-subtle leading-relaxed">
            Badges nutzen Accent- und Feedback-Paletten mit Neutral 900 als Textfarbe (&gt;= 7:1). Links passen sich dem Theme
            an: Primary 700 in Light/Simple, Primary 300 im Dark Mode.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {themes.map((theme) => (
            <ThemePreview key={theme.id} theme={theme.id} title={theme.title} description="Status & Inline-Aktionen">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">Neue Übung</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="success">Stabil</Badge>
                <Badge variant="warning">Achtung</Badge>
                <Badge variant="danger">Kritisch</Badge>
                <Badge variant="neutral">Neutral</Badge>
              </div>
              <div className="space-y-2 rounded-2xl border border-dashed border-strong p-4">
                <p className="text-muted text-sm">Inline Links</p>
                <p>
                  <UiLink href="#" className="inline-flex items-center gap-1">
                    Broschüre für Angehörige ansehen <LinkIcon size={16} aria-hidden />
                  </UiLink>
                </p>
                <p>
                  <UiLink href="#" className="inline-flex items-center gap-1">
                    Termin umbuchen <LinkIcon size={16} aria-hidden />
                  </UiLink>
                </p>
              </div>
            </ThemePreview>
          ))}
        </div>
      </section>
    </div>
  );
}
