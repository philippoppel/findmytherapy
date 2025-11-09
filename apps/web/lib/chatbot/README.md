# Mental Health Support Chatbot

Ein regelbasierter, empathischer Chatbot für Erstgespräche in der Mental Health Plattform.

## Features

✅ **100% Datenschutz-konform**
- Alle Daten bleiben im Browser (localStorage)
- Keine externen API-Calls
- Keine Übertragung sensibler Daten

✅ **Empathische Konversation**
- Keyword-basierte Themenerkennung
- Neutrale, validierte Antworten
- Keine Diagnosen oder medizinische Ratschläge

✅ **Intelligente Weiterleitung**
- Erkennt Krisen automatisch
- Bietet standardisierte Tests an
- Verweist auf professionelle Hilfe

✅ **Nahtlose Integration**
- Integriert mit Triage-System (PHQ-9, GAD-7)
- Direkte Links zu Krisenressourcen
- Persistierte Chat-Historie

## Architektur

```
lib/chatbot/
├── types.ts           # TypeScript Definitionen
├── responses.ts       # Response-Datenbank & Keywords
├── engine.ts          # Konversationslogik
└── index.ts           # Public API

components/support/
└── ChatWidget.tsx     # UI-Komponente
```

### Konversations-Flow

```
1. Begrüßung
   ↓
2. Aktives Zuhören (Keyword-Erkennung)
   ↓
3. Empathische Response
   ↓
4. Bei 2+ Concerns → Test-Angebot
   ↓
5. Weiterleitung zu Triage oder Krisenressourcen
```

## Erkannte Themen

Der Chatbot erkennt folgende Kategorien (mit Prioritäten):

### Krise (Priorität: 100)
- Suizidale Gedanken
- Selbstverletzung
- Akute Notfälle

**Aktion:** Sofortige Weiterleitung zu Notfall-Ressourcen

### Mental Health (Priorität: 70-80)
- Depression
- Angst / Panik
- Burnout
- Geringer Selbstwert
- Einsamkeit

**Aktion:** Empathische Response + Test-Angebot nach 2-3 Nachrichten

### Allgemeine Belastung (Priorität: 50-65)
- Stress
- Schlafprobleme
- Beziehungsprobleme
- Arbeitsprobleme

**Aktion:** Empathische Response + Test-Angebot

### Hilfe-Suche (Priorität: 60-65)
- Therapie-Anfragen
- Allgemeine Hilfe

**Aktion:** Informationen + Test-Angebot

## Verwendung

### Basic Usage

Der Chatbot ist bereits im Marketing-Layout integriert:

```tsx
// app/(marketing)/layout.tsx
import { ChatWidget } from '@/components/support/ChatWidget'

export default function Layout({ children }) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  )
}
```

### Programmatische Verwendung

```tsx
import {
  createInitialState,
  processUserMessage,
  type ConversationState
} from '@/lib/chatbot'

// Neue Konversation starten
const state = createInitialState()

// User-Input verarbeiten
const newState = processUserMessage("Ich fühle mich sehr traurig", state)

// Response abrufen
const lastMessage = newState.messages[newState.messages.length - 1]
console.log(lastMessage.content)
```

## Anpassung

### Neue Keywords hinzufügen

```typescript
// lib/chatbot/responses.ts

export const KEYWORD_PATTERNS: KeywordPattern[] = [
  {
    keywords: ['einsam', 'allein', 'isoliert'],
    category: 'loneliness',
    priority: 70,
  },
  // ... mehr Patterns
]
```

### Neue Response-Templates

```typescript
// lib/chatbot/responses.ts

export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  {
    category: 'loneliness',
    responses: [
      'Einsamkeit ist ein schmerzhaftes Gefühl. Danke, dass du dich öffnest.',
      'Sich einsam zu fühlen ist schwer. Du bist nicht allein damit.',
    ],
    followUp: 'Einsamkeit kann zu Depression führen. Ein Test könnte helfen.',
    suggestedAction: 'take_assessment',
  },
]
```

### Begrüßung anpassen

```typescript
// lib/chatbot/responses.ts

export const GENERAL_RESPONSES = {
  greeting: [
    'Hallo! Ich bin hier, um dir zuzuhören. Was beschäftigt dich?',
    'Willkommen. Erzähl mir, was dich bewegt.',
  ],
  // ...
}
```

## Datenschutz

### Gespeicherte Daten

Der Chatbot speichert folgende Daten im **Browser localStorage**:

```typescript
{
  messages: ChatMessage[],        // Gesamte Chat-Historie
  conversationStage: string,      // Konversations-Status
  hasOfferedAssessment: boolean,  // Ob Test angeboten wurde
  detectedConcerns: string[]      // Erkannte Themen
}
```

### Daten löschen

Nutzer können jederzeit:
1. Den Chat zurücksetzen (Reset-Button)
2. localStorage manuell leeren
3. Browser-Daten löschen

## Testing

### Beispiel-Konversationen

#### Depression

```
User: "Ich fühle mich seit Wochen so leer und antriebslos"
Bot: "Ich höre, dass du dich niedergeschlagen und ohne Antrieb fühlst.
     Das sind belastende Gefühle, und es ist wichtig, dass du sie ernst nimmst.

     Um besser zu verstehen, wie ausgeprägt diese Symptome sind, würde ich
     dir einen kurzen, wissenschaftlich fundierten Test empfehlen."

     [Button: Zum Test (2-3 Minuten)]
```

#### Krise

```
User: "Ich will nicht mehr leben"
Bot: "🚨 WICHTIG - Sofortige Hilfe

     Ich höre, dass es dir gerade sehr schlecht geht. Das sind ernste Gedanken,
     und es ist wichtig, dass du jetzt sofort professionelle Hilfe bekommst.

     Bitte wende dich JETZT an:

     🆘 Telefonseelsorge: 142 (24/7, kostenlos)
     🆘 Notruf: 144"

     [Button: Telefonseelsorge: 142]
     [Button: Notruf: 144]
```

## Best Practices

### Was der Chatbot NICHT tut

❌ Stellt keine Diagnosen
❌ Gibt keine medizinischen Ratschläge
❌ Ersetzt keine professionelle Therapie
❌ Speichert Daten auf Servern

### Was der Chatbot TUT

✅ Hört empathisch zu
✅ Validiert Gefühle
✅ Erkennt Krisen
✅ Verweist auf standardisierte Tests
✅ Leitet zu professioneller Hilfe weiter

## Performance

- **Bundle Size:** ~8 KB (gzipped)
- **Runtime:** 100% client-side
- **Keine API-Calls:** Sofortige Antworten
- **Persistenz:** localStorage (automatisch)

## Sicherheit

### Krisenerkennung

Der Chatbot erkennt kritische Keywords und reagiert sofort:

```typescript
const CRISIS_KEYWORDS = [
  'suizid', 'selbstmord', 'umbringen',
  'nicht mehr leben', 'beenden', 'tod'
]
```

Bei Erkennung:
1. Rote Hervorhebung der Message
2. Anzeige von Notfall-Kontakten
3. Direktlinks zu Telefonnummern
4. Button pulsiert rot

### DSGVO-Konformität

- ✅ Keine Datenübertragung
- ✅ Lokale Speicherung
- ✅ Jederzeit löschbar
- ✅ Transparenz (Info-Banner)
- ✅ Keine Cookies notwendig

## Weiterentwicklung

### Mögliche Erweiterungen

1. **Sentiment-Analyse:** Emotionale Tonalität erkennen
2. **Multi-Turn Context:** Besseres Verständnis über mehrere Messages
3. **Personalisierung:** Anpassung an User-Präferenzen
4. **A/B Testing:** Optimierung der Response-Templates
5. **Analytics:** Anonyme Nutzungsstatistiken

### Migration zu AI

Falls später ein AI-Modell gewünscht ist:

```typescript
// Statt regelbasierter Engine:
async function generateAIResponse(userInput: string, context: ConversationState) {
  // Option 1: Self-hosted (Datenschutz)
  const response = await fetch('https://your-ollama-server.com/api/generate', {
    method: 'POST',
    body: JSON.stringify({
      model: 'llama2',
      prompt: buildPrompt(userInput, context),
      system: EMPATHY_SYSTEM_PROMPT
    })
  })

  // Option 2: Privacy-preserving API
  // Mit Differential Privacy, kein Logging, etc.

  return response
}
```

## Support

Bei Fragen oder Problemen:
- **Issues:** GitHub Issues erstellen
- **Dokumentation:** Dieses README
- **Code-Beispiele:** `lib/chatbot/` durchsehen

## Lizenz

Teil der FindMyTherapy Plattform.
