/**
 * Response-Datenbank für regelbasierten Chatbot
 * Neutral, empathisch, validierend - ohne Diagnosen
 * 🇦🇹 DEUTSCHER CHATBOT FÜR ÖSTERREICH
 *
 * OPTIMIERT:
 * - Nur Deutsch (keine bilinguale Unterstützung)
 * - Verstärkte Krisenerkennung mit Negations-Erkennung
 * - Frühe Assessment-Empfehlung
 * - Mehr Response-Varianten gegen Wiederholungen
 * - Redewendungs-Filter gegen false positives
 */

import type { KeywordPattern, ResponseTemplate } from './types'

/**
 * Liste von Redewendungen, die NICHT als Krise interpretiert werden sollen
 */
export const IDIOMS_AND_PHRASES = [
  'zum sterben müde',
  'zum sterben langweilig',
  'könnte ihn umbringen',
  'könnte sie umbringen',
  'könnte dich umbringen',
  'umbringen vor wut',
  'umbringen vor ärger',
  'zum heulen',
  'zum weinen',
  'zu tode gelangweilt',
  'zu tode erschrocken',
  'sterbenslangweilig',
  'sterbensöde',
]

/**
 * Negationswörter, die Krisenkeywords aufheben können
 */
export const NEGATION_WORDS = [
  'nicht',
  'kein',
  'keine',
  'niemals',
  'nie',
  'nichts',
  'niemand',
]

/**
 * Dritte-Person Indikatoren (es geht um jemand anderen)
 */
export const THIRD_PERSON_INDICATORS = [
  'mein freund',
  'meine freundin',
  'mein bruder',
  'meine schwester',
  'meine mutter',
  'mein vater',
  'meine eltern',
  'mein kind',
  'meine kinder',
  'mein partner',
  'meine partnerin',
  'mein kollege',
  'meine kollegin',
  // NOTE: "jemand" removed - causes false positives with "jemanden töten/verletzen"
  // Only keep specific person references that clearly indicate talking about someone else
]

/**
 * Keyword-Patterns zur Erkennung von Themen
 * Höhere Priorität = wird zuerst geprüft
 */
export const KEYWORD_PATTERNS: KeywordPattern[] = [
  // ===== AKUTE KRISE (höchste Priorität) =====
  {
    keywords: [
      // Suizid - direkte Aussagen
      'suizid', 'selbstmord', 'mich umbringen', 'mich töten', 'beenden', 'nicht mehr leben', 'tod',
      'sterben will', 'sterben möchte', 'nicht mehr da sein', 'weg sein',
      'ein ende machen', 'schluss machen mit mir', 'nicht mehr aufwachen',
      'keinen sinn mehr', 'alles vorbei', 'es reicht', 'nicht mehr aushalten',
      'kann nicht mehr weiterleben', 'will nicht mehr existieren', 'will verschwinden',
      'bringe mich um', 'mache schluss', 'ende ich', 'spring ich',
      'nehme ich tabletten', 'gift', 'erhängen', 'springe von',
      // Subtile Suizidalität
      'besser ohne mich', 'ohne mich besser', 'eine last', 'belastung für andere', 'wäre besser tot',
      'familie ohne mich besser', 'familie wäre ohne mich besser', 'alle ohne mich besser', 'denke ans sterben',
      'wie stirbt man', 'wie viele tabletten', 'überdosis', 'tödliche dosis',
      'was passiert nach dem tod', 'will nicht mehr wach werden', 'für immer schlafen',
      'niemand würde mich vermissen', 'alle wären erleichtert', 'besser weg',
      'nicht mehr hier sein', 'einfach verschwinden', 'nicht mehr existieren wollen',
    ],
    category: 'crisis',
    priority: 100,
  },
  {
    keywords: [
      // Selbstverletzung
      'selbstverletzung', 'ritzen', 'verletzen', 'schneiden',
      'svv', 'selbstverletzendes verhalten', 'mir weh tun', 'mir schaden',
      'mich verletzen', 'selbst verletzen', 'klinge', 'rasierklinge',
      'ritze mich', 'schneide mich', 'verletze mich',
    ],
    category: 'self_harm',
    priority: 95,
  },
  {
    keywords: [
      // Gefahr für andere/Gewalt
      'jemanden töten', 'jemanden umbringen', 'jemanden verletzen', 'könnte jemanden verletzen',
      'gewalttätig', 'ausrasten', 'rastet aus',
      'jemandem weh tun', 'kann mich nicht kontrollieren', 'verliere kontrolle', 'verliere die kontrolle',
      'werde gewalttätig', 'schlage zu', 'tue jemandem weh', 'könnte ausrasten',
      'verliere die kontrolle über', 'nicht mehr kontrollieren',
      'könnte verletzen', 'könnte töten',
    ],
    category: 'violence_others',
    priority: 99,  // Höchste Priorität für Fremdgefährdung (vor Suizid)
  },
  {
    keywords: [
      // Essstörungen
      'anorexie', 'magersucht', 'bulimie', 'essstörung', 'essgestört',
      'esse nichts', 'hungere', 'hungern', 'erbreche nach', 'kotzen nach', 'erbreche',
      'fressanfälle', 'fressanfall', 'binge eating', 'zu dick', 'zu fett', 'abnehmen muss',
      'kalorien zählen zwanghaft', 'essen kontrollieren', 'abführmittel', 'laxantien',
      'zwanghaftes essen', 'ess-brech-sucht', 'emetophobie', 'orthorexie',
      'purging', 'erbrechen auslösen', 'magersüchtig', 'bulimisch',
    ],
    category: 'eating_disorder',
    priority: 92,
  },
  {
    keywords: [
      // Substanzmissbrauch & Sucht
      'alkohol', 'alkoholismus', 'trinke jeden tag', 'saufen', 'betrunken',
      'kokain', 'koks', 'drogen', 'drogenkonsum', 'süchtig', 'abhängig', 'abhängigkeit',
      'alkoholsucht', 'drogensucht', 'spielsucht',
      'medikamente missbrauch', 'tabletten abhängig', 'benzos', 'benzodiazepine',
      'kann nicht aufhören zu trinken', 'entzug', 'entzugserscheinungen', 'clean werden',
      'cannabis', 'kiffen', 'gras', 'marihuana', 'heroin', 'speed', 'amphetamine',
      'mdma', 'ecstasy', 'lsd', 'pilze', 'psychedelika',
      'tabletten missbrauch', 'schmerzmittel missbrauchen', 'opiate', 'opioid',
      'glücksspiel', 'wetten', 'sportwetten',
    ],
    category: 'substance_abuse',
    priority: 85,
  },

  // ===== DEPRESSION (sehr hohe Priorität) =====
  {
    keywords: [
      // Formal
      'depressiv', 'depression', 'niedergeschlagen', 'hoffnungslos', 'antriebslos',
      // Gefühle
      'leer', 'ausgelaugt', 'erschöpft', 'kraftlos', 'energielos',
      'sinnlos', 'nichts mehr spüren', 'keine freude', 'keine lust',
      'freudlos', 'interesselos', 'gleichgültig',
      // Umgangssprachlich
      'down', 'am boden', 'fertig', 'am ende', 'kaputt', 'broken',
      'fühle nichts', 'alles grau', 'alles egal', 'scheiss auf alles',
      'keine energie', 'schaff nichts', 'will nur noch schlafen',
      'kann nicht mehr', 'schaffe es nicht', 'will nicht mehr',
      'keine kraft mehr', 'alles zu viel', 'nicht weiter wissen',
      'kein ausweg', 'ausweglos', 'perspektivlos',
    ],
    category: 'depression',
    priority: 85,
  },
  {
    keywords: [
      'traurig', 'traurigkeit', 'weinen', 'tränen', 'heulen',
      'weine ständig', 'muss weinen', 'könnte heulen',
      'trauere', 'betrübt', 'bedrückt', 'geknickt',
      'melancholisch', 'schwermütig', 'betrübt',
    ],
    category: 'sadness',
    priority: 75,
  },

  // ===== ANGST (sehr hohe Priorität) =====
  {
    keywords: [
      // Formal
      'angst', 'panik', 'panikattacke', 'ängstlich', 'angststörung',
      // Körperlich
      'herzrasen', 'atemnot', 'schwitzen', 'zittern', 'schwindel',
      'enge in der brust', 'keine luft', 'erstickungsgefühl',
      // Umgangssprachlich
      'panisch', 'in panik', 'total angst', 'schreckliche angst',
      'ausrasten', 'durchdrehen', 'ausflippt', 'zusammenbruch',
      'bekomme keine luft', 'kriege panik',
    ],
    category: 'anxiety',
    priority: 85,
  },
  {
    keywords: [
      'sorgen', 'grübeln', 'nervös', 'unruhe', 'unruhig', 'angespannt',
      'gedanken kreisen', 'nicht abschalten', 'ständig denken',
      'kopf voll', 'gedankenkarussell', 'kopfkino',
      'besorgt', 'in sorge', 'mach mir sorgen', 'viele sorgen',
      'grüble', 'grübelei', 'gedankenschleifen',
    ],
    category: 'worry',
    priority: 70,
  },

  // ===== STRESS & BURNOUT =====
  {
    keywords: [
      'stress', 'gestresst', 'überlastet', 'überforderung', 'überfordert',
      'zu viel arbeit', 'deadlines', 'druck', 'unter druck', 'zeitdruck',
      'überstunden', 'keine pause', 'durcharbeiten',
      'gehetzt', 'getrieben', 'rastlos', 'keine ruhe',
      'alles gleichzeitig', 'zu viel auf einmal',
      'am anschlag', 'am limit', 'am rotieren',
    ],
    category: 'stress',
    priority: 70,
  },
  {
    keywords: [
      'burnout', 'ausgebrannt', 'erschöpft', 'erschöpfung', 'burn-out',
      'total fertig', 'am ende meiner kräfte', 'keine reserven',
      'ausgepowert', 'ausgelaugt', 'aufgebraucht',
      'chronisch müde', 'ständig müde', 'dauermüde',
      'nichts geht mehr', 'am limit',
    ],
    category: 'burnout',
    priority: 80,
  },

  // ===== SCHLAF =====
  {
    keywords: [
      'schlaf', 'schlafen', 'einschlafen', 'durchschlafen', 'aufwachen',
      'müde', 'müdigkeit', 'insomnie', 'schlafstörung', 'schlaflos',
      'wach liegen', 'liege wach', 'kann nicht einschlafen',
      'wache auf', 'mitten in der nacht', 'früh aufwachen',
      'schlecht geschlafen', 'nicht ausgeschlafen',
      'alpträume', 'albträume', 'schlechte träume',
    ],
    category: 'sleep',
    priority: 65,
  },

  // ===== BEZIEHUNGEN & EINSAMKEIT =====
  {
    keywords: [
      'einsamkeit', 'einsam', 'allein', 'alleine', 'isoliert', 'isolation',
      'niemanden', 'keiner', 'keine freunde', 'ohne freunde',
      'ausgeschlossen', 'außen vor', 'nicht dazugehören',
      'fühle mich allein', 'ganz allein', 'mutterseelenallein',
      'niemand da', 'keiner versteht mich', 'niemand hört zu',
      'ausgeschlossen', 'ignoriert', 'übersehen',
    ],
    category: 'loneliness',
    priority: 75,
  },
  {
    keywords: [
      'beziehung', 'partner', 'partnerin', 'partnerschaft', 'ehe', 'verheiratet',
      'freund', 'freundin', 'freund verlassen', 'freundin verlassen',
      'trennung', 'getrennt', 'scheidung', 'ex', 'verlassen',
      'streit', 'streiten', 'konflikte', 'krach',
      'liebeskummer', 'herzschmerz', 'beziehungsprobleme',
    ],
    category: 'relationship',
    priority: 60,
  },

  // ===== SELBSTWERT =====
  {
    keywords: [
      'wertlos', 'versagen', 'versager', 'versagerin', 'loser',
      'nutzlos', 'unnütz', 'überflüssig', 'nichts wert',
      'nicht gut genug', 'zu dumm', 'zu hässlich',
      'schäme mich', 'schuldig', 'schuld', 'meine schuld',
      'hasse mich', 'mag mich nicht', 'ekle mich',
      'nichts kann', 'alles falsch', 'schaffe nichts',
      'minderwertig', 'unwürdig', 'unzulänglich',
    ],
    category: 'self_worth',
    priority: 80,
  },

  // ===== ARBEIT =====
  {
    keywords: [
      'arbeit', 'job', 'arbeitsplatz', 'beruf', 'karriere',
      'chef', 'vorgesetzter', 'boss', 'kollegen', 'team',
      'mobbing', 'gemobbt', 'schikane', 'diskriminierung',
      'kündigung', 'gekündigt', 'arbeitslos', 'jobsuche',
      'arbeitsklima', 'arbeitsdruck', 'workload',
    ],
    category: 'work',
    priority: 55,
  },

  // ===== HILFE SUCHEN =====
  {
    keywords: [
      'hilfe', 'unterstützung', 'brauche hilfe',
      'nicht weiter', 'weiß nicht weiter', 'weiss nicht weiter', 'ratlos',
      'was tun', 'was soll ich tun', 'wo anfangen', 'weiß nicht wo ich anfangen soll',
      'verzweifelt', 'verzweiflung', 'nicht gut', 'geht nicht gut', 'geht mir nicht gut',
      'schlecht', 'geht mir schlecht', 'fühle mich nicht gut',
    ],
    category: 'help_seeking',
    priority: 70,
  },
  {
    keywords: [
      'ersteinschätzung', 'ersteinschaetzung', 'erste einschätzung', 'erste einschaetzung',
      'einschätzungstest', 'einschaetzungstest', 'einstufungstest', 'einstufung',
      'ampeltest', 'digitale einschätzung', 'assessment', 'assessment test',
      'triage', 'triage flow', 'screening', 'selbsttest',
      'fragebogen', 'fragebogen machen', 'fragebogen starten',
      'test starten', 'test machen', 'ersteinschaetzung starten',
      'phq-9', 'phq9', 'gad-7', 'gad7', 'who-5', 'who5',
    ],
    category: 'assessment_inquiry',
    priority: 78,
  },
  {
    keywords: [
      'therapie', 'therapeut', 'therapeutin', 'psycholog', 'psychologin',
      'psychiater', 'psychotherapie', 'beratung',
      'therapieplatz', 'warteliste', 'termin',
      'psychotherapeut', 'psychotherapeutin',
    ],
    category: 'therapy_inquiry',
    priority: 75,
  },

  // ===== VERABSCHIEDUNG =====
  {
    keywords: [
      'danke', 'dankeschön', 'vielen dank', 'danke dir',
      'tschüss', 'tschau', 'ciao', 'bye', 'auf wiedersehen',
      'bis später', 'bis bald', 'mach\'s gut',
      'schönen tag', 'schönen abend', 'gute nacht',
    ],
    category: 'goodbye',
    priority: 60,
  },
]

/**
 * Response-Templates (Deutsch-Only)
 */
export const RESPONSE_TEMPLATES: ResponseTemplate[] = [
  // ===== KRISE - SOFORTIGE HILFE =====
  {
    category: 'crisis',
    responses: [
      'Es tut mir sehr leid zu hören, dass es dir so schlecht geht. Das sind sehr ernste Gedanken.',
    ],
    followUp: 'Bitte hol dir JETZT professionelle Hilfe:\n\n🆘 Telefonseelsorge: 142 (24/7, kostenlos, anonym)\n🆘 Psychiatrische Soforthilfe: 01/313 30 (24/7)\n🆘 Notruf: 144\n\nDu bist nicht allein. Es gibt Menschen, die dir jetzt helfen können und wollen.',
    suggestedAction: 'crisis_resources',
  },
  {
    category: 'self_harm',
    responses: [
      'Danke, dass du mir das anvertraust. Das klingt nach viel innerem Druck.',
    ],
    followUp: 'Bitte sprich mit jemandem darüber:\n\n📞 Telefonseelsorge: 142 (24/7, anonym)\n📞 Rat auf Draht: 147 (für junge Menschen)\n\nDu musst das nicht alleine durchstehen.',
    suggestedAction: 'crisis_resources',
  },
  {
    category: 'violence_others',
    responses: [
      'Danke, dass du mir das anvertraust. Gedanken daran, jemand anderem Schaden zuzufügen, müssen ernst genommen werden.',
    ],
    followUp: 'Bitte hole dir JETZT professionelle Hilfe:\n\n🆘 Psychiatrische Soforthilfe: 01/313 30 (24/7)\n🆘 Krisenhilfe OÖ: 0732/21 77\n🆘 Krisenhilfe Wien: 01/406 95 95\n🆘 Notruf: 144\n\nDu kannst Kontrolle zurückgewinnen. Es gibt Menschen, die dir jetzt helfen können.',
    suggestedAction: 'crisis_resources',
  },
  {
    category: 'eating_disorder',
    responses: [
      'Danke für dein Vertrauen. Essstörungen sind ernste Erkrankungen, bei denen professionelle Hilfe wichtig ist.',
    ],
    followUp: 'Bitte wende dich an Fachstellen:\n\n📞 Hotline Essstörungen: 0800 20 11 20 (Mo-Do 12-17h)\n📞 Intakt (Therapiezentrum): 01/532 15 77\n📞 Sowhat (Kompetenzzentrum): 01/406 57 17\n🆘 Bei akuter Gefahr: 144\n\nEssstörungen sind behandelbar. Du verdienst Unterstützung.',
    suggestedAction: 'crisis_resources',
  },
  {
    category: 'substance_abuse',
    responses: [
      'Danke, dass du das ansprichst. Substanzmissbrauch ist eine Herausforderung, aber du bist nicht allein damit.',
    ],
    followUp: 'Es gibt spezialisierte Hilfe:\n\n📞 Sucht- und Drogenberatung Wien: 01/201 65\n📞 Suchthotline Österreich: 01/544 46 40\n📞 Anton Proksch Institut: 01/880 10\n🆘 Bei Überdosis/Notfall: 144\n\nProfessionelle Unterstützung kann den Weg erleichtern.',
    suggestedAction: 'crisis_resources',
  },

  // ===== DEPRESSION =====
  {
    category: 'depression',
    responses: [
      'Das klingt wirklich hart. Wie lange geht\'s dir schon so? Es ist mutig, dass du darüber sprichst – viele Menschen mit depressiven Gefühlen haben Schwierigkeiten, ihre Situation in Worte zu fassen. Du bist nicht allein damit.',

      'Puh, das klingt echt belastend. Seit wann fühlst du dich so? Solche Gefühle sind häufiger als man denkt, und es gibt wirksame Wege da raus – professionelle Hilfe kann einen großen Unterschied machen.',

      'Das tut mir leid zu hören. Magst du mir mehr darüber erzählen? Depression kann sich wie ein Tunnel anfühlen, aus dem es keinen Ausweg gibt – aber mit der richtigen Unterstützung können sich die Dinge verändern.',

      'Ich höre dich. Was glaubst du, woher das kommt? Es ist wichtig, dass du diese Gefühle ernst nimmst. Depression ist eine behandelbare Erkrankung, keine Charakterschwäche.',

      'Das ist nicht leicht. Hast du jemanden, mit dem du darüber reden kannst? Wenn nicht, kann eine professionelle Einschätzung ein guter erster Schritt sein. Niemand muss das alleine durchstehen.',

      'Solche Gefühle sind sehr belastend. Bist du gerade alleine damit? Viele Menschen erleben depressive Phasen – du musst das nicht alleine tragen. Es gibt Unterstützung.',

      'Danke, dass du dich öffnest. Wie sieht so ein typischer Tag für dich aus? Depression raubt oft Energie und Freude – das ist ein typisches Symptom, kein persönliches Versagen.',

      'Das muss schwer sein. Was hilft dir in solchen Momenten, wenn überhaupt was hilft? Selbst kleine Strategien können wichtig sein, aber wenn nichts mehr hilft, ist das ein Zeichen, professionelle Hilfe zu suchen.',
    ],
    followUp: 'Lass uns gemeinsam schauen, wie wir dir helfen können. Eine kurze Ersteinschätzung (PHQ-9) kann zeigen, wie ausgeprägt die Symptome sind und welche Unterstützung am besten passt.\n\n💡 Falls es akut schlimmer wird: Telefonseelsorge 142 (24/7, anonym)',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'sadness',
    responses: [
      'Das tut mir leid. Magst du erzählen, was los ist?',
      'Traurig sein ist okay. Was beschäftigt dich gerade?',
      'Ich bin für dich da. Was ist passiert?',
      'Das klingt schmerzhaft. Möchtest du darüber sprechen?',
      'Ich höre dir zu. Erzähl ruhig.',
      'Es ist in Ordnung zu weinen. Was macht dich gerade so traurig?',
    ],
    followUp: 'Wenn die Traurigkeit länger anhält, kann eine Einschätzung helfen zu verstehen, was dahinter steckt.',
    suggestedAction: 'take_assessment',
  },

  // ===== ANGST =====
  {
    category: 'anxiety',
    responses: [
      'Angst kann total überwältigend sein. In welchen Situationen passiert das? Wichtig zu wissen: Auch wenn es sich so anfühlt – Panikattacken sind nicht gefährlich. Sie gehen vorbei, auch wenn es sich in dem Moment nicht so anfühlt.',

      'Das klingt echt unangenehm. Wie oft hast du solche Attacken? Panikattacken sind die Reaktion deines Körpers auf Stress – eine Art Fehlalarm. Sie lassen sich gut behandeln mit Therapie und Techniken.',

      'Danke, dass du dich öffnest. Was genau löst die Angst aus? Viele Menschen mit Angststörungen haben jahrelang darunter gelitten, bevor sie Hilfe geholt haben – dabei gibt es sehr wirksame Behandlungen.',

      'Panikattacken sind furchtbar. Bist du in Behandlung? Gut zu wissen: Der Körper kann diesen Zustand nicht lange aufrechterhalten – nach 10-20 Minuten klingt eine Attacke normalerweise ab.',

      'Das muss beängstigend sein. Kannst du noch atmen wenn das passiert? Bei Panikattacken hilft es oft, sich auf langsames Ausatmen zu konzentrieren – das beruhigt das Nervensystem.',

      'Solche körperlichen Symptome sind echt beunruhigend. Seit wann hast du das? Wichtig: Herzrasen, Schwindel und Atemnot bei Panik sind NICHT gefährlich, auch wenn sie sich so anfühlen.',

      'Ich verstehe, dass das Angst macht. Was denkst du in solchen Momenten? Angstgedanken wie "Ich sterbe" oder "Ich verliere die Kontrolle" sind typisch bei Panikattacken – aber nur Gedanken, keine Realität.',

      'Das klingt nach einer großen Belastung. Wie gehst du aktuell damit um? Angststörungen gehören zu den am besten behandelbaren psychischen Erkrankungen – es gibt Hoffnung.',
    ],
    followUp: 'Eine Einschätzung mit dem GAD-7-Fragebogen kann helfen rauszufinden, wie stark die Angst ist und welche Hilfe sinnvoll wäre.\n\n💡 Akut-Tipp bei Panik: 4-7-8-Atmung (4 Sekunden einatmen, 7 Sekunden halten, 8 Sekunden ausatmen)',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'worry',
    responses: [
      'Gedankenkarussell? Kenn ich. Worum kreisen deine Gedanken?',
      'Grübeln raubt echt Energie. Seit wann geht das so?',
      'Nicht abschalten können ist anstrengend. Was genau beschäftigt dich?',
      'Ständig nachdenken kann echt zermürben. Was hilft dir, zur Ruhe zu kommen?',
      'Das klingt nach viel innerer Unruhe. Kannst du nachts schlafen?',
      'Wenn der Kopf nicht zur Ruhe kommt, ist das belastend. Was sind deine größten Sorgen?',
    ],
    followUp: 'Ein kurzer Test könnte zeigen, ob dahinter eine Angststörung steckt oder was sonst helfen würde.',
    suggestedAction: 'take_assessment',
  },

  // ===== STRESS & BURNOUT =====
  {
    category: 'stress',
    responses: [
      'Klingt nach viel auf einmal. Was stresst dich am meisten?',
      'Völlig überlastet? Das kenn ich. Wo kommt der Druck her?',
      'Das ist eine Menge. Wie lange geht das schon so?',
      'Unter Druck zu stehen ist anstrengend. Kannst du irgendwo eine Pause machen?',
      'Zu viel auf einmal ist echt belastend. Was würde dir jetzt helfen?',
      'Das klingt nach einer sehr stressigen Phase. Hast du Unterstützung?',
    ],
    followUp: 'Dauerstress kann zu Depression oder Angst führen. Lass uns mit einem Test schauen, wie\'s dir wirklich geht.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'burnout',
    responses: [
      'Am Ende deiner Kräfte? Das solltest du ernst nehmen.',
      'Ausgebrannt zu sein ist mehr als nur müde. Wie lang geht das schon?',
      'Das klingt nach echtem Burnout. Bist du noch im Job oder schon krankgeschrieben?',
      'Keine Reserven mehr zu haben ist ein Warnsignal. Was sagen deine Ärzte?',
      'Total erschöpft sein ist nicht normal. Wann hattest du zuletzt richtige Erholung?',
      'Das solltest du nicht ignorieren. Hast du schon mit jemandem darüber gesprochen?',
    ],
    followUp: 'Bei Burnout ist\'s wichtig, professionelle Hilfe zu holen. Ein Test kann zeigen, wie ausgeprägt die Symptome sind.',
    suggestedAction: 'take_assessment',
  },

  // ===== SCHLAF =====
  {
    category: 'sleep',
    responses: [
      'Schlafprobleme sind echt zermürbend. Wenn du magst, erzähl mir mehr: Ist es das Einschlafen oder Durchschlafen, was schwierig ist? Oder beides?',

      'Schlechter Schlaf macht alles schlimmer, das stimmt. Seit wann schläfst du schlecht? Chronische Schlafstörungen hängen oft mit Stress, Angst oder Depression zusammen – ein Test könnte helfen, die Ursache zu finden.',

      'Nicht schlafen können ist furchtbar. Wie viele Stunden schläfst du pro Nacht? Wenn es dauerhaft unter 6 Stunden sind, leidet der ganze Körper – das solltest du ernst nehmen.',

      'Ich verstehe, dass das belastend ist. Was hält dich wach – sind es Grübeleien, Sorgen oder einfach Unruhe? Wenn Gedankenkarusselle dich wachhalten, kann das auf eine Angststörung hinweisen.',

      'Das klingt anstrengend. Hast du schon Strategien probiert, die helfen? Manchmal hilft Schlafhygiene (feste Zeiten, kein Handy), aber wenn psychische Belastung dahintersteckt, braucht es mehr.',

      'Alpträume können echt belastend sein. Erinnerst du dich an die Träume? Wiederkehrende Alpträume können ein Zeichen für unverarbeitete Erlebnisse oder Trauma sein.',
    ],
    followUp: 'Schlafstörungen sind oft ein Symptom – der PHQ-9 und GAD-7 Test kann zeigen, ob Depression oder Angst eine Rolle spielt.\n\n💡 Sofort-Hilfe: Feste Aufsteh-Zeit (auch am Wochenende) stabilisiert den Rhythmus besser als feste Schlafens-Zeit.',
    suggestedAction: 'take_assessment',
  },

  // ===== EINSAMKEIT & BEZIEHUNGEN =====
  {
    category: 'loneliness',
    responses: [
      'Einsamkeit ist echt schmerzhaft. Bist du viel alleine?',
      'Niemand sollte sich so alleine fühlen. Seit wann geht\'s dir so?',
      'Das tut weh. Hast du Kontakt zu Familie oder Freunden?',
      'Sich ausgeschlossen zu fühlen ist schwer. Was ist passiert?',
      'Keine sozialen Kontakte zu haben belastet. Wohnst du alleine?',
      'Das verstehe ich. Gibt es Orte, wo du Menschen treffen könntest?',
    ],
    followUp: 'Einsamkeit kann zu Depression führen. Lass uns mit einem Test schauen, wie es dir geht.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'relationship',
    responses: [
      'Beziehungsprobleme können echt weh tun. Was ist passiert?',
      'Konflikte in Beziehungen sind schwer. Wie lange geht das schon?',
      'Eine Trennung ist schmerzhaft. Wie lange ist das her?',
      'Liebeskummer tut richtig weh. Magst du erzählen, was los ist?',
      'Streit in der Beziehung belastet. Könnt ihr noch miteinander reden?',
      'Das klingt nach einer schwierigen Situation. Was würdest du dir wünschen?',
    ],
    followUp: 'Manchmal hilft\'s, erst mal für sich selbst Klarheit zu gewinnen. Ein Test kann zeigen, wie sehr dich das belastet.',
    suggestedAction: 'take_assessment',
  },

  // ===== SELBSTWERT =====
  {
    category: 'self_worth',
    responses: [
      'Solche Gedanken über dich selbst sind sehr schmerzhaft. Woher kommen die?',
      'Diese harten Urteile über dich können auf eine Depression hinweisen. Wie lange fühlst du dich schon so?',
      'Das sind sehr negative Gedanken über dich. Was ist passiert, dass du so über dich denkst?',
      'Sich selbst zu hassen ist furchtbar. Warst du schon immer so kritisch mit dir?',
      'Diese Selbstvorwürfe sind sehr belastend. Gibt es jemanden, der dich unterstützt?',
      'Sich wertlos zu fühlen tut weh. Was würdest du einem Freund sagen, der so denkt?',
    ],
    followUp: 'Solche Gedanken solltest du ernst nehmen. Ein Test kann zeigen, ob eine Depression dahintersteckt.',
    suggestedAction: 'take_assessment',
  },

  // ===== ARBEIT =====
  {
    category: 'work',
    responses: [
      'Probleme auf der Arbeit können echt belasten. Was läuft da schief?',
      'Arbeit sollte nicht so stressen. Was genau ist das Problem?',
      'Mobbing am Arbeitsplatz ist nicht okay. Wie lange geht das schon?',
      'Gekündigt zu werden ist hart. Wie geht\'s dir damit?',
      'Arbeitslos zu sein belastet. Wie lange suchst du schon?',
      'Ein toxischer Arbeitsplatz macht krank. Hast du Unterstützung?',
    ],
    followUp: 'Wenn Arbeit zu Schlafstörungen oder schlechter Stimmung führt, ist das ein Warnsignal. Ein Test kann helfen.',
    suggestedAction: 'take_assessment',
  },

  // ===== HILFE SUCHEN =====
  {
    category: 'help_seeking',
    responses: [
      'Gut, dass du nach Hilfe suchst. Das ist der erste wichtige Schritt.',
      'Es ist mutig, um Hilfe zu bitten. Was genau brauchst du?',
      'Ich bin froh, dass du hier bist. Erzähl mir, was los ist.',
      'Nach Hilfe zu fragen zeigt Stärke. Wie kann ich dir helfen?',
      'Du bist hier richtig. Was beschäftigt dich?',
      'Sich Hilfe zu holen ist wichtig. Erzähl mir mehr.',
    ],
    followUp: 'Eine Ersteinschätzung kann helfen rauszufinden, welche Art von Unterstützung für dich passt.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'assessment_inquiry',
    responses: [
      'Den digitalen Einstufungstest findest du überall als Button "Ersteinschätzung". Öffne einfach /triage und klick auf "Kostenlose Ersteinschätzung starten" - dauert etwa 2 Minuten.',
      'Wenn du direkt loslegen willst: tippe im Dashboard auf "Ersteinschätzung starten". Der Test kombiniert PHQ-9 & GAD-7 und zeigt dir sofort eine Ampel-Auswertung.',
      'Du kannst die Ersteinschätzung jederzeit wiederholen. Im Hauptmenü -> "Ersteinschätzung" oder im Dashboard im Kasten "Deine Ersteinschätzung" kommst du direkt zum Fragebogen.',
    ],
    followUp: 'Nach dem Test siehst du Empfehlungen im Dashboard und Buttons zu passenden Therapeut:innen (/therapists) oder Programmen.',
    suggestedAction: 'take_assessment',
  },
  {
    category: 'therapy_inquiry',
    responses: [
      'Therapie kann echt helfen. Im Menü findest du den Bereich "Therapeut:innen" oder direkt /therapists - hast du dort schon reingeschaut?',
      'Es gibt verschiedene Therapieformen. Wenn du die Ersteinschätzung (/triage) startest, spielen wir dir passende Therapeut:innen aus dem Verzeichnis aus.',
      'Einen Therapieplatz zu suchen ist ein guter Schritt. Oben rechts findest du "Ersteinschätzung" und danach das Verzeichnis "Therapeut:innen" mit Filtern.',
      'Wartelisten sind frustrierend. Über /therapists kannst du nach freien Terminen filtern oder nach der Ersteinschätzung direkt Vorschläge erhalten.',
      'Eine gute Therapeutin zu finden ist wichtig. Im Bereich "Therapeut:innen" siehst du Schwerpunkte, Setting (online/vor Ort) und Kapazitäten - wonach möchtest du filtern?',
      'Therapie ist eine Investition in dich selbst. Lass uns deine Ziele sammeln und dann kannst du sie mit den Profilen auf der Seite "Therapeut:innen" abgleichen.',
    ],
    followUp: 'Klick einfach auf "Ersteinschätzung" oder direkt /triage, dann führen wir dich zum Therapeut:innen-Verzeichnis mit konkreten Vorschlägen.',
    suggestedAction: 'take_assessment',
  },

  // ===== VERABSCHIEDUNG =====
  {
    category: 'goodbye',
    responses: [
      'Gerne! Ich bin hier, wenn du mich wieder brauchst.',
      'Kein Problem. Pass auf dich auf! 💙',
      'Alles Gute für dich! Ich bin da, wenn du reden möchtest.',
      'Bis bald! Denk dran: Du bist nicht allein.',
      'Mach\'s gut! Die Ersteinschätzung ist jederzeit verfügbar, wenn du möchtest.',
      'Tschüss! Hol dir Hilfe, wenn du sie brauchst. Ich glaub an dich.',
    ],
  },
]

/**
 * Allgemeine Responses für verschiedene Situationen
 */
export const GENERAL_RESPONSES = {
  greeting: [
    'Hey 👋 Ich bin dein vertraulicher Support-Chat. Alles was du schreibst, bleibt nur auf deinem Gerät gespeichert.\n\nBitte beachte: Ich bin ein einfaches Unterstützungstool (kein KI-Chatbot) und kann manchmal unpassende Antworten geben. Mein Ziel ist es, dir erste Orientierung zu geben und dich an die richtigen Ressourcen weiterzuleiten.\n\nWie geht\'s dir? Was beschäftigt dich?',
    'Hallo! Ich bin hier, um dir erste Orientierung zu geben.\n\n🔒 100% Datenschutz: Deine Nachrichten werden NUR lokal in deinem Browser gespeichert, nirgendwo sonst.\n\nWichtig: Ich bin ein regelbasiertes Tool und manchmal ungenau. Bei wichtigen Themen empfehle ich dir die Ersteinschätzung oder den Kontakt zu unserem Care-Team.\n\nWas möchtest du mir erzählen?',
    'Hi! Schön, dass du da bist.\n\n💬 Deine Privatsphäre ist geschützt: Alle Daten bleiben ausschließlich auf deinem Gerät.\n\nIch bin ein einfacher Support-Bot (keine KI) und kann dir helfen, erste Fragen zu klären und dich weiterzuleiten. Meine Antworten sind manchmal nicht perfekt - das ist normal.\n\nWie kann ich dir helfen?',
  ],
  unclear: [
    'Magst du mir mehr darüber erzählen?',
    'Ich bin nicht sicher, ob ich dich richtig verstehe. Kannst du das näher erklären?',
    'Erzähl ruhig weiter. Was genau meinst du damit?',
    'Ich höre zu. Was möchtest du mir noch sagen?',
    'Das ist ein Anfang. Magst du mehr ins Detail gehen?',
    'Ich bin ganz Ohr. Erzähl weiter.',
  ],
  acknowledgment: [
    'Ich höre dich.',
    'Das klingt echt belastend.',
    'Danke, dass du mir das erzählst.',
    'Das ist nicht leicht.',
    'Ich verstehe.',
    'Das ist viel.',
  ],
  // Für sehr kurze Antworten wie "ja", "okay", "hmm"
  acknowledgment_short: [
    'Magst du mir mehr darüber erzählen?',
    'Ich bin für dich da. Erzähl ruhig weiter.',
    'Nimm dir Zeit. Ich höre zu.',
    'Was geht dir gerade durch den Kopf?',
    'Möchtest du weitersprechen?',
    'Ich bin hier, wenn du reden möchtest.',
  ],
  // Hilfe für Angehörige (dritte Person)
  help_for_others: [
    'Es ist gut, dass du dir Sorgen um diese Person machst. Für Angehörige gibt es auch Unterstützung.',
    'Jemandem helfen zu wollen ist wichtig. Gleichzeitig solltest du auch auf dich selbst achten.',
    'Das ist eine schwierige Situation für dich. Möchtest du darüber reden, wie es DIR damit geht?',
  ],
  assessment_intro: [
    'Lass uns gemeinsam schauen, wie ich dir am besten helfen kann. Eine kurze Einschätzung (2-3 Min.) kann zeigen, welche Unterstützung passt.',
  ],
}
