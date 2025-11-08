# Session-Zero-Dossier & Double-Sided Data Moat

## 1. Ziel des Features
- **Therapeut:innen** erhalten vor dem Erstgespräch ein „Session-Zero-Dossier“: ein strukturierter Export der Online-Ersteinschätzung mit Risikoindikatoren, Themenprioritäten und organisatorischen Angaben (z. B. Zeitslots, gewünschtes Format).
- **Klient:innen** profitieren von Empfehlungen, die nur mit verifizierten Therapeut:innen geteilt werden; jede Empfehlung baut auf wissenschaftlich validierten PHQ-/GAD-Flows (siehe `docs/WISSENSCHAFTLICHE_VALIDIERUNG.md`) auf.
- **Investor:innen** sehen einen schwer kopierbaren Datenvorteil: Nur wir besitzen sowohl hochwertige Intake-Daten als auch geprüfte Angebotsdaten. Jede Nutzung verstärkt diese Datengrundlage („double-sided data moat“).

## 2. End-to-End-Ablauf
1. **Adaptive Intake (Client)**
   - Nutzer:in startet den Triage-Flow (`/triage`).
   - System entscheidet anhand PHQ-2/GAD-2 Scores, ob ein Vollassessment notwendig ist.
   - Antworten, Metadaten (Zeitstempel, Kanal) und freiwillige Angaben zu Präferenzen werden gespeichert (`packages/db` – `TriageResult`, `ClientPreference`).
2. **Recommendation Snapshot**
   - API (`apps/web/app/api/triage/route.ts`) persistiert ein `RecommendationSnapshot`, das die passenden verifizierten Therapeut:innen + Programme referenziert.
   - Snapshot bildet die Basis für das Session-Zero-Dossier.
3. **Therapeut:innen-Profil**
   - Nur Profile mit Status `VERIFIED` (Admin-Review) werden berücksichtigt (`TherapistProfile.status`).
   - Pflichtfelder: Spezialisierungen, Modalitäten, Preisrange, verfügbare Slots, Notfall-Hinweise, verlinktes Compliance-Paket.
4. **Session-Zero-Dossier Generierung**
   - Worker-Job oder On-Demand Export (geplante API: `POST /api/dossier/:recommendationId/export`).
   - Inhalte:
     - Kurzzusammenfassung (Name oder Alias, Zeitzone, bevorzugte Kontaktart).
     - Validierte Scores (PHQ-2/9, GAD-2/7), Ampel-Einstufungen, Highlight to „Red Flags“ (z. B. Suizidgedanken).
     - Themen-Heatmap (z. B. Burnout 80%, Angst 60%) inkl. Freitext aus Präferenzfeldern.
     - Empfohlene Interventionsformate (Einzel, Telemedizin, Gruppenkurs) basierend auf Seed-Daten.
     - Organisatorische Notizen (Verfügbare Zeitfenster, Sprache, Budget).
   - Export-Formate: PDF (für Download/E-Mail) + JSON (für interne Dashboards).
5. **Zugriffssteuerung**
   - Nur Therapeut:innen, die im Snapshot empfohlen werden, erhalten Zugriff (Signierte URL mit JWT, TTL 72h).
   - Jeder Zugriff wird im `DossierAccessLog` gespeichert (Audit Trail für DSGVO).

## 3. Datenflüsse & Speicherung
| Quelle | Tabelle/Modell | Zweck |
|--------|----------------|-------|
| Triage-Antworten | `TriageResult`, `TriageAnswer` | Rohdaten für Scores und Empfehlungen |
| Präferenzen | `ClientPreference` | Wunschthemen, Budget, Medium |
| Empfehlungen | `RecommendationSnapshot` | Verlinkt Klient:in ↔ Therapeut:innen ↔ Kurse |
| Dossier Export | `SessionZeroDossier` | Versionierte Darstellung (JSON + PDF Pfad) |
| Zugriffslog | `DossierAccessLog` | Datenschutz & Monitoring |

## 4. Double-Sided Data Moat Mechanik
- **Erste Seite (Client Signal):** Validierter Fragebogen + Präferenzdaten → hoher klinischer Informationsgehalt bereits vor Therapiebeginn.
- **Zweite Seite (Therapist Supply):** Kuratierte, verifizierte Profile mit Compliance-Nachweisen → garantiert Qualität und Vertrauen.
- **Flywheel:** Mehr Triages → reichere Datensätze → bessere Match-Qualität → attraktivere Pipeline für Therapeut:innen → mehr hochwertige Profile → noch bessere Empfehlungen.
- **Schutz:** Ohne gleichzeitigen Zugriff auf beide Signalquellen lässt sich die Dossier-Qualität nicht reproduzieren; Scrapen von Profilen oder Fragebogendaten allein genügt nicht.

## 5. MVP-Scope vs. Ausbau
| Phase | Funktionsumfang |
|-------|-----------------|
| **MVP** | Nutzung bestehender Triage-Daten, Generierung eines PDF via React-PDF/Chromium, manuelles Triggern durch Admin, Versand per sicherem Download-Link. |
| **Pilot+** | Automatischer Export bei jeder Empfehlung, Versionierung pro Follow-up, Integration ins Therapeuten-Dashboard (`/dashboard/therapist`). |
| **Scale** | Outcome-Feedback zurück ins System (z. B. GAF-/WHO5-Werte nach X Sitzungen), Machine-Learning-Reranking, Versicherungs-/B2B-APIs. |

## 6. Datenschutz & Sicherheit
- Pseudonymisierung standardmäßig (Alias statt Klarnamen), Klient:innen geben explizit Einwilligung zur Weitergabe an ausgewählte Therapeut:innen.
-,PDF-Links werden serverseitig gerendert, signiert und laufen automatisch ab.
- Zugriff wird protokolliert, Admins sehen, wer ein Dossier geöffnet hat.
- Datenhaltung in EU-Region; Notfallhinweis bleibt prominent: Plattform ersetzt keinen Krisendienst.

## 7. Erfolgsmessung
- **Therapist readiness:** Anteil der empfohlenen Therapeut:innen, die Dossiers öffnen (>80% innerhalb von 24 h).
- **Time-to-first-session:** Differenz zwischen Empfehlung und bestätigtem Ersttermin (Ziel: <5 Tage).
- **Match NPS:** Feedbackscore nach Session 1, um Qualität des Dossiers zu validieren.
- **Data asset size:** Anzahl verknüpfter RecommendationSnapshots mit verifiziertem Supply (Kernmetrik für den Moat).

## 8. Funktionale Anforderungen (AFO)
| ID | Titel | Beschreibung | Acceptance Criteria |
|----|-------|--------------|---------------------|
| F1 | Intake-Datenerfassung | Alle PHQ/GAD-Antworten inkl. Metadaten werden pro Session gespeichert. | 1) Jede abgeschlossene Triage erzeugt einen `TriageResult`-Datensatz inkl. Scores.<br>2) Optionalfelder (Budget, Zeitslots, Modalitäten) werden gespeichert, wenn ausgefüllt.<br>3) Daten sind im Admin-Panel einsehbar. |
| F2 | Snapshot-Erstellung | Nach der Triage wird ein RecommendationSnapshot mit referenzierten Therapeut:innen angelegt. | 1) Snapshot speichert IDs der empfohlenen Profile und Programme.<br>2) Snapshot enthält eine Hash-ID, die als Schlüssel für Dossiers dient.<br>3) Retry bei DB-Fehlern wird geloggt. |
| F3 | Dossier-Generierung | Admin oder Worker erzeugt ein Session-Zero-Dossier (PDF + JSON). | 1) `POST /api/dossiers` erstellt einen Export innerhalb von <5 s.<br>2) JSON enthält Scores, Präferenzen, rote Flags, organisatorische Daten.<br>3) PDF nutzt Branding-Vorlage und ist über signierte URL abrufbar.<br>4) Jeder Export wird als Version gespeichert. |
| F4 | Zugriffssteuerung | Nur berechtigte Therapeut:innen erhalten einen zeitlich begrenzten Link. | 1) Signierte URLs laufen nach 72 h ab.<br>2) Zugriff ist nur möglich, wenn `TherapistProfile.status = VERIFIED` und im Snapshot enthalten.<br>3) Jeder Zugriff erzeugt einen `DossierAccessLog`-Eintrag. |
| F5 | Einwilligung & Opt-out | Klient:in muss Weitergabe an ausgewählte Therapeut:innen bestätigen. | 1) Checkbox im Triage-Finale, Status wird mit Timestamp gespeichert.<br>2) Ohne Einwilligung kein Dossier-Export.<br>3) Opt-out löscht aktive signierte Links innerhalb von 1 h. |
| F6 | Monitoring & Alerts | System überwacht Generierung und Zugriff. | 1) Fehlgeschlagene Exporte triggern `captureError` und Slack/Email (via queue placeholder).<br>2) Zugriffe von unbekannten IPs >5 Versuche/h lösen Warnung aus.<br>3) Admin-Dashboard zeigt Status (Aktiv, Abgelaufen, Neu generieren). |

## 9. Datenmodell (Erweiterungen)
| Tabelle | Feld | Typ | Beschreibung |
|---------|------|-----|--------------|
| `SessionZeroDossier` | `id` | UUID | Primärschlüssel |
|  | `recommendationSnapshotId` | UUID (FK) | Referenz zum Snapshot |
|  | `clientId` | UUID (FK) | Referenz zur Person (optional pseudonymisiert) |
|  | `pdfUrl` | String | Signierte Storage-URL (S3/GCS) |
|  | `jsonPayload` | JSONB | Gespeicherte strukturierte Daten (Scores, Red Flags etc.) |
|  | `riskLevel` | Enum (`LOW`, `MEDIUM`, `HIGH`, `CRITICAL`) | Abgeleitet aus Scores/Red Flags |
|  | `redFlags` | JSONB | Liste kritischer Hinweise (Text + Code) |
|  | `generatedBy` | Enum (`ADMIN`, `WORKER`, `AUTO`) | Triggerquelle |
|  | `version` | Int | Hochgezählt pro Re-Export |
|  | `expiresAt` | Timestamp | Zeitpunkt, zu dem signierte Links ungültig werden |
|  | `createdAt` / `updatedAt` | Timestamp | Standard-Timestamps |
| `DossierAccessLog` | `id` | UUID | Primärschlüssel |
|  | `dossierId` | UUID (FK) | Referenz auf Dossier |
|  | `therapistUserId` | UUID (FK) | Referenz auf `User` |
|  | `accessedAt` | Timestamp | Zeitpunkt des Zugriffs |
|  | `channel` | Enum (`WEB_DASHBOARD`, `SIGNED_LINK`) | Quelle des Zugriffs |
|  | `ipHash` | String | SHA256 Hash der IP (Datenschutz) |
|  | `userAgent` | String | Optional für Debugging |
|  | `status` | Enum (`SUCCESS`, `DENIED`, `EXPIRED`) | Ergebnis |
|  | `reason` | String | Fehlerbeschreibung bei `DENIED` |
| `ClientConsent` *(neu)* | `id`, `clientId`, `scope`, `status`, `grantedAt`, `revokedAt`, `source` | Speichert Einwilligungen zur Datenweitergabe. |

## 10. API-Verträge
1. **POST `/api/dossiers`**
   - **Body:** `{ "recommendationSnapshotId": "uuid", "trigger": "ADMIN" | "WORKER" }`
   - **Auth:** Admin oder Worker-Service-Token.
   - **Antwort:** `{ "dossierId": "uuid", "pdfUrl": "https://...", "expiresAt": "ISO", "version": 1 }`
   - **Fehlerfälle:** `409` wenn bereits aktuelles Dossier existiert, `403` ohne Consent, `404` Snapshot nicht gefunden.
2. **GET `/api/dossiers/:id`**
   - **Auth:** Admin oder verknüpfter Therapeut (NextAuth Role `THERAPIST` + Snapshot-Mitglied).
   - **Antwort:** JSON-Payload mit allen Feldern, Liste aktiver Links.
3. **POST `/api/dossiers/:id/links`**
   - Erstellt neue signierte URL (z. B. nach Ablauf) für berechtigte Therapeut:innen.
4. **Webhook `worker.dossier.generated`**
   - Worker sendet Event nach erfolgreicher PDF-Erstellung → UI aktualisiert Status.

## 11. UI / UX Anforderungen
- **Admin:** In `/admin/recommendations/:id` erscheint ein „Dossier generieren“-Button mit Zustand (In Arbeit, Fertig, Fehler). Download-Link + Access-Log sichtbar.
- **Therapeut:innen-Dashboard:** Neuer Abschnitt „Session-Zero Dossiers“ mit Kartenlayout, Risiko-Ampel und CTA „Dossier öffnen“. Bei abgelaufenem Link Option „Neuen Zugang anfordern“.
- **Client-Bestätigung:** Letzter Schritt im Triage-Flow zeigt Checkbox „Ich erlaube FindMyTherapy, meine Angaben mit ausgewählten Therapeut:innen zu teilen“. Pflichtfeld, Link zu Datenschutz.
- **Error States:** Wenn Export fehlschlägt, Admin sieht Banner mit Fehlertext und Retry-Button; Therapeut:innen sehen Status „Noch nicht freigegeben“.

## 12. Implementierungs-Backlog (technische Tasks)
1. **Schema & Migration** (packages/db): Tabellen `SessionZeroDossier`, `DossierAccessLog`, `ClientConsent`.
2. **Server Actions / APIs** (apps/web/app/api/dossiers/*): Endpoints laut Abschnitt 10 mit Zod-Validierung.
3. **PDF/JSON Generator** (apps/worker): Nutzen `@react-pdf/renderer` oder Headless Chrome; Template mit Corporate Branding.
4. **Storage & Signing**: Abstraktion in `apps/web/lib/storage.ts` mit lokalem Filesystem (DEV) und S3 (prod-ready placeholder).
5. **Therapist Dashboard UI**: Komponenten unter `apps/web/components/dossier/*`.
6. **Admin UI**: Erweiterung von `apps/web/app/admin/recommendations/[id]/page.tsx` (oder neues Modul).
7. **Consent Capture**: Update Triage-Finale Komponente + Prisma Hook.
8. **Access Logging & Monitoring**: Middleware, die jede erfolgreiche/fehlgeschlagene Anfrage protokolliert + Cron, der abgelaufene Links invalidiert.
9. **Tests**: 
   - Unit: Schema Guards, API-Routen.
   - Integration: Generator Output Snapshots.
   - E2E: Cypress/Playwright Flow (Admin generiert, Therapeut lädt herunter).
10. **Docs & Runbooks**: README-Abschnitt aktualisieren, Oncall-Checkliste wie Dossiers bei Incident gelöscht/regeneriert werden.

## 13. Offene Fragen / Annahmen
1. **Storage Provider:** Reicht lokales Filesystem + Git LFS im MVP oder direkt S3/Spaces?
2. **Red Flag Taxonomie:** Wird bestehender Katalog (z. B. aus Clinical Ops) geliefert oder muss Produktteam ihn definieren?
3. **Mehrsprachigkeit:** Dossier aktuell de-AT; benötigt das Team EN/other locales für internationale Therapeut:innen?
4. **Automatisches Teilen mit Programmen:** Sollen Kurse denselben Dossier-Zugriff erhalten oder nur Therapeut:innen?
5. **Audit-Aufbewahrung:** Wie lange dürfen Dossiers gespeichert bleiben (<12 Monate?) – Einfluss auf Storage-Cleanup.
