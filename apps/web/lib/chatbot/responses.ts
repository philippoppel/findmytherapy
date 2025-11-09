/**
 * Response-Datenbank für regelbasierten Chatbot
 * Neutral, empathisch, validierend - ohne Diagnosen
 */

import type { KeywordPattern, ResponseTemplate } from './types'

/**
 * Keyword-Patterns zur Erkennung von Themen
 * Höhere Priorität = wird zuerst geprüft
 */
export const KEYWORD_PATTERNS: KeywordPattern[] = [
  // Akute Krise (höchste Priorität)
  {
    keywords: ['suizid', 'selbstmord', 'umbringen', 'beenden', 'nicht mehr leben', 'tod'],
    category: 'crisis',
    priority: 100,
  },
  {
    keywords: ['selbstverletzung', 'ritzen', 'verletzen'],
    category: 'self_harm',
    priority: 95,
  },

  // Depression
  {
    keywords: ['depressiv', 'depression', 'niedergeschlagen', 'hoffnungslos', 'leer', 'antriebslos'],
    category: 'depression',
    priority: 80,
  },
  {
    keywords: ['traurig', 'traurigkeit', 'weinen', 'tränen'],
    category: 'sadness',
    priority: 75,
  },

  // Angst
  {
    keywords: ['angst', 'panik', 'panikattacke', 'ängstlich'],
    category: 'anxiety',
    priority: 80,
  },
  {
    keywords: ['sorgen', 'grübeln', 'nervös', 'unruhe', 'unruhig'],
    category: 'worry',
    priority: 70,
  },

  // Stress & Überlastung
  {
    keywords: ['stress', 'gestresst', 'überlastet', 'überforderung', 'überfordert'],
    category: 'stress',
    priority: 65,
  },
  {
    keywords: ['burnout', 'ausgebrannt', 'erschöpft', 'erschöpfung'],
    category: 'burnout',
    priority: 75,
  },

  // Schlaf
  {
    keywords: ['schlaf', 'schlafen', 'einschlafen', 'durchschlafen', 'müde', 'müdigkeit', 'insomnie'],
    category: 'sleep',
    priority: 60,
  },

  // Beziehungen
  {
    keywords: ['beziehung', 'partner', 'partnerschaft', 'trennung', 'streit'],
    category: 'relationship',
    priority: 55,
  },
  {
    keywords: ['einsamkeit', 'einsam', 'allein', 'isoliert'],
    category: 'loneliness',
    priority: 70,
  },

  // Arbeit
  {
    keywords: ['arbeit', 'job', 'arbeitsplatz', 'chef', 'kollegen'],
    category: 'work',
    priority: 50,
  },

  // Selbstwert
  {
    keywords: ['wertlos', 'versagen', 'versager', 'nutzlos', 'selbstwert'],
    category: 'self_worth',
    priority: 75,
  },

  // Allgemein
  {
    keywords: ['hilfe', 'unterstützung', 'nicht weiter', 'ratlos'],
    category: 'help_seeking',
    priority: 60,
  },
  {
    keywords: ['therapie', 'therapeut', 'psycholog', 'psychiater'],
    category: 'therapy_inquiry',
    priority: 65,
  },
]

/**
 * Empathische Response-Templates
 * Mehrere Varianten pro Kategorie für natürlichere Konversation
 */
export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  // Krise - Sofortige Weiterleitung
  {
    category: 'crisis',
    responses: [
      'Ich höre, dass es dir gerade sehr schlecht geht. Das sind ernste Gedanken, und es ist wichtig, dass du jetzt sofort professionelle Hilfe bekommst.',
    ],
    followUp:
      'Bitte wende dich JETZT an:\n\n🆘 Telefonseelsorge: 142 (24/7, kostenlos)\n🆘 Psychiatrische Soforthilfe: 01/313 30 (24/7)\n🆘 Notruf: 144\n\nDu bist nicht allein, und es gibt Menschen, die dir jetzt helfen können.',
    suggestedAction: 'crisis_resources',
  },
  {
    category: 'self_harm',
    responses: [
      'Danke, dass du mir das anvertraust. Selbstverletzung ist oft ein Zeichen für starken inneren Druck. Das solltest du nicht alleine tragen.',
    ],
    followUp:
      'Ich empfehle dir dringend, mit jemandem zu sprechen:\n\n📞 Telefonseelsorge: 142 (24/7)\n📞 Rat auf Draht: 147 (für junge Menschen)\n\nGleichzeitig kann unser Test helfen, deine Situation besser einzuschätzen.',
    suggestedAction: 'crisis_resources',
  },

  // Depression
  {
    category: 'depression',
    responses: [
      'Ich höre, dass du dich niedergeschlagen und ohne Antrieb fühlst. Das sind belastende Gefühle, und es ist wichtig, dass du sie ernst nimmst.',
      'Es klingt, als würdest du gerade durch eine schwere Zeit gehen. Gefühle von Leere und Hoffnungslosigkeit können sehr erschöpfend sein.',
      'Danke, dass du dich öffnest. Depression äußert sich oft genau so - als Gefühl von Antriebslosigkeit und innerer Leere.',
    ],
    followUp:
      'Um besser zu verstehen, wie ausgeprägt diese Symptome sind, würde ich dir einen kurzen, wissenschaftlich fundierten Test empfehlen. Er dauert nur 2-3 Minuten.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'sadness',
    responses: [
      'Es ist völlig in Ordnung, traurig zu sein. Danke, dass du darüber sprichst.',
      'Traurigkeit ist ein wichtiges Gefühl - es zeigt, dass dich etwas beschäftigt.',
      'Ich höre, dass du gerade viel Traurigkeit spürst. Das kann sehr belastend sein.',
    ],
    followUp:
      'Wenn diese Traurigkeit schon länger anhält oder deinen Alltag beeinträchtigt, könnte ein kurzer Test hilfreich sein, um die Situation besser einzuschätzen.',
    suggestedAction: 'take_assessment',
  },

  // Angst
  {
    category: 'anxiety',
    responses: [
      'Angst kann sich sehr überwältigend anfühlen. Es ist mutig, dass du darüber sprichst.',
      'Panikattacken und starke Angst sind sehr belastend. Ich verstehe, dass das deinen Alltag beeinträchtigt.',
      'Angstgefühle sind erschöpfend, besonders wenn sie häufig auftreten. Du bist nicht allein damit.',
    ],
    followUp:
      'Es gibt erprobte Wege, mit Angst umzugehen. Ein kurzer Test kann helfen zu verstehen, wie ausgeprägt die Symptome sind und welche Unterstützung am besten passt.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'worry',
    responses: [
      'Ständiges Grübeln kann sehr anstrengend sein. Es raubt Energie und lässt einen nicht zur Ruhe kommen.',
      'Ich höre, dass dich Sorgen stark beschäftigen. Das kann den Alltag sehr belasten.',
      'Sorgen und Grübeln sind oft Zeichen dafür, dass innere Themen nach Aufmerksamkeit suchen.',
    ],
    followUp:
      'Ein strukturierter Test könnte helfen zu verstehen, ob diese Gedankenmuster auf eine Angststörung hinweisen oder ob andere Unterstützung sinnvoll wäre.',
    suggestedAction: 'take_assessment',
  },

  // Stress & Burnout
  {
    category: 'stress',
    responses: [
      'Stress und Überforderung sind in unserer Gesellschaft leider sehr verbreitet. Es ist wichtig, dass du auf diese Signale achtest.',
      'Ich höre, dass du dich überlastet fühlst. Das ist ein wichtiges Warnsignal deines Körpers.',
      'Dauerhafter Stress kann zu ernsthaften gesundheitlichen Problemen führen. Gut, dass du dich damit auseinandersetzt.',
    ],
    followUp:
      'Um zu verstehen, wie sehr dich diese Belastung beeinflusst, kann ein Test sinnvoll sein. Er zeigt auch, ob bereits Anzeichen von Depression oder Angst vorliegen.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'burnout',
    responses: [
      'Burnout ist ein Zeichen dafür, dass du zu lange über deine Grenzen gegangen bist. Das solltest du ernst nehmen.',
      'Sich ausgebrannt zu fühlen ist mehr als nur Müdigkeit - es ist emotionale, mentale und körperliche Erschöpfung.',
      'Ich höre, dass du am Ende deiner Kräfte bist. Das ist ein wichtiges Signal, dass etwas sich ändern muss.',
    ],
    followUp:
      'Bei Burnout-Symptomen ist professionelle Unterstützung wichtig. Ein Test kann helfen zu verstehen, wie ausgeprägt die Symptome sind und welche Schritte als nächstes sinnvoll sind.',
    suggestedAction: 'take_assessment',
  },

  // Schlaf
  {
    category: 'sleep',
    responses: [
      'Schlafprobleme können ein Symptom für verschiedene Belastungen sein und verschlechtern oft die allgemeine Situation.',
      'Guter Schlaf ist essentiell für die psychische Gesundheit. Wenn der Schlaf gestört ist, leidet alles andere mit.',
      'Ich höre, dass du Schwierigkeiten mit dem Schlaf hast. Das kann sehr belastend sein und den Tag beeinflussen.',
    ],
    followUp:
      'Schlafstörungen hängen oft mit Stress, Angst oder Depression zusammen. Ein Test könnte helfen, die Ursachen besser zu verstehen.',
    suggestedAction: 'take_assessment',
  },

  // Beziehungen
  {
    category: 'relationship',
    responses: [
      'Beziehungsprobleme können sehr belastend sein. Sie beeinflussen oft auch andere Lebensbereiche.',
      'Ich höre, dass deine Beziehung dich beschäftigt. Konflikte in nahestehenden Beziehungen können sehr schmerzhaft sein.',
      'Beziehungen sind komplex, und Schwierigkeiten sind normal. Wichtig ist, wie du damit umgehst.',
    ],
    followUp:
      'Manchmal hilft es, erst einmal für sich selbst Klarheit zu gewinnen. Ein Test kann zeigen, ob die Beziehungsprobleme bereits deine Stimmung oder Angstlevel beeinflussen.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'loneliness',
    responses: [
      'Einsamkeit ist ein schmerzhaftes Gefühl. Es ist wichtig, dass du dich jemandem anvertraust - wie du es gerade tust.',
      'Sich einsam zu fühlen, auch wenn man von Menschen umgeben ist, ist ein Zeichen dafür, dass echte Verbindung fehlt.',
      'Ich höre deine Einsamkeit. Das ist ein schweres Gefühl, und niemand sollte das alleine tragen.',
    ],
    followUp:
      'Einsamkeit kann zu Depression führen oder ein Symptom davon sein. Ein Test könnte helfen zu verstehen, wie es dir gerade geht.',
    suggestedAction: 'take_assessment',
  },

  // Arbeit
  {
    category: 'work',
    responses: [
      'Probleme am Arbeitsplatz können sich stark auf die psychische Gesundheit auswirken. Du verbringst viel Zeit dort.',
      'Ich höre, dass dich die Arbeitssituation belastet. Das ist ein wichtiger Lebensbereich.',
      'Arbeitsbezogener Stress ist eine der häufigsten Belastungen. Du bist nicht allein damit.',
    ],
    followUp:
      'Wenn die Arbeitsbelastung zu Symptomen wie Schlafstörungen, Anspannung oder Niedergeschlagenheit führt, kann ein Test sinnvoll sein.',
    suggestedAction: 'take_assessment',
  },

  // Selbstwert
  {
    category: 'self_worth',
    responses: [
      'Gefühle von Wertlosigkeit sind sehr schmerzhaft. Diese Gedanken sind oft ein Zeichen für eine depressive Episode.',
      'Ich höre, dass du dich gerade sehr kritisch siehst. Diese harten Urteile über dich selbst können sehr belastend sein.',
      'Wenn man sich wertlos fühlt, ist das oft nicht die Realität, sondern eine verzerrte Wahrnehmung durch Belastung.',
    ],
    followUp:
      'Solche Gedanken solltest du ernst nehmen. Ein Test kann helfen zu verstehen, ob eine Depression vorliegt, die professionelle Unterstützung braucht.',
    suggestedAction: 'take_assessment',
  },

  // Hilfe suchen
  {
    category: 'help_seeking',
    responses: [
      'Der Schritt, Hilfe zu suchen, zeigt Stärke. Viele Menschen warten zu lange damit.',
      'Ich bin froh, dass du dich meldest. Nach Unterstützung zu fragen ist der erste wichtige Schritt.',
      'Es ist mutig, um Hilfe zu bitten. Das zeigt, dass du deine Situation verbessern möchtest.',
    ],
    followUp:
      'Um dir die richtige Unterstützung vermitteln zu können, hilft es, deine aktuelle Situation besser zu verstehen. Dafür gibt es einen kurzen Test.',
    suggestedAction: 'take_assessment',
  },

  // Therapie-Anfrage
  {
    category: 'therapy_inquiry',
    responses: [
      'Sich mit Therapie auseinanderzusetzen ist ein wichtiger Schritt. Es zeigt, dass du bereit bist, an deiner Situation zu arbeiten.',
      'Therapie kann sehr hilfreich sein. Es gibt verschiedene Ansätze, und der richtige hängt von deiner Situation ab.',
      'Ich höre, dass du über Therapie nachdenkst. Das ist eine gute Überlegung.',
    ],
    followUp:
      'Um die passende Therapieform und den richtigen Therapeuten zu finden, hilft zunächst eine Einschätzung deiner aktuellen Symptome. Dafür haben wir einen wissenschaftlich fundierten Test.',
    suggestedAction: 'take_assessment',
  },
]

/**
 * Begrüßung und allgemeine Antworten
 */
export const GENERAL_RESPONSES = {
  greeting: [
    'Hallo! Ich bin hier, um dir zuzuhören. Was beschäftigt dich gerade?',
    'Willkommen. Ich nehme mir Zeit für dich. Was möchtest du mir erzählen?',
    'Hallo! Schön, dass du hier bist. Erzähl mir, was dich bewegt.',
  ],
  unclear: [
    'Ich möchte sicherstellen, dass ich dich richtig verstehe. Magst du mir mehr darüber erzählen?',
    'Danke fürs Teilen. Kannst du mir etwas genauer beschreiben, was dich bewegt?',
    'Ich höre zu. Was genau beschäftigt dich dabei am meisten?',
  ],
  acknowledgment: [
    'Ich höre dich. Das klingt nach einer belastenden Situation.',
    'Danke, dass du dich mir anvertraust.',
    'Ich verstehe. Das ist nicht einfach.',
    'Das klingt herausfordernd. Erzähl gerne mehr, wenn du möchtest.',
  ],
  assessment_intro: [
    'Basierend auf dem, was du mir erzählt hast, würde ich dir eine kurze Ersteinschätzung empfehlen. Sie basiert auf wissenschaftlich validierten Fragebögen (PHQ-9 für Depression, GAD-7 für Angst) und dauert nur 2-3 Minuten.',
    'Um besser zu verstehen, wie ich dir helfen kann, wäre ein standardisierter Test hilfreich. Er gibt uns beiden ein klareres Bild deiner aktuellen Situation.',
    'Ich denke, eine strukturierte Einschätzung könnte jetzt sinnvoll sein. Der Test ist wissenschaftlich fundiert und hilft zu verstehen, welche Unterstützung für dich passt.',
  ],
  thanks: [
    'Gerne! Ich bin hier, um zu unterstützen.',
    'Sehr gerne. Zögere nicht, wenn du noch Fragen hast.',
    'Immer gerne. Pass gut auf dich auf.',
  ],
}
