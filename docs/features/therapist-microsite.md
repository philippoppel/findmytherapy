# Therapist Microsite (LinkedIn++ Profile)

## 1. Ziel & USP

- Jeder verifizierte FindMyTherapy-Therapeut erhält automatisch eine eigene Microsite (`findmytherapy.com/t/<slug>`), die wie eine gepflegte LinkedIn-Profilseite plus persönliche Website funktioniert.
- Inhalte stammen aus dem bestehenden Dashboard, werden mit Trust-Badges (Verifiziert, Compliance-Pack, Session-Zero-Dossier) angereichert und sind SEO-optimiert (strukturierte Daten, schnelle LCP).
- Therapeut:innen sparen Zeit/Kosten für eine eigene Homepage, während FindMyTherapy Sichtbarkeit, Domain-Authority und Lead-Retention aufbaut.

## 2. Experience Flow

1. **Profilpflege** – Therapeut:in pflegt Angaben im Dashboard (Bio, Spezialisierungen, Medien, Preise, Verfügbarkeiten, Testimonials).
2. **Slug & Vorschau** – System erzeugt automatisch einen URL-Slug und zeigt Live-Vorschau an; manuelle Anpassung mit Validierung möglich.
3. **Veröffentlichung** – Nach Admin-Freigabe erscheint die Microsite öffentlich, erhält eine SEO-Metadaten-Konfiguration und Rich Snippets.
4. **Lead Capture** – Besucher:innen sehen Call-to-Actions („Termin anfragen“, „Session-Zero anfordern“) und Kontaktformular, das direkt ins CRM/Inbox fließt.
5. **Analytics** – Therapeuten-Dashboard zeigt Seitenaufrufe, Lead-Conversion und Quellen an.

## 3. Inhalts-Blöcke

| Block                   | Beschreibung                                                          |
| ----------------------- | --------------------------------------------------------------------- |
| Hero                    | Foto, Name, Titel, Standort, Verified Badge, Kurzclaim                |
| About                   | Langbeschreibung (Markdown-light) mit Emojis optional                 |
| Expertise Tags          | Bis zu 10 Chips (z. B. Burnout, Trauma)                               |
| Modalitäten & Formate   | Präsenz, Online, Hybrid, Gruppensettings                              |
| Preise & Kassenstatus   | Range + Hinweistext (z. B. „Wahltherapeut“)                           |
| Verfügbarkeiten         | Automatisch aus Dashboard (z. B. „Dienstag Abend, Freitag Vormittag“) |
| Medien                  | Einbettungen (Video, Audio) oder kuratierte Blogposts                 |
| Testimonials            | Admin-kuratierte Quotes mit Einwilligung                              |
| Compliance & Sicherheit | Download-Link zu PDF, Notfall-Hinweis                                 |
| Session-Zero CTA        | Erklärung + Button, verknüpft Dossier-Feature                         |
| Kontaktformular         | Name, E-Mail, Anliegen, Checkbox Einwilligung                         |

## 4. SEO & Technik

- SSR via Next.js App Router, Routen `apps/web/app/(public)/t/[slug]/page.tsx`.
- Automatic OpenGraph images (og-image worker) mit Foto + Claim.
- Schema.org `Person`, `MedicalBusiness`, `FAQ` (falls Q&A-Bereich gefüllt).
- Caching mit ISR (5 Minuten) plus On-Demand Revalidation bei Profil-Update.
- Tracking: Pageviews + CTA-Klicks via bestehende Analytics Utility.

## 5. Funktionale Anforderungen (AFO)

| ID  | Titel               | Beschreibung                                                                 | Acceptance Criteria                                                                                                                                                                               |
| --- | ------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| M1  | Slug-Management     | Jede/r Therapeut:in erhält einen eindeutigen Slug mit Editiermöglichkeit.    | 1) Default Slug = `vorname-nachname` (lowercase, diakritika entfernt).<br>2) Konflikte lösen sich durch Suffix `-1`, `-2`.<br>3) Änderung des Slugs triggert automatische Redirects von Alt-URLs. |
| M2  | Content Sync        | Microsite zieht Inhalte aus TherapistDashboard und speichert Versionsstände. | 1) Änderungen im Dashboard invalidieren Cache <60 s.<br>2) Preview-Modus zeigt unveröffentlichte Änderungen.<br>3) Pflichtfelder (Hero, About, Mindestens 3 Tags) müssen vorhanden sein.          |
| M3  | Publishing Workflow | Admin prüft Microsite bevor sie öffentlich geht.                             | 1) Status-Felder `DRAFT`, `PENDING_REVIEW`, `PUBLISHED`.<br>2) Nur `PUBLISHED` ist öffentlich.<br>3) Audit-Log protokolliert Freigaben.                                                           |
| M4  | Lead Capture        | Kontaktformular leitet Anfragen an CRM/Inbox.                                | 1) Validierung (Name, E-Mail, Nachricht, Consent).<br>2) Erfolgreiche Einsendungen erzeugen DB-Eintrag + queueNotification.<br>3) Therapeut:in erhält Dashboard-Benachrichtigung.                 |
| M5  | Trust Layer         | Verifizierungsstatus & Compliance werden prominent angezeigt.                | 1) Badge nur bei `TherapistProfile.status = VERIFIED`.<br>2) Link zu Compliance-PDF ist verpflichtend.<br>3) Session-Zero CTA nur aktiv, wenn Dossier verfügbar.                                  |
| M6  | Analytics           | Therapeut:innen sehen Kennzahlen zur Microsite.                              | 1) Dashboard zeigt Visits (7/30/90 Tage), CTA-Klicks, Leads.<br>2) Daten werden täglich aggregiert.<br>3) Export als CSV verfügbar.                                                               |
| M7  | SEO/Performance     | Seiten erfüllen Core Web Vitals und strukturierte Daten.                     | 1) LCP < 2.5 s bei 4G-Test (Web Vitals budget).<br>2) Lighthouse SEO Score ≥ 95.<br>3) Valid Schema.org Markup laut Rich Results Test.                                                            |

## 6. Datenmodell-Erweiterungen

| Tabelle                      | Feld                                                                      | Zweck                          |
| ---------------------------- | ------------------------------------------------------------------------- | ------------------------------ |
| `TherapistProfile`           | `micrositeSlug`                                                           | Unique Index für Routing       |
|                              | `micrositeStatus` (`DRAFT`, `PENDING`, `PUBLISHED`)                       | Workflow                       |
|                              | `micrositeBlocks` (JSONB)                                                 | Strukturierter Inhalt je Block |
|                              | `micrositeLastPublishedAt`                                                | Timestamp zur Revalidation     |
| `TherapistMicrositeVisit`    | `id`, `therapistProfileId`, `occurredAt`, `source`, `sessionId`           | Tracking                       |
| `TherapistMicrositeLead`     | `id`, `therapistProfileId`, `contactData`, `message`, `consent`, `status` | Leads                          |
| `TherapistMicrositeRedirect` | `fromSlug`, `toSlug`, `createdAt`                                         | Historie für SEO               |

## 7. APIs & Komponenten

- **Routes**
  - `GET /api/microsites/[slug]` – JSON für SSG/ISR (intern).
  - `POST /api/microsites/preview` – Authentifizierte Vorschau.
  - `POST /api/microsites/:slug/leads` – Lead-Einreichung.
- **UI**
  - Neue Server-Komponenten unter `apps/web/app/(public)/t/[slug]/`.
  - Shared UI-Module (`packages/ui`) für Hero, Tag-Chips, CTA Bar.
  - Dashboard-Komponenten `apps/web/app/dashboard/therapist/microsite/*`.
- **Worker**
  - Job `microsite.analytics.aggregate` aggregiert Visits/Leads täglich.
  - Optional: `og-image` Lambda/Edge-Function.

## 8. Rollout-Plan

1. Schema + migrations.
2. Dashboard Editing UI (Preview, Validation).
3. Public Route + ISR.
4. Lead Capture + Notifications.
5. Analytics Aggregation.
6. SEO QA + Sitemap-Eintrag (`/sitemap-microsites.xml`).
7. Pilottherapeut:innen onboarden, Feedback einsammeln.

## 9. Risks & Open Questions

- **Brand Consistency:** Wie stark dürfen Microsites angepasst werden (Farben, Medien)? → Style-Guide definieren.
- **Moderation:** Wer prüft Testimonials/Medien auf Compliance?
- **Internationalisierung:** Brauchen wir mehrsprachige Microsites bei bilingualen Angeboten?
- **Lead Ownership:** Geht jede Microsite-Anfrage stets auch ans zentrale Team oder direkt an Therapeut:innen?
- **Depublizieren:** Prozess, wenn Therapeut:in pausiert oder das Profil entfernt werden muss (Redirect auf Directory?).
