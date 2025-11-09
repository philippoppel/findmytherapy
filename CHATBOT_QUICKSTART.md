# Chatbot Quickstart Guide

## ✅ Was wurde implementiert?

Ein **regelbasierter, empathischer Chatbot** für Mental Health Support mit:

- **100% Datenschutz** - Alle Daten bleiben im Browser (localStorage)
- **Keyword-Erkennung** - Erkennt Themen wie Depression, Angst, Stress, Krisen
- **Empathische Antworten** - Neutral, validierend, ohne Diagnosen
- **Intelligente Weiterleitung** - Zum Triage-Test oder Krisenressourcen
- **Persistente Konversation** - Chat-Historie bleibt erhalten

## 🚀 So startest du den Chatbot

### 1. Development Server starten

```bash
cd /Users/philippoppel/Desktop/mental-health-platform
pnpm dev
```

Server läuft auf: **http://localhost:3000** (oder 3001/3002)

### 2. Chatbot testen

1. Öffne die Homepage: `http://localhost:3000`
2. Unten rechts siehst du den **"Support-Chat"** Button
3. Klicke darauf - der Chat öffnet sich
4. Schreibe eine Nachricht, z.B.:
   - "Ich fühle mich sehr traurig"
   - "Ich habe Panikattacken"
   - "Ich bin gestresst"

### 3. Funktionen testen

#### Test 1: Depression
```
Du: "Ich fühle mich seit Wochen leer und antriebslos"
```
→ Chatbot gibt empathische Response und bietet Test an

#### Test 2: Angst
```
Du: "Ich habe ständig Panikattacken und Angst"
```
→ Chatbot erkennt Angst-Thema und empfiehlt GAD-7 Test

#### Test 3: Krise (WICHTIG)
```
Du: "Ich will nicht mehr leben"
```
→ Chatbot erkennt Krise und zeigt SOFORT Notfall-Kontakte

#### Test 4: Allgemein
```
Du: "Ich bin gestresst von der Arbeit"
```
→ Chatbot hört zu und bietet nach 2-3 Nachrichten Test an

### 4. Button-Funktionen testen

- **"Zum Test (2-3 Minuten)"** → Leitet zu `/triage` weiter
- **"Telefonseelsorge: 142"** → Öffnet Tel-Link (bei Krise)
- **"Chat zurücksetzen"** → Löscht Historie
- **"Chat schließen"** → Schließt Widget (Daten bleiben gespeichert)

## 📁 Dateien & Struktur

```
apps/web/
├── lib/chatbot/
│   ├── types.ts          # TypeScript Definitionen
│   ├── responses.ts      # Keywords & Response-Datenbank
│   ├── engine.ts         # Regel-Engine (Krisen, Tests, Therapie)
│   ├── knowledge-base.ts # Kuratierte Inhalte (Triage, Verzeichnis, etc.)
│   ├── rag.ts            # Retrieval + Mini-Vektorraum
│   ├── index.ts          # Public API
│   └── README.md         # Ausführliche Dokumentation
│
└── components/support/
    └── ChatWidget.tsx    # UI-Komponente

app/api/chatbot/rag/route.ts  # Server-Endpunkt für Hybrid-Antworten
```

## 🎨 Anpassungen

### Keywords hinzufügen

Datei: `apps/web/lib/chatbot/responses.ts`

```typescript
export const KEYWORD_PATTERNS: KeywordPattern[] = [
  {
    keywords: ['neu', 'weitere', 'keywords'],
    category: 'neue_kategorie',
    priority: 75,
  },
  // ...
]
```

### Antworten ändern

Datei: `apps/web/lib/chatbot/responses.ts`

```typescript
export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  {
    category: 'depression',
    responses: [
      'Deine neue empathische Antwort hier...',
      'Noch eine Variante für Abwechslung...',
    ],
    followUp: 'Optionaler Follow-up Text...',
    suggestedAction: 'take_assessment',
  },
]
```

### Begrüßung anpassen

Datei: `apps/web/lib/chatbot/responses.ts`

```typescript
export const GENERAL_RESPONSES = {
  greeting: [
    'Deine neue Begrüßung!',
    'Alternative Begrüßung für Abwechslung!',
  ],
}
```

## 🔒 Datenschutz

### Was wird gespeichert?

Nur im **Browser localStorage** (NICHT auf Server):
- Chat-Historie (Nachrichten)
- Erkannte Themen
- Konversations-Status

### Wie löschen?

1. **Im Chat:** Reset-Button (⟳) oben rechts
2. **Browser:** DevTools → Application → localStorage → Key `findmytherapy-chat-state` löschen
3. **Komplett:** Browser-Daten löschen

## 🧪 Build & Deployment

### Build testen

```bash
cd apps/web
pnpm build
```

### Auf Vercel deployen

```bash
git add .
git commit -m "feat: add empathetic chatbot"
git push
```

Vercel deployed automatisch!

## ⚙️ Knowledge Lookup (ohne LLM)

Die Regel-Engine erkennt eigenständig, wenn User:innen nach konkreten Infos fragen („Wie läuft die Ersteinschätzung?“, „Was steht in eurer Datenschutzseite?“). Dann durchsucht sie `apps/web/lib/chatbot/knowledge-base.ts` lokal und baut eine Antwort inklusive Quellenhinweisen (`/triage`, `/privacy`, `/for-therapists`). Kein zusätzlicher Server oder LLM nötig.

## 📊 Monitoring

### Chat-Nutzung analysieren (optional)

Aktuell: Keine Analytics (Datenschutz).

Wenn gewünscht, **anonyme** Metriken hinzufügen:

```typescript
// Optional: Anonyme Event-Tracking
function trackChatEvent(event: string) {
  // Nur anonyme Kategorien, keine Chat-Inhalte!
  analytics.track('chatbot_event', {
    event_type: event,
    sentiment: 'neutral', // oder 'crisis', 'concerning'
    // NIEMALS: message_content
  })
}
```

## 🆘 Troubleshooting

### Problem: Chatbot zeigt sich nicht

**Lösung:**
1. Prüfe ob `ChatWidget` im Layout eingebunden ist: `app/(marketing)/layout.tsx`
2. Browser-Cache leeren
3. Hard Reload: Cmd+Shift+R (Mac) / Ctrl+Shift+R (Windows)

### Problem: Antworten kommen nicht

**Lösung:**
1. Browser-Konsole öffnen (F12)
2. Nach Errors suchen
3. localStorage prüfen: `localStorage.getItem('findmytherapy-chat-state')`

### Problem: Build-Error

**Lösung:**
```bash
# Cache löschen
rm -rf apps/web/.next
rm -rf node_modules/.cache

# Neu installieren
pnpm install

# Neu builden
pnpm build
```

### Problem: Chatbot reagiert falsch

**Lösung:**
1. Keywords in `lib/chatbot/responses.ts` anpassen
2. Response-Templates überarbeiten
3. Prioritäten der Patterns anpassen

## 📖 Weiterführende Dokumentation

- **Ausführliche Docs:** `apps/web/lib/chatbot/README.md`
- **Code-Beispiele:** Siehe Dateien in `lib/chatbot/`
- **TypeScript Types:** `lib/chatbot/types.ts`

## 💡 Tipps

1. **Teste verschiedene Formulierungen** - Der Chatbot reagiert auf Keywords
2. **Mehrere Nachrichten schreiben** - Test-Angebot kommt nach 2-3 Nachrichten
3. **Krisenwörter testen** - Sicherstellen dass Notfall-Handling funktioniert
4. **Chat zurücksetzen** zwischen Tests für frische Konversationen

## ✅ Checklist für Production

- [ ] Alle Keywords geprüft (Deutsch, Österreichisch)
- [ ] Response-Texte von Mental Health Professional reviewt
- [ ] Krisenintervention getestet
- [ ] Notfall-Telefonnummern korrekt (für Österreich)
- [ ] Datenschutz-Info-Banner vorhanden
- [ ] Mobile Ansicht getestet
- [ ] Accessibility geprüft (Screenreader)
- [ ] Legal Review durchgeführt

## 🎯 Nächste Schritte

1. **Content-Review:** Lass einen Psychologen die Antworten reviewen
2. **User Testing:** 5-10 Testpersonen ausprobieren lassen
3. **Refinement:** Keywords und Antworten basierend auf Feedback anpassen
4. **Analytics:** Überlege anonyme Metriken (optional)
5. **A/B Testing:** Verschiedene Antwort-Stile testen

---

**Viel Erfolg mit dem Chatbot! 🚀**
