/**
 * Interne Wissensbasis für den Chatbot.
 * Referenziert echte Seiten/Flows der Plattform und liefert Kontext für RAG.
 */

export interface KnowledgeBaseEntry {
  id: string
  title: string
  url: string
  summary: string
  tags: string[]
  content: string
}

export const KNOWLEDGE_BASE: KnowledgeBaseEntry[] = [
  {
    id: 'triage_flow',
    title: 'Digitale Ersteinschätzung',
    url: '/triage',
    summary:
      'Kostenlose Ersteinschätzung (PHQ-9, GAD-7, WHO-5) mit Ampel-System. Dauert ca. 2 Minuten und liefert direkte Empfehlungen.',
    tags: [
      'ersteinschaetzung',
      'assessment',
      'phq9',
      'gad7',
      'who5',
      'triage',
      'wissenschaftlich',
      'validiert',
      'studien',
    ],
    content:
      'Auf /triage startest du die digitale Ersteinschätzung. Nach wenigen Fragen zeigen wir dir Ampel-Scores, konkrete Empfehlungen (Selbsthilfe, Therapie, Programme) und Links zu passenden Therapeut:innen. Wir setzen auf validierte Instrumente wie PHQ-9, GAD-7 und WHO-5, also dieselben Fragebögen, die Therapeut:innen und Ärzt:innen verwenden. Du kannst den Test jederzeit wiederholen; Ergebnisse landen automatisch im Dashboard unter "Deine Ersteinschätzung".',
  },
  {
    id: 'therapists_directory',
    title: 'Therapeut:innen-Verzeichnis',
    url: '/therapists',
    summary:
      'Gefilterte Profile (Schwerpunkte, Formate, Kosten, Kapazitäten). Direkt aus der Ersteinschätzung heraus befüllbar.',
    tags: ['therapists', 'directory', 'matching', 'profile', 'filter'],
    content:
      'Das Verzeichnis unter /therapists zeigt verifizierte Therapeut:innen mit Spezialisierungen, Therapieformen (online/vor Ort), Kapazitäten und Slots. Nach der Ersteinschätzung siehst du hier priorisierte Vorschläge. Filter wie Schwerpunkte, Preisrahmen oder Modalität helfen bei der Auswahl.',
  },
  {
    id: 'dashboard_client',
    title: 'Klient:innen-Dashboard',
    url: '/dashboard/client',
    summary:
      'Zentrale Übersicht über Programme, Termine, letzte Ersteinschätzung und Empfehlungen des Care-Teams.',
    tags: ['dashboard', 'client', 'programme', 'follow-up'],
    content:
      'Im Dashboard (/dashboard/client) findest du deine Programme, Kursmaterialien und Empfehlungen. Der Bereich "Deine Ersteinschätzung" zeigt letzte Scores, Ampelverlauf und Buttons zum Wiederholen oder zum Kontakt mit Therapeut:innen. Hier landen auch Follow-up-Nachrichten des Care-Teams.',
  },
  {
    id: 'courses_library',
    title: 'Selbsthilfe- & Kursbereich',
    url: '/courses',
    summary:
      'Begleitende Programme zu Stress, Schlaf, Angst. Empfehlungen basieren auf der Ersteinschätzung.',
    tags: ['kurse', 'programme', 'selfhelp'],
    content:
      'Unter /courses findest du strukturierte Programme wie Stress-Reset, Schlafhygiene oder Angst-kompass. Viele Module lassen sich direkt nach der Ersteinschätzung freischalten. Das Dashboard zeigt dir, welche Kurse zu deinen Antworten passen.',
  },
  {
    id: 'contact_careteam',
    title: 'Kontakt zum Care-Team',
    url: '/contact',
    summary:
      'Formular für Beratung, Fragen zur Ersteinschätzung, organisatorische Anliegen oder Terminabstimmung.',
    tags: ['contact', 'care-team', 'support'],
    content:
      'Wenn du persönliche Unterstützung brauchst, nutze /contact. Dort kannst du angeben, ob es um die Ersteinschätzung, Therapieplatz-Suche oder organisatorische Fragen geht. Das Care-Team meldet sich in der Regel innerhalb eines Werktags.',
  },
  {
    id: 'privacy_policy',
    title: 'Datenschutz & Sicherheit',
    url: '/privacy',
    summary:
      'Transparente DSGVO-Richtlinien, lokale Speicherung sensibler Daten und klare Hinweise, wie wir mit Gesundheitsdaten umgehen.',
    tags: ['privacy', 'datenschutz', 'gdpr', 'sicherheit', 'faq'],
    content:
      'Unsere Plattform erfüllt die DSGVO. Chat-Inhalte bleiben im Browser (localStorage), Fragebogendaten werden verschlüsselt gespeichert und nur mit deiner Zustimmung geteilt. Auf /privacy findest du Details zu Auftragsverarbeitung, Speicherfristen und deinem Recht auf Löschung.',
  },
  {
    id: 'crisis_resources',
    title: 'Krisen- und Notfallressourcen',
    url: '/help',
    summary:
      'Soforthilfe-Nummern (142, 144, Psychiatrische Soforthilfe) und Anlaufstellen für Österreich. Immer kostenfrei.',
    tags: ['crisis', 'notfall', 'hilfe', 'safety'],
    content:
      'Auf /help bündeln wir alle Kriseninfos: Telefonseelsorge 142, Notruf 144, psychiatrische Akutstellen und Chat-Angebote. Die Seite erklärt auch, wann du welche Nummer wählen solltest und wie Angehörige unterstützen können.',
  },
  {
    id: 'about_platform',
    title: 'Über FindMyTherapy',
    url: '/about',
    summary:
      'Mission, Partner und Qualitätskriterien. Erklärt, wie Ersteinschätzung, Matching und Begleitung zusammenspielen.',
    tags: ['about', 'mission', 'quality', 'konzept', 'plattform'],
    content:
      'Die Seite /about beschreibt, wie wir Orientierung schaffen: digitale Ersteinschätzung, persönliches Matching, HR-Programme für Teams und begleitende Ressourcen. Dort findest du auch Hinweise zu Datenschutz, medizinischem Advisory Board und Partnerorganisationen.',
  },
  {
    id: 'therapists_onboarding',
    title: 'Info für Therapeut:innen',
    url: '/for-therapists',
    summary:
      'Erklärt, wie Therapeut:innen Teil des Netzwerks werden, welche Matching-Daten sie erhalten und wie Vergütung/Verfügbarkeit gepflegt wird.',
    tags: [
      'therapeut:innen',
      'therapeut',
      'therapeutin',
      'therapist',
      'provider',
      'netzwerk',
      'matching',
      'therapists',
    ],
    content:
      'Unter /for-therapists zeigen wir, wie Therapeutinnen und Therapeuten Teil des Netzwerks werden: validierte Profile, Ampel-Triage vorab, Session-Zero-Dossiers und transparente Vergütung. Dort findest du Infos zu Kapazitätsverwaltung, digitalen Formaten und wie du dich für ein Onboarding meldest.',
  },
  {
    id: 'phq9_explained',
    title: 'Was ist PHQ-9? (Depression-Fragebogen)',
    url: '/triage',
    summary:
      'PHQ-9 ist ein wissenschaftlich validierter Fragebogen mit 9 Fragen, der die Schwere depressiver Symptome misst. Weltweit Standard in Arztpraxen.',
    tags: [
      'phq9',
      'phq-9',
      'depression',
      'fragebogen',
      'wissenschaft',
      'validiert',
      'was ist',
      'patient health questionnaire',
      'scoring',
      'auswertung',
    ],
    content: `**Der PHQ-9 (Patient Health Questionnaire-9)** ist ein standardisiertes Screening-Instrument für Depression, entwickelt von Spitzer, Kroenke und Williams.

**Die 9 Fragen decken ab:**
- Freudlosigkeit und Interessenverlust
- Niedergeschlagenheit, Deprimiertheit
- Schlafprobleme (zu wenig oder zu viel)
- Energielosigkeit, Müdigkeit
- Appetit-Veränderungen (zu wenig oder zu viel Essen)
- Negative Selbstwahrnehmung (Gefühl des Versagens, sich selbst/Familie enttäuscht zu haben)
- Konzentrationsprobleme
- Psychomotorische Veränderungen (verlangsamte Bewegungen oder innere Unruhe)
- Suizidgedanken (direkt erfasst!)

**Scoring & Interpretation:**
- 0-4 Punkte: Keine Depression (minimale Symptome)
- 5-9 Punkte: Leichte Depression
- 10-14 Punkte: Mittelschwere Depression
- 15-19 Punkte: Mittelschwer bis schwere Depression
- 20-27 Punkte: Schwere Depression

**Warum nutzen wir PHQ-9?**
- International anerkannt und in über 100 Studien validiert
- Wird in Hausarztpraxen, Kliniken und Therapieprozessen eingesetzt
- Kurz (2 Minuten), präzise und kostenlos
- Erlaubt Verlaufskontrolle: Du kannst den Test wiederholen und Fortschritte sehen

**Wichtig zu wissen:**
- Der PHQ-9 ist ein Screening-Tool, KEINE Diagnose
- Nur Fachpersonen (Psychotherapeut:innen, Psychiater:innen) können eine klinische Diagnose stellen
- Ein hoher Score bedeutet: "Professionelle Hilfe ist sinnvoll", nicht automatisch "Du hast eine Depression"
- Die letzte Frage zu Suizidgedanken wird besonders beachtet – jeder positive Wert löst Sicherheitsmaßnahmen aus

**Nach dem Test:**
Deine Ergebnisse landen im Dashboard. Du entscheidest, ob du sie mit Therapeut:innen teilst. Das Session-Zero-Dossier enthält die Scores, wenn du eine:n Therapeut:in kontaktierst.`,
  },
  {
    id: 'gad7_explained',
    title: 'Was ist GAD-7? (Angst-Fragebogen)',
    url: '/triage',
    summary:
      'GAD-7 ist ein 7-Fragen-Fragebogen zur Messung von Angstsymptomen, entwickelt für generalisierte Angststörung. Gilt als Gold-Standard.',
    tags: [
      'gad7',
      'gad-7',
      'angst',
      'panik',
      'fragebogen',
      'wissenschaft',
      'validiert',
      'was ist',
      'generalized anxiety disorder',
      'scoring',
      'auswertung',
      'angststörung',
    ],
    content: `**Der GAD-7 (Generalized Anxiety Disorder-7)** ist das Standardinstrument zum Screening von Angststörungen, entwickelt von Spitzer, Kroenke und Kollegen.

**Die 7 Fragen erfassen:**
- Nervosität und Angespanntheit ("nervös, ängstlich oder angespannt gefühlt")
- Unkontrollierbare Sorgen ("nicht in der Lage, Sorgen zu stoppen oder zu kontrollieren")
- Übermäßiges Grübeln über verschiedene Dinge
- Schwierigkeiten zu entspannen
- Unruhe und Getriebensein ("so unruhig, dass es schwerfällt, still zu sitzen")
- Schnelles Verärgert-Sein oder Reizbarkeit
- Angstgefühle ("Angst, dass etwas Schlimmes passieren könnte")

**Scoring & Interpretation:**
- 0-4 Punkte: Keine Angststörung (minimale Symptome)
- 5-9 Punkte: Leichte Angstsymptome
- 10-14 Punkte: Mittelschwere Angstsymptome
- 15-21 Punkte: Schwere Angstsymptome

**Anwendungsbereich:**
GAD-7 wurde ursprünglich für generalisierte Angststörung entwickelt, zeigt aber hohe Sensitivität auch für:
- Panikstörung (plötzliche Angstattacken)
- Soziale Angst (Angst vor sozialen Situationen)
- PTBS-Screening (posttraumatische Belastung)

**Warum nutzen wir GAD-7?**
- Kurz, valide und international anerkannt
- Wird in psychotherapeutischen und medizinischen Settings genutzt
- Hohe Korrelation mit klinischer Diagnose (Sensitivität >80%)
- Erlaubt Tracking: Du siehst Fortschritte über Wochen/Monate

**Besonderheit:**
Der GAD-7 erfasst nicht nur psychische Symptome (Sorgen, Grübeln), sondern auch körperliche Angstreaktionen (Unruhe, Anspannung). Das unterscheidet ihn von reinen Worry-Scales.

**Wichtig zu wissen:**
- Wie PHQ-9 ist GAD-7 ein Screening-Tool, keine Diagnose
- Ein hoher Score bedeutet: Professionelle Abklärung ist sinnvoll
- Angststörungen sind gut behandelbar (Verhaltenstherapie, ggf. Medikation)
- Häufig treten Angst und Depression gemeinsam auf – daher nutzen wir beide Tests

**Nach dem Test:**
Du siehst deine Scores im Dashboard. Wenn du eine:n Therapeut:in kontaktierst, erhält diese Person deine Werte im Session-Zero-Dossier zur Vorbereitung.`,
  },
  {
    id: 'matching_explained',
    title: 'Wie funktioniert das Therapeut:innen-Matching?',
    url: '/therapists',
    summary:
      'Unser Matching kombiniert deine Ersteinschätzungs-Ergebnisse mit Therapeut:innen-Profilen. Du filterst nach Themen, Ort, Budget und Verfügbarkeit.',
    tags: [
      'matching',
      'therapeuten',
      'algorithmus',
      'filter',
      'wie funktioniert',
      'auswahl',
      'vermittlung',
      'therapists',
    ],
    content: `**So funktioniert unser Matching-System:**

**1. Ersteinschätzung als Basis**
Nachdem du PHQ-9, GAD-7 und WHO-5 ausgefüllt hast, kennen wir deine Schwerpunkte:
- Hauptsymptome (Depression, Angst, Stress, Schlaf, etc.)
- Ampel-Status (Grün/Gelb/Rot)
- Dringlichkeit (akute Krise vs. präventive Unterstützung)

**2. Profil-Matching**
Wir zeigen dir Therapeut:innen, die:
- ✅ In deinen Themen spezialisiert sind (z.B. "Angststörungen", "Burnout", "Trauma")
- ✅ Aktuell freie Kapazitäten haben
- ✅ Deine bevorzugten Settings anbieten (online/vor Ort/hybrid)
- ✅ In deinem Budget-Rahmen arbeiten (Kasse oder Selbstzahler)

**3. Du hast die volle Kontrolle**
KEINE automatische Zuweisung! Du siehst:
- Profile mit Foto, Bio und Spezialisierungen
- Therapieformen (Verhaltenstherapie, Systemisch, Tiefenpsychologie, etc.)
- Verfügbarkeit (sofort, 1-2 Wochen, Warteliste)
- Bewertungen von anderen Klient:innen (optional)

Du entscheidest selbst, wen du kontaktierst.

**4. Filter-Optionen im Verzeichnis:**
- **Themen:** Angst, Depression, Burnout, Trauma, Beziehungen, Sucht, Essstörungen, etc.
- **Therapieformen:** Verhaltenstherapie (VT), Systemisch, Psychodynamisch, EMDR, ACT, etc.
- **Standort:** Bundesland, Stadt, Postleitzahl
- **Format:** Online, vor Ort, hybrid
- **Kosten:** Kassenplätze (kostenlos), Selbstzahler (80-150€), Sliding Scale
- **Verfügbarkeit:** Sofort verfügbar, innerhalb 2 Wochen, Warteliste okay
- **Sprachen:** Deutsch, Englisch, Türkisch, BKS, etc.
- **Geschlecht:** Falls wichtig für dich

**5. Care-Team-Unterstützung**
Unsicher bei der Auswahl? Das Care-Team hilft dir:
- Persönliche Beratung per E-Mail oder Videocall
- Klärung offener Fragen zu Therapeut:innen
- Unterstützung bei Terminabstimmung
- Follow-up nach dem Erstgespräch

**Warum kein vollautomatisches Matching?**
Therapie ist eine persönliche Beziehung. Chemie, Sympathie und Vertrauen sind entscheidend – das kann kein Algorithmus vorhersagen. Wir geben dir die besten Vorschläge, DU triffst die Wahl.

**Und wenn es nicht passt?**
Kein Problem! Du kannst jederzeit andere Profile anschauen oder das Care-Team um neue Vorschläge bitten. "Therapeut:innen-Hopping" ist normal – im Schnitt brauchen Menschen 2-3 Erstgespräche, bis sie die richtige Person finden.`,
  },
  {
    id: 'pricing',
    title: 'Kosten der Plattform & Therapie',
    url: '/pricing',
    summary:
      'Die Ersteinschätzung ist kostenlos. Therapeut:innen legen ihre Preise selbst fest (Kassensitz oder Selbstzahler). Kurse haben individuelle Preise.',
    tags: [
      'kosten',
      'preis',
      'preise',
      'kostenlos',
      'kassensitz',
      'selbstzahler',
      'wie teuer',
      'was kostet',
      'wie viel kostet',
      'pricing',
      'bezahlung',
      'krankenkasse',
      'therapiekosten',
      'sitzungskosten',
    ],
    content: `**Kosten-Übersicht für Klient:innen:**

**KOSTENLOS:**
✅ Digitale Ersteinschätzung (PHQ-9, GAD-7, WHO-5)
✅ Plattform-Nutzung (Dashboard, Matching, Verzeichnis)
✅ Care-Team-Support (E-Mail, Beratung)
✅ Basis-Kursinhalte (Schnuppermodule)

**KOSTENPFLICHTIG (je nach Wahl):**

**1. Therapiesitzungen:**
Der Preis hängt vom/von der Therapeut:in ab:

- **Kassenplätze (vollfinanziert):**
  - Kosten für dich: 0€ pro Sitzung
  - Abrechnung direkt mit Krankenkasse
  - Problem: Begrenzte Verfügbarkeit, oft Wartelisten
  - In Österreich: ÖGK-Zuschuss möglich (ca. 28-40€ pro Sitzung)

- **Selbstzahler (Privatpraxis):**
  - Durchschnitt: 80-150€ pro Sitzung (50 Minuten)
  - Vorteil: Sofortige Verfügbarkeit, freie Therapeut:innen-Wahl
  - Manche Therapeut:innen bieten Sliding Scale (sozialverträgliche Preise)
  - Teilweise Rückerstattung durch private Zusatzversicherung möglich

**2. Kurse & Programme:**
- Selbsthilfe-Module: 0-50€ (z.B. Stress-Reset, Schlafhygiene)
- Premium-Kurse: 50-150€ (z.B. 8-Wochen-Angst-Kompass)
- Viele kostenlose Schnuppermodule verfügbar

**Kosten für Therapeut:innen:**

**KOSTENLOS während Beta-Phase:**
✅ Profil-Erstellung
✅ Microsite (findmytherapy.com/t/[dein-name])
✅ Session-Zero-Dossiers (strukturierte Intake-Daten)
✅ Praxisverwaltung & Kalender
✅ Matching-System

**Nach Beta-Phase (geplant):**
- Freemium-Modell: Basis-Profil bleibt kostenlos
- Premium-Features: Erweiterte Analytics, Kurs-Monetarisierung
- Kurs-Verkauf: 70% für Therapeut:in, 30% Plattform-Gebühr
- KEINE Provision auf Therapiesitzungen

**Häufige Fragen:**

**"Kann ich die Kosten von der Steuer absetzen?"**
Ja! Psychotherapie ist als außergewöhnliche Belastung steuerlich absetzbar (§ 34 EStG).

**"Zahlt die Krankenkasse was dazu?"**
In Österreich: ÖGK-Zuschuss von ca. 28€ pro Sitzung möglich, wenn Therapeut:in bei Krankenkasse gelistet ist. Antrag nach Sitzung einreichen.

**"Wie viele Sitzungen brauche ich?"**
Variiert stark: Kurzzeittherapie (10-25 Sitzungen), Langzeittherapie (50+ Sitzungen). Viele merken nach 5-10 Sitzungen erste Verbesserungen.

**"Gibt es Ratenzahlung?"**
Manche Therapeut:innen bieten Ratenzahlung oder Sliding Scale an. Frag einfach nach!`,
  },
  {
    id: 'session_zero',
    title: 'Was ist das Session-Zero-Dossier?',
    url: '/for-therapists',
    summary:
      'Ein strukturiertes Dossier mit validierten Daten (PHQ-9, GAD-7, WHO-5), das Therapeut:innen VOR dem Erstgespräch erhalten.',
    tags: [
      'session zero',
      'dossier',
      'therapeuten',
      'intake',
      'vorbereitung',
      'erstgespräch',
      'anamnese',
      'therapeutinnen',
    ],
    content: `**Das Session-Zero-Dossier** ist unser Alleinstellungsmerkmal für Therapeut:innen. Es spart Zeit, erhöht die Match-Qualität und verbessert die Sicherheit.

**Was enthält es?**

**1. Validierte Test-Scores**
- PHQ-9 (Depression): Aktueller Score + Verlauf
- GAD-7 (Angst): Aktueller Score + Verlauf
- WHO-5 (Wohlbefinden): Baseline-Wert
- Zeitverlauf: Falls mehrere Tests gemacht wurden, sehen Therapeut:innen die Entwicklung

**2. Risikoindikatoren & Red Flags**
- 🔴 Red Flags: Suizidalität (PHQ-9 Item 9), Selbstverletzung, Gewaltgedanken
- 🟡 Gelbe Flags: Schlafstörungen, Substanzmissbrauch, Essstörungen
- 🟢 Grüne Bereiche: Ressourcen, Stärken, soziales Netz

**3. Themenprioritäten**
- Heatmap der Belastungsbereiche (Arbeit, Beziehungen, Familie, etc.)
- User-Wünsche: "Ich möchte vor allem an ... arbeiten"
- Frühere Therapie-Erfahrungen (falls angegeben)

**4. Organisatorisches**
- Präferenz: online/vor Ort/hybrid
- Budget-Rahmen (Kasse/Selbstzahler)
- Zeitliche Verfügbarkeit (z.B. "nur abends")
- Sprache(n)

**Warum ist das wertvoll für Therapeut:innen?**

✅ **Zeit sparen:** Keine 20 Minuten Anamnese im Erstgespräch – die Basics sind klar
✅ **Bessere Vorbereitung:** Du weißt schon vorher, worauf zu achten ist
✅ **Höhere Match-Qualität:** Weniger Therapieabbrüche durch Mismatch oder unklare Erwartungen
✅ **Sicherheit:** Red Flags sofort erkennbar – du kannst dich auf Krisensituationen vorbereiten
✅ **Effizienteres Erstgespräch:** Mehr Zeit für Beziehungsaufbau statt Datenerhebung

**Datenschutz & Einwilligung:**

⚠️ Klient:innen müssen **explizit zustimmen**, bevor du Zugriff auf das Dossier erhältst.

Ablauf:
1. Klient:in kontaktiert dich über Plattform
2. Klient:in wird gefragt: "Dossier mit Therapeut:in teilen?" (Ja/Nein)
3. Erst nach "Ja" erhältst du Zugriff
4. Dossier wird verschlüsselt übertragen (TLS + Ende-zu-Ende)

Klient:innen können Einwilligung jederzeit widerrufen.

**Für Therapeut:innen-Onboarding:**
Wenn du Teil des Netzwerks werden willst, kontaktiere uns über /for-therapists. Das Dossier-Feature ist während der Beta-Phase kostenlos.`,
  },
  {
    id: 'team_vision',
    title: 'Über FindMyTherapy: Team & Vision',
    url: '/about',
    summary:
      'Gegründet von Psychotherapeuten und Tech-Experten, um Versorgungslücken in Österreich zu schließen. Evidenzbasiert, transparent und mit Advisory Board.',
    tags: [
      'team',
      'about',
      'vision',
      'mission',
      'wer seid ihr',
      'gründer',
      'gregor studlar',
      'thomas kaufmann',
      'philipp oppel',
    ],
    content: `**Das Gründungsteam:**

**MMag. Dr. Gregor Studlar, BA** – Psychotherapeut (Verhaltenstherapie), Co-Founder
- Klinische Erfahrung am Neuromed Campus (Kepler Universitätsklinikum)
- Schwerpunkte: Angststörungen, Depression, Burnout
- Forschung zu digitalen Interventionen in der Psychotherapie

**Thomas Kaufmann, BA pth.** – Psychotherapeut i.A.u.S. (Verhaltenstherapie), Co-Founder
- Sigmund Freud Universität Wien
- Hintergrund als Notfallsanitäter (Krisenkompetenz & Akutversorgung)
- Spezialisierung auf Trauma und Krisenintervention

**Dipl. Ing. Philipp Oppel** – Full Stack Developer, Tech Lead
- Technische Leitung & Plattformentwicklung
- Expertise in datenschutzkonformen Health-Tech-Lösungen
- Entwicklung des RAG-basierten Chatbots

**Unsere Vision:**

In Österreich warten Menschen durchschnittlich **6+ Monate** auf einen Therapieplatz. Viele wissen nicht, ob sie überhaupt professionelle Hilfe benötigen. Wartelisten sind intransparent, Krankenkassen-Plätze rar.

**Mit FindMyTherapy lösen wir 4 Probleme:**

1. **Orientierung:** Validierte Ersteinschätzung in unter 5 Minuten – ohne Wartezeit
2. **Matching:** Passende Therapeut:innen finden statt Wartelisten-Hopping
3. **Begleitung:** Kurse und Ressourcen für die Zeit zwischen Terminen oder während Therapie
4. **Transparenz:** Evidenzbasiert, DSGVO-konform, mit medizinischem Advisory Board

**Wissenschaftliche Grundlagen:**

Wir setzen auf:
- Validierte Instrumente (PHQ-9, GAD-7, WHO-5) statt proprietärer Tests
- Leitlinien-konforme Empfehlungen (S3-Leitlinien Depression, Angst)
- Transparente Algorithmen (kein intransparentes "AI Matching")
- Kooperation mit Universitäten (SFU Wien, MedUni Wien geplant)

**Partner & Netzwerk:**

🤝 Sigmund Freud Universität Wien (Forschungskooperation)
🤝 Austrian Startups (Member)
🤝 Krisenhilfe OÖ & Wien (Notfallressourcen)
🤝 World Council for Psychotherapy (WCP-Mitgliedschaft)

**Status:**

🚀 Early Access Beta – wir bauen gemeinsam mit Nutzer:innen und Therapeut:innen.

Feedback erwünscht! Kontakt: /contact oder direkt an team@findmytherapy.com

**Warum kannst du uns vertrauen?**

✅ Gegründet von praktizierenden Psychotherapeuten (nicht nur Tech-Leuten)
✅ DSGVO-konform & transparent (Datenschutz auf /privacy)
✅ Kein Venture Capital – unabhängig und nutzer:innenzentriert
✅ Open Science: Wir teilen unsere Methoden und Validierungsstudien
✅ Advisory Board mit klinischen Expert:innen (in Aufbau)`,
  },
]
