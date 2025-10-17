import { contrastRatio, designTokens } from '@mental-health/ui';

const shadeOrder = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] as const;

type PaletteKey = keyof typeof designTokens.color;

interface PaletteGuideline {
  key: PaletteKey;
  title: string;
  description: string;
  do: string[];
  dont: string[];
}

const paletteGuidelines: PaletteGuideline[] = [
  {
    key: 'primary',
    title: 'Primary',
    description: 'Hauptfarbe für Calls-to-Action, primäre Links und interaktive States.',
    do: [
      '600 als Standardton für Buttons und Links verwenden.',
      '50-200 für dezente Flächen, Hover- und Fokus-States einsetzen.',
      '900 für Text auf Akzentflächen verwenden.',
    ],
    dont: [
      'Nicht unter 400 für Text einsetzen - Kontrast zu gering.',
      'Keine Kombination mit Danger-, Warning- oder Success-Tönen für semantische Hinweise.',
    ],
  },
  {
    key: 'secondary',
    title: 'Secondary',
    description: 'Unterstützende Aktionen, Filter und Navigationselemente.',
    do: [
      '600 als Standardton für sekundäre Buttons und Chips nutzen und immer mit dem Secondary-Foreground-Token kombinieren.',
      '50-200 für Karten- oder Pill-Hintergründe einsetzen.',
      'Mit Primary kombinieren, um Hierarchien abzubilden.',
    ],
    dont: [
      'Nicht als Fehlerfarbe missbrauchen.',
      'Sekundäre Aktionen nicht dunkler als 800 färben - Lesbarkeit sinkt.',
    ],
  },
  {
    key: 'accent',
    title: 'Accent',
    description: 'Emotionale Highlights, Datenpunkte oder Status-Badges mit hoher Aufmerksamkeit.',
    do: [
      '400-600 für Badges und Highlight-Chips verwenden.',
      '100-300 für warme, freundliche Hintergründe einsetzen.',
      'Text immer mit dem Accent-Foreground oder Neutral 900 kombinieren (AA+).',
    ],
    dont: [
      'Nicht als Primärfarbe für Buttons verwenden - Fokus auf Brand-Farben.',
      'Nicht mit Danger- oder Warning-Farben kombinieren.',
    ],
  },
  {
    key: 'info',
    title: 'Info',
    description: 'Systemhinweise, neutrale Kommunikation und Inline-Hilfen.',
    do: [
      '600-700 für Text und Icons in Info-Alerts einsetzen.',
      '50-200 als Hintergrund für Benachrichtigungen verwenden.',
      'Weißtext ab 700 kombinieren (AA erfüllt).',
    ],
    dont: [
      'Nicht für positive oder negative Zustände nutzen.',
      'Keine Mischung mit Primary in demselben Element.',
    ],
  },
  {
    key: 'success',
    title: 'Success',
    description: 'Bestätigungen, abgeschlossene Aufgaben, positive Statusmeldungen.',
    do: [
      '600 als Standard für Erfolgsbuttons oder -Badges verwenden.',
      '50-200 für Hintergründe bei positiven Hinweisen einsetzen.',
      'Mit Weißtext ab 600 kombinieren (AA erfüllt).',
    ],
    dont: [
      'Nicht mit Warning/Danger mischen - Signalwirkung leidet.',
      'Kein reines Grün auf Grün (Kontrastverlust).',
    ],
  },
  {
    key: 'warning',
    title: 'Warning',
    description: 'Hinweise mit Bewusstsein für Risiken, aber ohne unmittelbare Gefahr.',
    do: [
      '700-800 für Text und Icons verwenden.',
      '50-200 als Hintergrundflächen für Warnungen einsetzen.',
      'Buttons im Warning-Stil mit dem On-Warning-Token (dunkler Text) kombinieren.',
    ],
    dont: [
      'Nicht als Primärfarbe einsetzen.',
      'Keine Kombination mit Danger - Nutzer:innen verwechseln die Bedeutung.',
    ],
  },
  {
    key: 'danger',
    title: 'Danger',
    description: 'Fehlerzustände, kritische Aktionen (z. B. löschen) und eskalierende Hinweise.',
    do: [
      '600 als Standard für Destruktions-Buttons verwenden.',
      '50-200 für Fehlermeldungs-Hintergründe nutzen.',
      'Mit Weißtext ab 600 kombinieren (AA erfüllt).',
    ],
    dont: [
      'Nicht in Kombination mit Primary für Action-Gruppen verwenden.',
      'Keine Flächen unter 200 für Text nutzen - Kontrast zu schwach.',
    ],
  },
  {
    key: 'neutral',
    title: 'Neutral',
    description: 'Typografie, Hintergründe, Linien und Container.',
    do: [
      '50-200 als Standardflächen (Surface 1-3) nutzen.',
      '400-600 für Text in Disabled-Zuständen verwenden.',
      '900-950 für Text auf hellen Hintergründen einsetzen.',
    ],
    dont: [
      'Nicht für semantische Signale missbrauchen.',
      'Keinen Neutral-Ton unter 200 für Text nutzen.',
    ],
  },
];

const getSwatchTextColor = (hex: string) => (contrastRatio('#121F21', hex) >= 4.5 ? '#121F21' : '#FFFFFF');

const Swatch = ({ shade, hex }: { shade: string; hex: string }) => {
  const textColor = getSwatchTextColor(hex);

  return (
    <div
      className="flex h-24 flex-col justify-between rounded-xl border border-strong p-3 text-sm shadow-sm"
      style={{ backgroundColor: hex, color: textColor }}
    >
      <span className="font-semibold"> {shade}</span>
      <span className="font-mono text-xs uppercase tracking-wider">{hex}</span>
    </div>
  );
};

const DoDontList = ({ title, items, tone }: { title: string; items: string[]; tone: 'do' | 'dont' }) => (
  <div
    className={`rounded-xl border p-4 text-sm ${
      tone === 'do' ? 'border-success bg-success/10 text-success-foreground' : 'border-danger bg-danger/10 text-danger-foreground'
    }`}
  >
    <p className="font-semibold uppercase tracking-wide">{title}</p>
    <ul className="mt-2 space-y-1 text-sm leading-relaxed">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden>{tone === 'do' ? '✓' : '✕'}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const surfaces = [
  { name: 'Surface BG', hex: designTokens.surface.bg, description: 'App-Hintergrund (Light).' },
  { name: 'Surface 1', hex: designTokens.surface.surface1, description: 'Karten & modulare Container.' },
  { name: 'Surface 2', hex: designTokens.surface.surface2, description: 'Sekundäre Flächen, Panels.' },
  { name: 'Surface 3', hex: designTokens.surface.surface3, description: 'Tertiäre Flächen, Hover-States.' },
  { name: 'Inverse BG', hex: designTokens.surface.inverseBg, description: 'App-Hintergrund (Dark).' },
  { name: 'Inverse Surface', hex: designTokens.surface.inverseSurface, description: 'Card/Dock in Dark Mode.' },
] as const;

const textTokens = [
  { name: 'Text Default', hex: designTokens.text.default, usage: 'Primärer Text, Headlines.' },
  { name: 'Text Muted', hex: designTokens.text.muted, usage: 'Sekundärer Text, Labels.' },
  { name: 'Text Subtle', hex: designTokens.text.subtle, usage: 'Disabled, Secondary Metadata.' },
  { name: 'Text Inverse', hex: designTokens.text.inverse, usage: 'Text auf dunklen Flächen.' },
  { name: 'Link', hex: designTokens.text.link, usage: 'Interaktive Links auf hellem BG.' },
] as const;

export default function ColorsDocsPage() {
  return (
    <div className="space-y-20">
      {paletteGuidelines.map((palette) => (
        <section key={palette.key} className="space-y-8">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
            <div className="space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">{palette.title}</h2>
                <p className="text-subtle leading-relaxed">{palette.description}</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <DoDontList title="Do" items={palette.do} tone="do" />
                <DoDontList title="Don't" items={palette.dont} tone="dont" />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-6 sm:grid-cols-3">
              {shadeOrder.map((shade) => (
                <Swatch key={shade} shade={shade} hex={designTokens.color[palette.key][shade]} />
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold">Surfaces & Hintergründe</h2>
          <p className="text-subtle leading-relaxed">
            Oberflächenfarben definieren die hierarchische Tiefe von Komponenten und erlauben weiche Übergänge zwischen
            Sektionen. In Simple Mode werden Surface-Borders verstärkt (&gt;400), um Senior*innen mehr Orientierung zu geben.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {surfaces.map((surface) => (
            <div
              key={surface.name}
              className="rounded-2xl border border-strong bg-surface-1 p-5 shadow-sm"
              style={{ backgroundImage: `linear-gradient(135deg, ${surface.hex} 65%, rgba(255,255,255,0.9))` }}
            >
              <p className="font-semibold">{surface.name}</p>
              <p className="text-subtle text-sm">{surface.description}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">{surface.hex}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold">Typografie & Interaktion</h2>
          <p className="text-subtle leading-relaxed">
            Textfarben sind strikt an WCAG 2.2 AA ausgerichtet. Link-Töne wechseln im Dark Mode auf Primary 300, um mindestens
            7:1 Kontrast gegenüber dem inversen Hintergrund zu halten.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {textTokens.map((token) => (
            <div key={token.name} className="rounded-2xl border border-strong bg-surface-1 p-5 shadow-sm">
              <p className="font-semibold">{token.name}</p>
              <p className="text-subtle text-sm">{token.usage}</p>
              <p className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">{token.hex}</p>
              <div
                className="mt-4 rounded-lg border border-dashed border-strong p-4"
                style={{
                  color: token.hex,
                }}
              >
                Beispieltext mit {token.name}.
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="space-y-2">
          <h2 className="text-2xl font-semibold">Fokus-Ringe</h2>
          <p className="text-subtle leading-relaxed">
            Fokusmarkierungen liegen bei mindestens 3:1 gegenüber dem umgebenden Hintergrund. Im Simple Mode wird der Ring
            breiter (4px) und verwendet Primary 900 für maximale Sichtbarkeit.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-strong bg-surface-1 p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted">Light Mode</p>
            <button type="button" className="btn btn-outline mt-4 ring-focus focus-visible:ring focus-visible:ring-focus">
              Tastatur-Fokus
            </button>
            <p className="mt-4 text-sm text-subtle">
              Farbe: {designTokens.focus.ring} - Kontrast zu Weiß:{' '}
              {contrastRatio(designTokens.focus.ring, designTokens.surface.bg)}
            </p>
          </div>
          <div className="theme-dark rounded-2xl border border-strong bg-surface-1 p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted">Dark Mode</p>
            <button type="button" className="btn btn-outline mt-4 ring-focus focus-visible:ring focus-visible:ring-focus">
              Tastatur-Fokus
            </button>
            <p className="mt-4 text-sm text-subtle">
              Farbe: {designTokens.color.primary['400']} - Kontrast zu {designTokens.surface.inverseBg}:{' '}
              {contrastRatio(designTokens.color.primary['400'], designTokens.surface.inverseBg)}
            </p>
          </div>
          <div className="theme-simple rounded-2xl border border-strong bg-surface-1 p-6 shadow-sm">
            <p className="text-sm font-semibold text-muted">Simple Mode</p>
            <button type="button" className="btn btn-outline mt-4 ring-focus focus-visible:ring focus-visible:ring-focus">
              Tastatur-Fokus
            </button>
            <p className="mt-4 text-sm text-subtle">
              Farbe: {designTokens.color.primary['900']} - Kontrast:{' '}
              {contrastRatio(designTokens.color.primary['900'], designTokens.surface.bg)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
