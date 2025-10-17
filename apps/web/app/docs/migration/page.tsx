const tokenMapping = [
  { legacy: 'bg-background', modern: 'bg-surface' },
  { legacy: 'text-foreground', modern: 'text' },
  { legacy: 'border-border', modern: 'border' },
  { legacy: 'ring-ring', modern: 'ring-focus focus-visible:ring focus-visible:ring-focus' },
  { legacy: 'bg-primary', modern: 'bg-[rgb(var(--primary))] -> via Button/BEM-Klassen' },
  { legacy: 'text-muted-foreground', modern: 'text-muted' },
  { legacy: 'bg-muted', modern: 'bg-surface-2' },
  { legacy: 'bg-accent', modern: 'bg-surface-3 oder badge-accent' },
];

export default function MigrationGuidePage() {
  return (
    <div className="space-y-12">
      <section className="space-y-3">
        <h2 className="text-2xl font-semibold">Migration auf die neuen Tokens</h2>
        <p className="text-subtle leading-relaxed">
          Das neue Farbsystem ersetzt die alten HSL-Variablen durch Design Tokens auf RGB-Basis. Die folgenden Schritte
          helfen, bestehende Screens ohne Regressions zu aktualisieren. Fokus liegt auf Barrierefreiheit (WCAG 2.2 AA) und
          konsistenter Theme-Unterstützung.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">1. Tailwind-Klassen ersetzen</h3>
        <p className="text-subtle leading-relaxed">
          Ersetze Legacy-Utilities (`bg-background`, `text-foreground`, …) durch die neuen semantischen Klassen. Die meisten
          Mappings sind 1:1 austauschbar.
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border-collapse rounded-2xl border border-strong bg-surface-1 text-sm shadow-sm">
            <thead className="bg-surface-2 text-muted">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Legacy Utility</th>
                <th className="px-4 py-3 text-left font-semibold">Neues Token / Utility</th>
              </tr>
            </thead>
            <tbody>
              {tokenMapping.map((row) => (
                <tr key={row.legacy} className="border-t border-divider">
                  <td className="px-4 py-3 font-mono text-xs uppercase tracking-widest text-muted">{row.legacy}</td>
                  <td className="px-4 py-3 text-sm">{row.modern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">2. Komponenten konsolidieren</h3>
        <p className="text-subtle leading-relaxed">
          Nutze die neuen Utility-Klassen (`btn-*`, `badge-*`, `alert-*`) oder die React-Komponenten aus{' '}
          <code className="rounded bg-surface-3 px-1 py-0.5"> @mental-health/ui</code>, um einheitliche States zu erhalten.
        </p>
        <pre className="overflow-x-auto rounded-2xl border border-strong bg-surface-1 p-4 text-xs leading-relaxed shadow-sm">
{`// Vorher
<button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md">
  Speichern
</button>

// Nachher
import { Button } from '@mental-health/ui';

<Button variant="primary">Speichern</Button>`}
        </pre>
        <p className="text-subtle text-sm">
          Falls Inline-Klassen bevorzugt werden, können die CSS-Hilfsklassen direkt eingesetzt werden:
          <code className="mx-2 rounded bg-surface-3 px-1 py-0.5">className=&quot;btn btn-primary&quot;</code>.
        </p>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">3. Fokus-Ringe und Simple Mode prüfen</h3>
        <ul className="space-y-2 text-sm leading-relaxed text-subtle">
          <li>Stelle sicher, dass interaktive Elemente die Utility <code className="mx-1 rounded bg-surface-3 px-1 py-0.5">ring-focus</code> verwenden.</li>
          <li>Überprüfe Komponenten in allen Themes (Light, Dark, Simple) mithilfe des Theme Switchers in der Docs.</li>
          <li>Für Simple Mode sollten Buttons `btn-primary` automatisch auf Primary 800/900 wechseln.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">4. Tests ausführen</h3>
        <p className="text-subtle leading-relaxed">
          Nach der Migration sollten automatisierte Checks laufen:
        </p>
        <ul className="space-y-2 text-sm leading-relaxed text-subtle">
          <li>
            <code className="rounded bg-surface-3 px-1 py-0.5">pnpm --filter @mental-health/ui test</code> - prüft Kontrastwerte.
          </li>
          <li>
            <code className="rounded bg-surface-3 px-1 py-0.5">pnpm --filter web e2e</code> - führt Playwright + Axe über die
            Komponenten-Dokumentation aus.
          </li>
        </ul>
      </section>

      <section className="rounded-3xl border border-success bg-success/10 p-6 text-success-foreground shadow-[0_20px_40px_-30px_rgb(var(--shadow-color))]">
        <h3 className="text-lg font-semibold">Checkliste</h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed">
          <li>Alle Legacy-Klassen ersetzt (siehe Tabelle).</li>
          <li>Buttons/Alerts/Formulare nutzen die neuen Utilities oder Komponenten.</li>
          <li>Fokus-Ringe sichtbar (&gt;= 3:1) in Light/Dark/Simple.</li>
          <li>Kontrast-Jest- und Axe-Playwright-Tests laufen grün.</li>
        </ul>
      </section>
    </div>
  );
}
