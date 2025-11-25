const sections = [
  {
    id: 'controller',
    title: '1. Verantwortliche Stelle',
    body: `FindMyTherapy GmbH
Mariahilfer Straße 10/2
1070 Wien, Österreich

E-Mail: privacy@findmytherapy.net
Telefon: +43 1 997 1212
Firmenbuchnummer: FN 123456a
UID: ATU12345678

Vertretungsbefugte Geschäftsführer: [Name]`,
  },
  {
    id: 'overview',
    title: '2. Überblick',
    body: 'FindMyTherapy ist eine Plattform zur Vermittlung von psychotherapeutischen Leistungen und digitalen Gesundheitsangeboten. Wir nehmen den Schutz Ihrer personenbezogenen Daten sehr ernst und verarbeiten diese ausschließlich im Rahmen der gesetzlichen Bestimmungen der DSGVO und des österreichischen Datenschutzgesetzes (DSG). Diese Datenschutzerklärung informiert Sie über Art, Umfang und Zweck der Datenverarbeitung.',
  },
  {
    id: 'data-collection',
    title: '3. Welche Daten wir erheben',
    body: `**Bei der Registrierung:**
- Vor- und Nachname
- E-Mail-Adresse
- Passwort (verschlüsselt gespeichert)
- Optional: Marketing-Einwilligung

**Bei der Nutzung der Plattform:**
- IP-Adresse (gehasht für Sicherheitszwecke)
- Browser-Informationen (User-Agent)
- Besuchte Seiten und Klickverhalten
- Session-Daten

**Gesundheitsbezogene Daten (nur mit Einwilligung):**
- Ergebnisse aus der Ersteinschätzung (PHQ-9, GAD-7)
- Risikobewertung und Therapieempfehlungen
- Kommunikation mit Therapeut:innen
- Behandlungsnotizen (nur für Therapeut:innen)

**Zahlungsdaten:**
- Kreditkarteninformationen (werden nur bei Stripe verarbeitet, nicht bei uns gespeichert)
- Rechnungsadresse
- Transaktionshistorie

**Kommunikationsdaten:**
- Kontaktformular-Anfragen
- E-Mail-Korrespondenz
- Telefonnummern (optional)`,
  },
  {
    id: 'legal-basis',
    title: '4. Rechtsgrundlagen',
    body: `Wir verarbeiten Ihre Daten auf Grundlage folgender Rechtsgrundlagen:

**Art. 6 Abs. 1 lit. a DSGVO (Einwilligung):**
- Marketing-Kommunikation
- Optionale Cookies (Analytics, Fehlererfassung)
- Freiwillige Angaben im Kontaktformular

**Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung):**
- Registrierung und Account-Verwaltung
- Vermittlung von Therapieleistungen
- Zahlungsabwicklung
- Bereitstellung der Plattform-Funktionen

**Art. 6 Abs. 1 lit. c DSGVO (Rechtliche Verpflichtung):**
- Aufbewahrung von Buchhaltungsunterlagen
- Meldung von Sicherheitsvorfällen
- Erfüllung steuerrechtlicher Pflichten

**Art. 6 Abs. 1 lit. f DSGVO (Berechtigtes Interesse):**
- Sicherheit und Betrug-Prävention
- Verbesserung unserer Dienste
- Technische Administration

**Art. 9 Abs. 2 lit. a DSGVO (Einwilligung in Gesundheitsdaten):**
- Verarbeitung von PHQ-9 und GAD-7 Fragebögen
- Speicherung von Therapie-relevanten Informationen
- Gesundheitsbezogene Dossiers (verschlüsselt)`,
  },
  {
    id: 'cookies',
    title: '5. Cookies & Tracking',
    body: `**Essenziell notwendige Cookies:**
Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden:

- **next-auth.session-token**: Authentifizierung und Session-Management (30 Tage)
- **findmytherapy_cookie_consent**: Speichert Ihre Cookie-Einstellungen (1 Jahr)

**Analytics (optional, nur mit Einwilligung):**
- **Plausible Analytics**: Datenschutzfreundliche, cookie-lose Analytics zur Verbesserung unserer Website. Plausible speichert keine personenbezogenen Daten und ist DSGVO-konform. Mehr Infos: https://plausible.io/data-policy

**Fehlererfassung (optional, nur mit Einwilligung):**
- **Sentry**: Erfassung technischer Fehler zur Verbesserung der Stabilität. Sentry verarbeitet Fehlerberichte und Performance-Daten. Mehr Infos: https://sentry.io/privacy/

Sie können Ihre Cookie-Einstellungen jederzeit über unsere Cookie-Richtlinie anpassen.`,
  },
  {
    id: 'third-parties',
    title: '6. Datenverarbeiter & Drittanbieter',
    body: `Wir arbeiten mit folgenden Auftragsverarbeitern und Drittanbietern zusammen:

**Stripe (Zahlungsabwicklung):**
- Zweck: Verarbeitung von Zahlungen und Auszahlungen
- Standort: USA/Irland (EU-Niederlassung)
- Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
- Datenschutzerklärung: https://stripe.com/privacy
- Garantien: Standard-Vertragsklauseln (SCCs)

**Amazon Web Services - S3 (Dateispeicher):**
- Zweck: Speicherung von Profilbildern und Dokumenten
- Standort: Frankfurt (eu-central-1)
- Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
- Datenschutzerklärung: https://aws.amazon.com/privacy/

**Resend (E-Mail-Versand):**
- Zweck: Versand von Transaktions-E-Mails (Registrierung, Benachrichtigungen)
- Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
- Datenschutzerklärung: https://resend.com/legal/privacy-policy

**Sentry (nur mit Einwilligung):**
- Zweck: Fehlererfassung und Performance-Monitoring
- Standort: USA
- Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
- Datenschutzerklärung: https://sentry.io/privacy/
- Garantien: Standard-Vertragsklauseln (SCCs)

**Plausible Analytics (nur mit Einwilligung):**
- Zweck: Anonyme Besuchsstatistiken
- Standort: EU (Deutschland)
- Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung)
- Cookie-frei und DSGVO-konform by design
- Datenschutzerklärung: https://plausible.io/data-policy

Alle Auftragsverarbeiter wurden sorgfältig ausgewählt und sind vertraglich zur Einhaltung der DSGVO verpflichtet.`,
  },
  {
    id: 'data-transfers',
    title: '7. Internationale Datentransfers',
    body: `Grundsätzlich speichern wir Ihre Daten innerhalb der Europäischen Union (EU) bzw. des Europäischen Wirtschaftsraums (EWR).

**Transfers in Drittländer:**
Bei folgenden Diensten kann eine Übermittlung in die USA erfolgen:
- Stripe: EU-Niederlassung vorhanden, SCCs abgeschlossen
- Sentry: SCCs und zusätzliche Garantien (nur mit Einwilligung)

Wir stellen sicher, dass angemessene Garantien gemäß Art. 46 DSGVO bestehen:
- Standard-Vertragsklauseln (SCCs) der EU-Kommission
- Angemessenheitsbeschlüsse (z.B. EU-US Data Privacy Framework)
- Zusätzliche technische und organisatorische Maßnahmen

AWS S3 nutzen wir ausschließlich in der Region Frankfurt (eu-central-1).`,
  },
  {
    id: 'retention',
    title: '8. Speicherfristen',
    body: `Wir speichern Ihre Daten nur so lange, wie es für die jeweiligen Zwecke erforderlich ist:

**Account-Daten:**
- Solange Ihr Account aktiv ist
- Bei Löschung: Sofortige Anonymisierung bzw. Löschung nach gesetzlichen Aufbewahrungsfristen

**Gesundheitsdaten (Dossiers):**
- 10 Jahre nach letztem Zugriff (gemäß Dokumentationspflicht für Gesundheitsberufe)
- Bei Widerruf der Einwilligung: Löschung innerhalb 30 Tagen

**Rechnungsdaten:**
- 7 Jahre (gesetzliche Aufbewahrungspflicht gemäß § 132 BAO)

**Marketing-Daten:**
- Bis zum Widerruf der Einwilligung
- Bei Inaktivität: automatische Löschung nach 3 Jahren

**Server-Logs & Sicherheitsprotokolle:**
- 90 Tage (Sicherheitszwecke)

**Cookie-Einwilligung:**
- 1 Jahr, danach erneute Abfrage`,
  },
  {
    id: 'health-data',
    title: '9. Gesundheitsdaten & besondere Kategorien',
    body: `Gesundheitsdaten sind besonders schützenswerte Daten gemäß Art. 9 DSGVO. Wir verarbeiten diese nur mit Ihrer ausdrücklichen Einwilligung:

**Verschlüsselung:**
Alle Gesundheitsdaten (PHQ-9, GAD-7, Dossiers) werden mit AES-256-GCM verschlüsselt gespeichert.

**Zugriffskontrolle:**
- Nur autorisierte Therapeut:innen können auf Ihre Dossiers zugreifen
- Jeder Zugriff wird protokolliert (Access-Logs)
- IP-Adressen werden gehasht gespeichert

**Einwilligung:**
Vor dem Ausfüllen der Ersteinschätzung (Triage) holen wir Ihre explizite Einwilligung ein. Diese können Sie jederzeit widerrufen.

**Widerruf:**
Bei Widerruf werden Ihre Gesundheitsdaten innerhalb von 30 Tagen gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.

**Teilen mit Therapeut:innen:**
Sie kontrollieren, welche Therapeut:innen Zugriff auf Ihre Dossiers erhalten. Dieser Zugriff kann jederzeit entzogen werden.`,
  },
  {
    id: 'security',
    title: '10. Sicherheit der Datenverarbeitung',
    body: `Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten zu schützen:

**Technische Maßnahmen:**
- TLS/SSL-Verschlüsselung (HTTPS) für alle Verbindungen
- AES-256-GCM Verschlüsselung für Gesundheitsdaten
- Bcrypt-Hashing für Passwörter (Faktor 10)
- IP-Hashing für Logs und Analytics
- Regelmäßige Sicherheits-Updates
- Web Application Firewall (WAF)
- DDoS-Schutz

**Organisatorische Maßnahmen:**
- Zugriffskontrolle und Berechtigungskonzepte
- Regelmäßige Mitarbeiter-Schulungen
- Incident-Response-Plan
- Regelmäßige Security-Audits
- Datenschutz-Folgenabschätzung (DSFA)

**2-Faktor-Authentifizierung:**
Für Therapeut:innen-Accounts ist 2FA verfügbar und empfohlen.

**Backup & Disaster Recovery:**
Regelmäßige verschlüsselte Backups mit geografischer Redundanz innerhalb der EU.`,
  },
  {
    id: 'rights',
    title: '11. Ihre Rechte',
    body: `Sie haben folgende Rechte gemäß DSGVO:

**Auskunftsrecht (Art. 15 DSGVO):**
Sie können jederzeit Auskunft über Ihre gespeicherten Daten verlangen.

**Recht auf Berichtigung (Art. 16 DSGVO):**
Sie können die Korrektur unrichtiger Daten verlangen.

**Recht auf Löschung (Art. 17 DSGVO):**
Sie können die Löschung Ihrer Daten verlangen ("Recht auf Vergessenwerden"), sofern keine gesetzlichen Aufbewahrungspflichten entgegenstehen.

**Recht auf Einschränkung (Art. 18 DSGVO):**
Sie können die Einschränkung der Verarbeitung verlangen.

**Recht auf Datenübertragbarkeit (Art. 20 DSGVO):**
Sie können Ihre Daten in einem strukturierten, maschinenlesbaren Format erhalten.

**Widerspruchsrecht (Art. 21 DSGVO):**
Sie können der Verarbeitung Ihrer Daten widersprechen.

**Widerruf der Einwilligung (Art. 7 Abs. 3 DSGVO):**
Sie können erteilte Einwilligungen jederzeit widerrufen (betrifft zukünftige Verarbeitung).

**Wie Sie Ihre Rechte ausüben:**
Senden Sie eine E-Mail an: privacy@findmytherapy.net
Wir werden Ihre Anfrage innerhalb von 30 Tagen bearbeiten.`,
  },
  {
    id: 'supervisory',
    title: '12. Beschwerderecht bei der Aufsichtsbehörde',
    body: `Sie haben das Recht, sich bei der zuständigen Datenschutz-Aufsichtsbehörde zu beschweren:

**Österreichische Datenschutzbehörde:**
Barichgasse 40-42
1030 Wien, Österreich

Telefon: +43 1 52 152-0
E-Mail: dsb@dsb.gv.at
Website: https://www.dsb.gv.at`,
  },
  {
    id: 'changes',
    title: '13. Änderungen dieser Datenschutzerklärung',
    body: `Wir behalten uns vor, diese Datenschutzerklärung zu aktualisieren, um Änderungen in unseren Praktiken oder rechtlichen Anforderungen Rechnung zu tragen.

Bei wesentlichen Änderungen werden wir Sie per E-Mail informieren oder durch einen deutlichen Hinweis auf unserer Website.

**Letzte Aktualisierung:** ${new Date().toLocaleDateString('de-AT', { year: 'numeric', month: 'long', day: 'numeric' })}
**Version:** 2.0`,
  },
  {
    id: 'contact',
    title: '14. Kontakt',
    body: `Bei Fragen zum Datenschutz oder zur Ausübung Ihrer Rechte wenden Sie sich bitte an:

**Datenschutz-Team:**
E-Mail: privacy@findmytherapy.net
Telefon: +43 1 997 1212

**Allgemeiner Kontakt:**
E-Mail: servus@findmytherapy.net

Wir bemühen uns, alle Anfragen innerhalb von 30 Tagen zu beantworten.`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="marketing-theme bg-surface text-default">
      <main className="mx-auto max-w-3xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold text-neutral-950 sm:text-4xl">Datenschutzerklärung</h1>
          <p className="text-sm text-neutral-700">
            Verantwortlich: FindMyTherapy GmbH, Wien, Österreich. Stand: {new Date().getFullYear()}.
          </p>
        </header>

        <nav
          aria-label="Abschnittsnavigation"
          className="rounded-2xl border border-divider bg-surface-1 p-4 text-sm text-neutral-700"
        >
          <ul className="space-y-2">
            {sections.map((section) => (
              <li key={section.id}>
                <a className="text-link hover:underline" href={`#${section.id}`}>
                  {section.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <section className="space-y-8">
          {sections.map((section) => (
            <article
              key={section.id}
              id={section.id}
              className="space-y-2 rounded-2xl border border-divider bg-surface-1 p-6 shadow-soft"
            >
              <h2 className="text-xl font-semibold text-neutral-950">{section.title}</h2>
              <p className="text-sm leading-relaxed text-neutral-800">{section.body}</p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
