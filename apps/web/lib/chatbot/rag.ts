import { KNOWLEDGE_BASE, type KnowledgeBaseEntry } from './knowledge-base';

export interface KnowledgeHit {
  entry: KnowledgeBaseEntry;
  score: number;
}

const STOP_WORDS = new Set([
  'der',
  'die',
  'das',
  'und',
  'ein',
  'eine',
  'ich',
  'du',
  'wir',
  'ihr',
  'sie',
  'es',
  'ist',
  'sind',
  'wie',
  'was',
  'wo',
  'mit',
  'auf',
  'für',
  'den',
  'dem',
  'zur',
  'zum',
  'dass',
  'oder',
  'wenn',
  'auch',
  'nicht',
  'kein',
  'keine',
]);

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function buildVector(tokens: string[]): Map<string, number> {
  const vector = new Map<string, number>();
  for (const token of tokens) {
    vector.set(token, (vector.get(token) || 0) + 1);
  }
  return vector;
}

function cosineSimilarity(vecA: Map<string, number>, vecB: Map<string, number>): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const value of vecA.values()) {
    magnitudeA += value * value;
  }
  for (const value of vecB.values()) {
    magnitudeB += value * value;
  }

  const smaller = vecA.size < vecB.size ? vecA : vecB;
  const larger = vecA.size < vecB.size ? vecB : vecA;

  for (const [token, value] of smaller.entries()) {
    const other = larger.get(token);
    if (other) {
      dotProduct += value * other;
    }
  }

  if (dotProduct === 0 || magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }

  return dotProduct / Math.sqrt(magnitudeA * magnitudeB);
}

interface KnowledgeVectorExtended {
  entry: KnowledgeBaseEntry;
  vector: Map<string, number>;
  tagVector: Map<string, number>; // Separate vector for tags (higher weight)
}

const KNOWLEDGE_VECTORS: KnowledgeVectorExtended[] = KNOWLEDGE_BASE.map((entry) => {
  const contentTokens = tokenize(`${entry.title} ${entry.summary} ${entry.content}`);
  const tagTokens = tokenize(entry.tags.join(' '));
  return {
    entry,
    vector: buildVector(contentTokens),
    tagVector: buildVector(tagTokens),
  };
});

export function searchKnowledgeBase(query: string, limit = 3): KnowledgeHit[] {
  const queryVector = buildVector(tokenize(query));
  if (queryVector.size === 0) {
    return [];
  }

  // Calculate weighted scores: Tags get 2x weight, content gets 1x weight
  const TAG_WEIGHT = 2.0;
  const SCORE_THRESHOLD = 0.15;

  const results = KNOWLEDGE_VECTORS.map(({ entry, vector, tagVector }) => {
    // Score against content
    const contentScore = cosineSimilarity(vector, queryVector);

    // Score against tags (higher weight)
    const tagScore = cosineSimilarity(tagVector, queryVector) * TAG_WEIGHT;

    // Final score is the maximum of both (tags win if they match better)
    const finalScore = Math.max(tagScore, contentScore);

    return {
      entry,
      score: finalScore,
    };
  })
    .filter((hit) => hit.score > SCORE_THRESHOLD) // Use threshold instead of > 0
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return results;
}

export function buildContextSnippet(hits: KnowledgeHit[]): string {
  if (hits.length === 0) return '';

  return hits
    .map(({ entry }) => `${entry.title} (${entry.url}): ${entry.summary}\n\n${entry.content}`)
    .join('\n\n---\n\n');
}
