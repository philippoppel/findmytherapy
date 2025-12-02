// Blog Import Template and Parser
// This module provides a structured template for AI-generated blog articles
// and a flexible parser that handles variations in formatting

export const BLOG_IMPORT_TEMPLATE = `
===== BLOG ARTIKEL TEMPLATE =====
Kopiere dieses Template und fülle es mit Deep Research aus.
Die Struktur muss eingehalten werden, aber kleine Formatfehler werden automatisch korrigiert.

---META---
Titel: [Prägnanter, SEO-optimierter Titel, max. 60 Zeichen]
Slug: [url-freundlicher-slug-ohne-umlaute]
Kategorie: [Eine der: Angststörungen, Depression, Trauma & PTBS, Beziehung & Partnerschaft, Selbstwert, Stress & Burnout, Psychotherapie Allgemein, Achtsamkeit, Kinder & Jugendliche, Essstörungen]
Lesezeit: [X Min.]

---KURZBESCHREIBUNG---
[2-3 Sätze, die den Artikel zusammenfassen. Max. 160 Zeichen für SEO. Dieser Text erscheint in Suchergebnissen und Social Media Previews.]

---AUF EINEN BLICK---
- [Erster Kernpunkt des Artikels]
- [Zweiter wichtiger Aspekt]
- [Dritter zentraler Gedanke]
- [Optional: weitere Punkte]

---SEO---
Meta-Titel: [SEO-Titel, kann vom Haupttitel abweichen, max. 60 Zeichen]
Meta-Beschreibung: [SEO-Beschreibung, max. 160 Zeichen]
Keywords: [keyword1, keyword2, keyword3, keyword4, keyword5]
Tags: [tag1, tag2, tag3]

---TITELBILD---
URL: [https://images.unsplash.com/photo-... oder andere Bild-URL]
Alt-Text: [Beschreibung des Bildes für Barrierefreiheit]
Bildunterschrift: [Optional: Kurze Bildunterschrift]

---INHALT---

## [Erste Überschrift - Einleitung]

[Einleitender Absatz, der das Thema vorstellt und den Leser abholt. Erkläre warum dieses Thema wichtig ist und was der Leser erwarten kann.]

[Zweiter Absatz mit weiteren Informationen zur Einführung.]

BILD: [Optional: URL] | [Alt-Text] | [Bildunterschrift]

## [Zweite Überschrift - Hauptteil 1]

[Detaillierter Absatz zum ersten Hauptthema. Nutze wissenschaftliche Erkenntnisse und erkläre komplexe Zusammenhänge verständlich.]

[Weiterer Absatz mit Vertiefung des Themas.]

LISTE:
- [Erster Listenpunkt]
- [Zweiter Listenpunkt]
- [Dritter Listenpunkt]

## [Dritte Überschrift - Hauptteil 2]

[Absatz zum zweiten Hauptthema.]

[Vertiefender Absatz mit praktischen Beispielen oder Studien.]

## [Vierte Überschrift - Praktische Tipps/Anwendung]

[Absatz mit konkreten Handlungsempfehlungen.]

LISTE:
- [Praktischer Tipp 1]
- [Praktischer Tipp 2]
- [Praktischer Tipp 3]

## [Fünfte Überschrift - Fazit]

[Zusammenfassender Absatz, der die wichtigsten Erkenntnisse wiederholt.]

[Abschließender Gedanke oder Ermutigung für den Leser.]

---FAQ---
F: [Häufig gestellte Frage 1?]
A: [Ausführliche Antwort auf die Frage.]

F: [Häufig gestellte Frage 2?]
A: [Ausführliche Antwort auf die Frage.]

F: [Häufig gestellte Frage 3?]
A: [Ausführliche Antwort auf die Frage.]

---QUELLEN---
1. [Autor (Jahr). Titel der Studie/des Buches. | URL falls vorhanden | Kurze Beschreibung]
2. [Autor (Jahr). Titel. | URL | Beschreibung]
3. [Organisation. Titel des Dokuments. | URL | Beschreibung]

===== ENDE TEMPLATE =====
`;

// Types for parsed blog data
export interface ParsedBlogData {
  // Meta
  title: string;
  slug: string;
  category: string;
  readingTime: string;

  // Description
  excerpt: string;

  // Summary points
  summaryPoints: string[];

  // SEO
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  tags: string[];

  // Featured image
  featuredImageUrl: string;
  featuredImageAlt: string;
  featuredImageCaption: string;

  // Content sections
  content: {
    sections: Array<{
      heading: string;
      paragraphs: string[];
      list?: string[];
      image?: {
        src: string;
        alt: string;
        caption?: string;
      };
    }>;
  };

  // FAQ
  faq: Array<{
    question: string;
    answer: string;
  }>;

  // Sources
  sources: Array<{
    title: string;
    url: string;
    description: string;
  }>;

  // Parsing info
  parseWarnings: string[];
}

// Helper function to clean and normalize text
function cleanText(text: string): string {
  return text
    .replace(/\[|\]/g, '') // Remove brackets
    .replace(/^\s+|\s+$/g, '') // Trim
    .replace(/\s+/g, ' '); // Normalize whitespace
}

// Helper to extract value after a label (flexible matching)
function extractValue(text: string, labels: string[]): string | null {
  for (const label of labels) {
    // Try various patterns: "Label: value", "Label value", "Label - value"
    const patterns = [
      new RegExp(`${label}\\s*:\\s*(.+)`, 'i'),
      new RegExp(`${label}\\s*-\\s*(.+)`, 'i'),
      new RegExp(`${label}\\s+(.+)`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match) {
        return cleanText(match[1]);
      }
    }
  }
  return null;
}

// Helper to find section by various markers
function findSection(text: string, markers: string[]): string {
  for (const marker of markers) {
    // Try with dashes, equals, em-dashes, or just the text
    const patterns = [
      // Standard triple dash: ---META---
      new RegExp(`---\\s*${marker}\\s*---([\\s\\S]*?)(?=---[A-Z]|$)`, 'i'),
      // Em-dash format: —META— (single em-dash on each side)
      new RegExp(`—\\s*${marker}\\s*—([\\s\\S]*?)(?=—[A-Z]|$)`, 'i'),
      // Double em-dash format: ——META——
      new RegExp(`——\\s*${marker}\\s*——([\\s\\S]*?)(?=——[A-Z]|$)`, 'i'),
      // Equals format: ===META===
      new RegExp(`===\\s*${marker}\\s*===([\\s\\S]*?)(?====[A-Z]|$)`, 'i'),
      // Bracket format: [META]
      new RegExp(`\\[${marker}\\]([\\s\\S]*?)(?=\\[[A-Z]|$)`, 'i'),
      // Hash format: # META
      new RegExp(`#\\s*${marker}([\\s\\S]*?)(?=#\\s*[A-Z]|---[A-Z]|—[A-Z]|$)`, 'i'),
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1].trim()) {
        return match[1].trim();
      }
    }
  }
  return '';
}

// Helper to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 100);
}

// Main parser function - flexible and forgiving
export function parseBlogImport(rawText: string): ParsedBlogData {
  const warnings: string[] = [];
  const text = rawText.replace(/\r\n/g, '\n');

  // Initialize with defaults
  const result: ParsedBlogData = {
    title: '',
    slug: '',
    category: 'Psychotherapie Allgemein',
    readingTime: '5 Min.',
    excerpt: '',
    summaryPoints: [],
    metaTitle: '',
    metaDescription: '',
    keywords: [],
    tags: [],
    featuredImageUrl: '',
    featuredImageAlt: '',
    featuredImageCaption: '',
    content: { sections: [] },
    faq: [],
    sources: [],
    parseWarnings: warnings,
  };

  // === PARSE META ===
  // Note: metaSection is found but individual fields are extracted from full text
  // to be more flexible with formatting variations
  findSection(text, ['META', 'METADATEN', 'METADATA']);

  // Title - try multiple patterns
  result.title = extractValue(text, ['Titel', 'Title', 'Überschrift']) || '';
  if (!result.title) {
    // Try to find first # heading
    const firstHeading = text.match(/^#\s+([^\n]+)/m);
    if (firstHeading) result.title = cleanText(firstHeading[1]);
  }
  if (!result.title) warnings.push('Kein Titel gefunden');

  // Slug
  result.slug = extractValue(text, ['Slug', 'URL', 'Permalink']) || '';
  if (!result.slug && result.title) {
    result.slug = generateSlug(result.title);
    warnings.push('Slug automatisch generiert');
  }

  // Category - validate against known categories
  const validCategories = [
    'Angststörungen', 'Depression', 'Trauma & PTBS', 'Beziehung & Partnerschaft',
    'Selbstwert', 'Stress & Burnout', 'Psychotherapie Allgemein', 'Achtsamkeit',
    'Kinder & Jugendliche', 'Essstörungen'
  ];
  const rawCategory = extractValue(text, ['Kategorie', 'Category', 'Thema']) || '';
  const matchedCategory = validCategories.find(c =>
    c.toLowerCase() === rawCategory.toLowerCase() ||
    rawCategory.toLowerCase().includes(c.toLowerCase().split(' ')[0])
  );
  result.category = matchedCategory || 'Psychotherapie Allgemein';
  if (!matchedCategory && rawCategory) {
    warnings.push('Kategorie "' + rawCategory + '" nicht erkannt, Standard verwendet');
  }

  // Reading time
  const readingTimeMatch = text.match(/(\d+)\s*(min|minuten|minutes)/i);
  if (readingTimeMatch) {
    result.readingTime = readingTimeMatch[1] + ' Min.';
  }

  // === PARSE KURZBESCHREIBUNG ===
  const descSection = findSection(text, ['KURZBESCHREIBUNG', 'BESCHREIBUNG', 'EXCERPT', 'ZUSAMMENFASSUNG']);
  if (descSection) {
    result.excerpt = cleanText(descSection.split('\n')[0]).slice(0, 300);
  }
  if (!result.excerpt) {
    result.excerpt = extractValue(text, ['Kurzbeschreibung', 'Beschreibung', 'Excerpt']) || '';
  }

  // === PARSE AUF EINEN BLICK ===
  const summarySection = findSection(text, ['AUF EINEN BLICK', 'ZUSAMMENFASSUNG', 'KERNPUNKTE', 'KEY POINTS', 'SUMMARY']);
  if (summarySection) {
    const lines = summarySection.split('\n');
    for (const line of lines) {
      // Handle various bullet formats including tab-indented ones
      const cleaned = line
        .replace(/^\s*[-*•]\s*/, '') // Remove leading whitespace + bullet
        .replace(/￼/g, '') // Remove Unicode object replacement chars (reference markers)
        .trim();
      if (cleaned && cleaned.length > 5 && !cleaned.startsWith('[')) {
        result.summaryPoints.push(cleaned);
      }
    }
  }

  // === PARSE SEO ===
  // Note: seoSection helps identify the section but fields are extracted from full text
  findSection(text, ['SEO', 'SUCHMASCHINENOPTIMIERUNG']);

  result.metaTitle = extractValue(text, ['Meta-Titel', 'Meta Titel', 'SEO-Titel', 'SEO Titel']) || result.title;
  result.metaDescription = extractValue(text, ['Meta-Beschreibung', 'Meta Beschreibung', 'SEO-Beschreibung']) || result.excerpt;

  // Keywords
  const keywordsRaw = extractValue(text, ['Keywords', 'Schlüsselwörter', 'Schlagwörter']) || '';
  result.keywords = keywordsRaw
    .split(/[,;]/)
    .map(k => k.trim())
    .filter(k => k && k.length > 1 && !k.startsWith('['));

  // Tags
  const tagsRaw = extractValue(text, ['Tags', 'Schlagworte']) || '';
  result.tags = tagsRaw
    .split(/[,;]/)
    .map(t => t.trim())
    .filter(t => t && t.length > 1 && !t.startsWith('['));

  // === PARSE TITELBILD ===
  const imageSection = findSection(text, ['TITELBILD', 'FEATURED IMAGE', 'BEITRAGSBILD', 'HAUPTBILD']);

  // Try to find image URL
  const imageUrlMatch = text.match(/(?:URL|Bild|Image)?\s*:?\s*(https?:\/\/[^\s\]|]+(?:\.(?:jpg|jpeg|png|webp|gif)|photo-[^\s\]|]+))/i);
  if (imageUrlMatch) {
    result.featuredImageUrl = imageUrlMatch[1];
  }

  result.featuredImageAlt = extractValue(imageSection || text, ['Alt-Text', 'Alt Text', 'Alternativtext', 'Beschreibung']) || result.title;
  result.featuredImageCaption = extractValue(imageSection || text, ['Bildunterschrift', 'Caption', 'Untertitel']) || '';

  // === PARSE INHALT ===
  const contentSection = findSection(text, ['INHALT', 'CONTENT', 'ARTIKEL', 'TEXT']);
  const contentText = contentSection || text;

  // Helper to check if a line looks like a heading (without ## prefix)
  const looksLikeHeading = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.length < 3 || trimmed.length > 100) return false;
    // Skip list items, metadata, FAQ markers
    if (/^[-*•]\s/.test(trimmed)) return false;
    if (/^(LISTE|BILD|F|A|URL|Alt|Bildunterschrift):/i.test(trimmed)) return false;
    if (/^\d+\.\s/.test(trimmed)) return false; // Numbered list
    // Skip lines ending with typical sentence punctuation followed by more content indicators
    if (/[.!]$/.test(trimmed) && trimmed.length > 60) return false;
    // Skip lines that look like regular paragraphs (contain multiple sentences)
    if ((trimmed.match(/[.!?]/g) || []).length > 1) return false;
    // Skip bracket placeholders
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) return false;
    return true;
  };

  // First try: Split by ## headings (Markdown style)
  let sectionMatches = contentText.split(/(?=^##\s+[^\n]+)/m);
  let useMarkdownHeadings = sectionMatches.some(s => /^##\s+/.test(s.trim()));

  // Second try: If no ## headings found, try to detect standalone heading lines
  if (!useMarkdownHeadings) {
    // Split by lines that look like headings (short line followed by blank line and content)
    const lines = contentText.split('\n');
    const sections: string[] = [];
    let currentSection = '';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const nextLine = lines[i + 1] || '';
      const prevLine = lines[i - 1] || '';

      // Detect heading: short line, previous line empty or start, followed by empty line or content
      const isHeading = looksLikeHeading(line) &&
        (prevLine.trim() === '' || i === 0 || /^—|^---/.test(prevLine)) &&
        (nextLine.trim() === '' || (nextLine.trim().length > line.trim().length));

      if (isHeading && currentSection.trim()) {
        sections.push(currentSection);
        currentSection = '## ' + line.trim() + '\n'; // Normalize to ## format
      } else if (isHeading && !currentSection.trim()) {
        currentSection = '## ' + line.trim() + '\n';
      } else {
        currentSection += line + '\n';
      }
    }
    if (currentSection.trim()) {
      sections.push(currentSection);
    }

    sectionMatches = sections.length > 1 ? sections : sectionMatches;
  }

  for (const sectionText of sectionMatches) {
    if (!sectionText.trim()) continue;

    const headingMatch = sectionText.match(/^##\s+([^\n]+)/);
    if (!headingMatch) continue;

    const heading = cleanText(headingMatch[1]);
    if (!heading || heading.startsWith('[')) continue;

    const section: ParsedBlogData['content']['sections'][0] = {
      heading,
      paragraphs: [],
    };

    // Get content after heading
    const afterHeading = sectionText.slice(headingMatch[0].length);

    // Look for lists (including tab-indented bullets)
    const listMatch = afterHeading.match(/(?:LISTE:|Liste:)?\s*((?:\s*[-*•]\s+[^\n]+\n?)+)/i);
    if (listMatch) {
      section.list = listMatch[1]
        .split('\n')
        .map(l => l.replace(/^\s*[-*•]\s*/, '').replace(/￼/g, '').trim())
        .filter(l => l && l.length > 2 && !l.startsWith('['));
    }

    // Look for inline image
    const inlineImageMatch = afterHeading.match(/BILD:\s*([^|\n]+)\s*\|\s*([^|\n]+)(?:\s*\|\s*([^\n]+))?/i);
    if (inlineImageMatch) {
      const imgUrl = inlineImageMatch[1].trim();
      if (imgUrl.startsWith('http')) {
        section.image = {
          src: imgUrl,
          alt: cleanText(inlineImageMatch[2]),
          caption: inlineImageMatch[3] ? cleanText(inlineImageMatch[3]) : undefined,
        };
      }
    }

    // Extract paragraphs (exclude lists, images, metadata)
    const paragraphText = afterHeading
      .replace(/LISTE:[\s\S]*?(?=\n\n|$)/gi, '')
      .replace(/BILD:.*$/gim, '')
      .replace(/(?:[-*•]\s+[^\n]+\n?)+/g, '');

    const paragraphs = paragraphText
      .split(/\n\n+/)
      .map(p => p.trim().replace(/\n/g, ' '))
      .filter(p => p && p.length > 20 && !p.startsWith('[') && !p.startsWith('#'));

    section.paragraphs = paragraphs;

    if (section.paragraphs.length > 0 || section.list?.length) {
      result.content.sections.push(section);
    }
  }

  if (result.content.sections.length === 0) {
    warnings.push('Keine Inhaltssektionen gefunden - prüfe ## Überschriften');
  }

  // === PARSE FAQ ===
  const faqSection = findSection(text, ['FAQ', 'HÄUFIGE FRAGEN', 'FRAGEN', 'Q&A']);
  if (faqSection) {
    // Try F:/A: format
    const faMatches = faqSection.matchAll(/(?:F|Frage|Q):\s*([^\n]+)\s*(?:A|Antwort):\s*([^\n]+(?:\n(?![FA]:)[^\n]+)*)/gi);
    for (const match of faMatches) {
      const question = cleanText(match[1]);
      const answer = cleanText(match[2]);
      if (question && answer && !question.startsWith('[')) {
        result.faq.push({ question, answer });
      }
    }

    // Try numbered format: 1. Question? Answer...
    if (result.faq.length === 0) {
      const numberedMatches = faqSection.matchAll(/\d+\.\s*([^?\n]+\?)\s*([^\d\n]+(?:\n(?!\d+\.)[^\n]+)*)/g);
      for (const match of numberedMatches) {
        const question = cleanText(match[1]);
        const answer = cleanText(match[2]);
        if (question && answer) {
          result.faq.push({ question, answer });
        }
      }
    }
  }

  // === PARSE QUELLEN ===
  const sourcesSection = findSection(text, ['QUELLEN', 'SOURCES', 'REFERENZEN', 'LITERATUR', 'REFERENCES']);
  if (sourcesSection) {
    const lines = sourcesSection.split('\n');

    for (const line of lines) {
      // Skip empty or template lines
      if (!line.trim() || line.includes('[Autor') || line.startsWith('---')) continue;

      // Remove leading numbers, tabs, and Unicode reference markers
      const cleanedLine = line
        .replace(/^\s*\d+[.)]\s*/, '') // Leading numbers with . or )
        .replace(/￼/g, '') // Unicode object replacement chars
        .trim();
      if (!cleanedLine || cleanedLine.length < 10) continue;

      // Try to extract URL
      const urlMatch = cleanedLine.match(/(https?:\/\/[^\s|[\]]+)/);
      const url = urlMatch ? urlMatch[1] : '';

      // Split by | for structured format
      const parts = cleanedLine.split('|').map(p => p.trim());

      if (parts.length >= 2) {
        // Structured: Title | URL | Description
        result.sources.push({
          title: parts[0].replace(url, '').trim() || parts[0],
          url: parts[1].startsWith('http') ? parts[1] : url,
          description: parts[2] || '',
        });
      } else {
        // Unstructured: just the title with maybe a URL
        result.sources.push({
          title: cleanedLine.replace(url, '').replace(/\s+/g, ' ').trim(),
          url,
          description: '',
        });
      }
    }
  }

  // Final validation
  if (!result.title) warnings.push('Titel ist erforderlich');
  if (!result.excerpt) warnings.push('Kurzbeschreibung fehlt');
  if (result.summaryPoints.length === 0) warnings.push('Keine Zusammenfassungspunkte gefunden');
  if (result.content.sections.length === 0) warnings.push('Kein Inhalt gefunden');
  if (result.sources.length === 0) warnings.push('Keine Quellen gefunden');

  return result;
}

// Template for ChatGPT/Claude Deep Research prompt
export const DEEP_RESEARCH_PROMPT = `Du bist ein Experte für psychische Gesundheit und wissenschaftliches Schreiben. Erstelle einen umfassenden, wissenschaftlich fundierten Blog-Artikel zum Thema: [THEMA HIER EINFÜGEN]

WICHTIG: Halte dich EXAKT an das folgende Format. Ersetze alle Platzhalter in eckigen Klammern [...] mit deinem Inhalt.

ANFORDERUNGEN:
1. Der Artikel soll 1500-2500 Wörter umfassen
2. Nutze aktuelle wissenschaftliche Studien (2020-2024 bevorzugt)
3. Schreibe für Laien verständlich, aber wissenschaftlich fundiert
4. Verwende einen empathischen, nicht-wertenden Ton
5. Inkludiere praktische Handlungsempfehlungen
6. Alle Quellen müssen real und überprüfbar sein

${BLOG_IMPORT_TEMPLATE}`;
