# Pflichtenheft – FindMyTherapy

**Version:** 1.1
**Stand:** 19. November 2025
**Projektname:** FindMyTherapy – Psychotherapie-Vermittlungsplattform Österreich

---

## 1. Projektübersicht

### 1.1 Was ist FindMyTherapy?

FindMyTherapy ist eine moderne Online-Plattform, die zwei zentrale Probleme löst:

1. **Für Menschen, die Hilfe suchen**: Schnell die passende Psychotherapeutin oder den passenden Psychotherapeuten finden – mit vertrauenswürdigen Informationen von echten Fachleuten
2. **Für Therapeut:innen**: Sichtbar werden für potenzielle Klient:innen mit einer professionellen Online-Präsenz

### 1.2 Warum FindMyTherapy?

- **Vertrauen**: Alle gelisteten Therapeut:innen stammen aus dem offiziellen österreichischen Psychotherapie-Register
- **Qualität**: Blog-Inhalte werden von echten Psychotherapeut:innen verfasst und medizinisch geprüft
- **Einfachheit**: Moderne, übersichtliche Gestaltung in warmen Farben (Braun, Beige, Creme)
- **Barriereabbau**: Verständliche Informationen ohne Fachjargon

### 1.3 Zielgruppen

| Wer? | Was brauchen sie? |
|------|-------------------|
| **Klient:innen** | Passende Therapeut:in finden, sich über psychische Gesundheit informieren |
| **Therapeut:innen** | Neue Klient:innen gewinnen, professionell online präsent sein |
| **Investor:innen** | Verständnis für das Produkt und dessen Skalierbarkeit |

---

## 2. Datenquelle

### Woher kommen die Therapeuten-Daten?

**Offizielles österreichisches Psychotherapie-Register**
*(Bundesministerium für Soziales, Gesundheit, Pflege und Konsumentenschutz – BMSGPK)*

- Quelle: gesundheit.gv.at
- Über **4.000 verifizierte Therapeut:innen** in Österreich
- Enthält: Name, Titel, Adresse, Telefon, Therapiemethoden, Kassenstatus

**Vorteile dieser Datenquelle:**
- Staatlich geprüft und aktuell
- Nur zugelassene Psychotherapeut:innen
- Rechtlich unbedenklich zur Verwendung

---

## 3. Hauptfunktionen – Erste Version (MVP)

### 3.1 Therapeuten-Verzeichnis

**Status: ✅ Implementiert**

Besucher:innen können passende Therapeut:innen finden durch:

**Suchfunktion:**
- Suche nach Name, Ort oder Fachgebiet
- Filter nach:
  - Spezialisierung (z.B. Depression, Angst, Burnout)
  - Standort (Wien, Bundesländer)
  - Online-Therapie verfügbar (Ja/Nein)
  - Kassenvertrag vorhanden (Ja/Nein)

**Kartenansicht:**
- Interaktive Karte mit allen Therapeut:innen
- Therapeut:innen in der Nähe finden
- Direkter Klick auf Kartenmarker zeigt Kurzinfo

**Ergebnisliste:**
- Übersichtliche Karten mit Foto, Name und Schwerpunkten
- "Verifiziert"-Badge zeigt offizielle Zulassung
- Kontaktmöglichkeiten (Telefon, E-Mail, Website)

---

### 3.2 Persönliche Therapeuten-Profile (Microsites)

**Status: ✅ Implementiert**

Jede Therapeutin/jeder Therapeut erhält eine eigene Unterseite mit individueller Web-Adresse (z.B. findmytherapy.at/t/maria-mustermann).

**Inhalte der Microsite:**
- Profilbild und persönliche Vorstellung
- Ausbildung und Qualifikationen
- Therapiemethoden und Schwerpunkte
- Preise und Kasseninformation
- Verfügbarkeit und Kontaktmöglichkeiten
- Praxisfotos (optional)

**Für Therapeut:innen:**
- Einfacher Editor zum Bearbeiten der eigenen Seite
- Vorschau-Funktion vor Veröffentlichung
- Statistiken: Wie viele Besucher:innen? Wie viele Kontaktanfragen?

**Kontaktformular:**
- Besucher:innen können direkt anfragen
- Therapeut:in erhält Benachrichtigung
- Anfragen werden im Dashboard gesammelt

---

### 3.3 Blog mit Fachwissen

**Status: ✅ Implementiert**

Vertrauenswürdige Artikel zu psychischer Gesundheit, verfasst von echten Therapeut:innen.

**Aktuelle Themen (10+ Artikel):**

| Artikel | Thema |
|---------|-------|
| Depression verstehen und bewältigen | Symptome, Ursachen, Behandlung |
| Angststörungen: Formen und Behandlung | Panik, Phobien, generalisierte Angst |
| Burnout erkennen und vorbeugen | Warnsignale, Prävention |
| Wie finde ich den richtigen Therapeuten? | Schritt-für-Schritt-Anleitung |
| Kassenzuschuss für Psychotherapie | Antragstellung in Österreich |
| 5 Atemtechniken bei Angst | Sofort anwendbare Übungen |
| Online vs. Präsenz-Therapie | Vor- und Nachteile |
| Meditation für Anfänger | 3-Minuten-Einstiegsübung |

**Qualitätssicherung:**
- Alle Artikel von MMag. Dr. Gregor Studlar medizinisch geprüft
- Quellenangaben zu wissenschaftlichen Studien
- "Zuletzt geprüft"-Datum bei jedem Artikel
- Autor:innen-Profil mit Qualifikationen

**Blog-Funktionen:**
- Suche nach Themen
- Sortierung nach Datum oder Beliebtheit
- Verwandte Artikel am Ende jedes Beitrags
- Newsletter-Anmeldung

---

### 3.4 Benutzerkonten

**Status: ✅ Implementiert**

**Für Klient:innen:**
- Registrierung mit E-Mail und Passwort
- Persönliches Dashboard
- Gespeicherte Therapeut:innen (Merkliste)

**Für Therapeut:innen:**
- Eigenes Dashboard zur Profilverwaltung
- Microsite-Editor
- Übersicht über Kontaktanfragen
- Statistiken zur eigenen Seite

**Für Administratoren:**
- Freischaltung neuer Therapeut:innen-Profile
- Nutzerverwaltung
- Plattform-Statistiken

**Sicherheit:**
- Verschlüsselte Passwörter
- Optionale Zwei-Faktor-Authentifizierung für Therapeut:innen
- Sichere Datenübertragung (HTTPS)

---

## 4. Geplante Funktionen – Nächste Versionen

### 4.1 Online-Ersteinschätzung

**Status: 🔜 Geplant für Version 2**

Ein kurzer Fragebogen hilft Nutzer:innen einzuschätzen, welche Art von Unterstützung für sie passend sein könnte.

**Geplante Features:**
- 5-10 einfache Fragen
- Sofortige Auswertung
- Empfehlung passender Therapeut:innen basierend auf Antworten
- Hinweise auf Krisenressourcen bei Bedarf

---

### 4.2 KI-Chatbot

**Status: 🔜 Geplant für Version 2**

Ein intelligenter Assistent, der rund um die Uhr erste Fragen beantwortet.

**Geplante Features:**
- Antworten auf häufige Fragen (FAQ)
- Hilfe bei der Therapeutensuche
- Erklärung von Fachbegriffen
- Weiterleitung an echte Beratung bei komplexen Anliegen
- Krisenintervention mit Notfallkontakten

---

### 4.3 Online-Terminbuchung

**Status: 🔜 Geplant für Version 3**

Direkte Terminvereinbarung über die Plattform.

**Geplante Features:**
- Therapeut:innen legen verfügbare Zeiten fest
- Klient:innen buchen selbstständig
- Automatische Erinnerungen per E-Mail/SMS
- Kalender-Integration

---

### 4.4 Bezahlfunktion

**Status: 🔜 Geplant für Version 3**

Sichere Online-Zahlung für Therapiesitzungen.

**Geplante Features:**
- Kartenzahlung und Überweisung
- Automatische Rechnungserstellung
- Auszahlung an Therapeut:innen
- Premium-Listings für bessere Sichtbarkeit

---

### 4.5 Weitere geplante Erweiterungen

| Feature | Beschreibung | Version |
|---------|--------------|---------|
| Video-Sprechstunde | Integrierte Videocalls für Online-Therapie | 3 |
| Mobile App | Native App für iOS und Android | 4 |
| B2B-Portal | Angebot für Unternehmen (betriebliche Gesundheitsvorsorge) | 4 |
| Mehrsprachigkeit | Englische Version der Plattform | 4 |

---

## 5. Design und Benutzerfreundlichkeit

### 5.1 Visuelles Konzept

- **Farbpalette**: Warme, beruhigende Töne (Braun, Beige, Creme, sanftes Grün)
- **Schriften**: Gut lesbar, modern, nicht zu verspielt
- **Bilder**: Authentische Fotos, keine Stock-Bilder
- **Animationen**: Dezent und elegant, unterstützen die Orientierung

### 5.2 Benutzerfreundlichkeit

- **Einfache Navigation**: Maximal 3 Klicks zum Ziel
- **Mobile optimiert**: Perfekte Darstellung auf Smartphone und Tablet
- **Barrierearm**: Gute Kontraste, große Schaltflächen, Tastatursteuerung möglich
- **Schnelle Ladezeiten**: Unter 3 Sekunden

### 5.3 Vertrauensbildung

- Verifiziert-Badges für alle gelisteten Therapeut:innen
- Sichtbare Quellenangaben bei Artikeln
- Klare Datenschutzhinweise
- Impressum und Kontaktmöglichkeit

---

## 6. Suchmaschinenoptimierung (SEO)

### 6.1 Ziele

Die Plattform soll bei Google gut gefunden werden für Suchanfragen wie:
- "Therapeut finden Wien"
- "Psychotherapie Kosten Österreich"
- "Angststörung Behandlung"
- "Depression Symptome"

### 6.2 Erwartete Ergebnisse

| Zeitraum | Monatliche Seitenaufrufe | Besucher:innen |
|----------|--------------------------|----------------|
| Nach 1 Monat | 5.000 | 200 |
| Nach 3 Monaten | 35.000 | 1.500 |
| Nach 6 Monaten | 80.000+ | 4.000+ |

### 6.3 Strategie

- Regelmäßige neue Blog-Artikel (1-2 pro Woche)
- Artikel zu häufig gesuchten Themen
- Verlinkung zwischen verwandten Artikeln
- Technisch optimierte Seiten für schnelle Ladezeit

---

## 7. Datenschutz und Sicherheit

### 7.1 DSGVO-Konformität

- Datenschutzerklärung auf der Website
- Cookie-Banner mit Zustimmungsoption
- Recht auf Auskunft und Löschung
- Datenexport-Möglichkeit für Nutzer:innen

### 7.2 Sicherheitsmaßnahmen

- Verschlüsselte Datenübertragung (HTTPS)
- Sichere Passwortspeicherung
- Optionale Zwei-Faktor-Authentifizierung
- Regelmäßige Sicherheitsupdates

### 7.3 Datenverarbeitung

- Hosting in der EU
- Keine Weitergabe an Dritte ohne Zustimmung
- Anonymisierte Nutzungsstatistiken

---

## 8. Erfolgsmessung

### 8.1 Wichtige Kennzahlen

**Für die Plattform:**
- Anzahl registrierter Nutzer:innen
- Anzahl aktiver Therapeut:innen-Profile
- Monatliche Besucher:innen
- Kontaktanfragen pro Monat

**Für den Blog:**
- Seitenaufrufe pro Artikel
- Verweildauer
- Newsletter-Anmeldungen

**Für Therapeut:innen:**
- Profilaufrufe
- Kontaktanfragen
- Konversionsrate (Besucher zu Anfragen)

### 8.2 Ziele für die erste Version

| Kennzahl | Ziel nach 6 Monaten |
|----------|---------------------|
| Registrierte Klient:innen | 500 |
| Aktive Therapeut:innen-Profile | 100 |
| Monatliche Besucher:innen | 4.000 |
| Kontaktanfragen/Monat | 200 |

---

## 9. Team und Verantwortlichkeiten

| Rolle | Person | Aufgaben |
|-------|--------|----------|
| Gründer & Fachliche Leitung | MMag. Dr. Gregor Studlar BA | Strategie, Medical Review, Qualitätssicherung |
| Entwicklung | Entwicklungsteam | Technische Umsetzung, Wartung |
| Redaktion | Thomas Kaufmann | Blog-Inhalte, Content-Strategie |

---

## 10. Zeitplan

### Phase 1: MVP (Aktuelle Version)
**Status: ✅ Abgeschlossen**
- Therapeuten-Verzeichnis mit Suche und Karte
- Therapeuten-Microsites mit Editor
- Blog mit 10+ Fachartikeln
- Benutzerkonten und Dashboards

### Phase 2: Erweiterung (Q1 2026)
**Status: 🔜 In Planung**
- Online-Ersteinschätzung
- KI-Chatbot
- Erweiterte Statistiken für Therapeut:innen

### Phase 3: Monetarisierung (Q2 2026)
**Status: 📋 Konzeptphase**
- Online-Terminbuchung
- Bezahlfunktion
- Premium-Listings

### Phase 4: Skalierung (Q3-Q4 2026)
**Status: 📋 Konzeptphase**
- Video-Sprechstunde
- Mobile App
- B2B-Angebote

---

## 11. Begriffserklärungen

| Begriff | Erklärung |
|---------|-----------|
| **Microsite** | Persönliche Unterseite für eine:n Therapeut:in |
| **MVP** | Minimum Viable Product – erste lauffähige Version mit Kernfunktionen |
| **Kassenvertrag** | Therapeut:in rechnet direkt mit der Krankenkasse ab |
| **Kassenzuschuss** | Klient:in zahlt selbst und bekommt Teil von Kasse zurück |
| **DSGVO** | Datenschutz-Grundverordnung der EU |
| **SEO** | Suchmaschinenoptimierung – besser bei Google gefunden werden |
| **Conversion** | Wenn ein:e Besucher:in eine gewünschte Aktion ausführt (z.B. Kontakt) |

---

## 12. Änderungshistorie

| Version | Datum | Änderungen |
|---------|-------|------------|
| 1.0 | 19.11.2025 | Erste Version des Pflichtenhefts |
| 1.1 | 19.11.2025 | Überarbeitung für Nicht-Techniker, Fokus auf MVP |

---

**Kontakt bei Fragen:**
Team FindMyTherapy
E-Mail: info@findmytherapy.at
