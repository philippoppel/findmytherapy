'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'fmt_user_preferences';

export interface UserPreferences {
  // Aus Quiz gespeichert
  quizTopics?: string[];
  quizCompletedAt?: string;

  // Aus Triage gespeichert
  triageTopics?: string[];
  triageSeverity?: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe';
  triageCompletedAt?: string;

  // Lesehistorie
  readArticles?: string[];

  // Kombinierte Interessen (für Empfehlungen)
  interests?: string[];
}

// Mapping: Problem-Area-ID → lesbare Themen-Keywords
export const TOPIC_KEYWORDS: Record<string, string[]> = {
  angst: ['Angst', 'Panik', 'Angststörung', 'Panikattacken', 'Phobien', 'Sorgen'],
  depression: ['Depression', 'depressiv', 'Niedergeschlagenheit', 'Antriebslosigkeit', 'Traurigkeit'],
  stress: ['Stress', 'Burnout', 'Erschöpfung', 'Überlastung', 'Work-Life', 'Belastung'],
  trauma: ['Trauma', 'PTBS', 'traumatisch', 'Belastung', 'Verarbeitung'],
  beziehung: ['Beziehung', 'Partnerschaft', 'Paar', 'Kommunikation', 'Trennung', 'Konflikte'],
  selbstwert: ['Selbstwert', 'Selbstbewusstsein', 'Selbstliebe', 'Selbstfürsorge', 'Selbstzweifel'],
  trauer: ['Trauer', 'Verlust', 'Tod', 'Abschied'],
  sucht: ['Sucht', 'Abhängigkeit', 'Alkohol', 'Drogen'],
  essstoerung: ['Essstörung', 'Anorexie', 'Bulimie', 'Essen'],
  schlaf: ['Schlaf', 'Insomnie', 'Entspannung', 'Ruhe', 'Schlafprobleme'],
  zwang: ['Zwang', 'OCD', 'Zwangsgedanken', 'Rituale'],
  adhs: ['ADHS', 'ADS', 'Aufmerksamkeit', 'Konzentration'],
  arbeit: ['Arbeit', 'Beruf', 'Karriere', 'Burnout', 'Mobbing', 'Workplace'],
};

function getStoredPreferences(): UserPreferences | null {
  if (typeof window === 'undefined') return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

function savePreferences(prefs: UserPreferences): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

export function useUserPreferences() {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Lade Präferenzen beim Mount
  useEffect(() => {
    const stored = getStoredPreferences();
    setPreferences(stored);
    setIsLoaded(true);
  }, []);

  // Quiz-Ergebnisse speichern
  const saveQuizResults = useCallback((topics: string[]) => {
    const updated: UserPreferences = {
      ...getStoredPreferences(),
      quizTopics: topics,
      quizCompletedAt: new Date().toISOString(),
    };

    // Interessen aktualisieren
    updated.interests = computeInterests(updated);

    savePreferences(updated);
    setPreferences(updated);
  }, []);

  // Triage-Ergebnisse speichern
  const saveTriageResults = useCallback((data: {
    topics?: string[];
    severity?: UserPreferences['triageSeverity'];
    phq9Score?: number;
    gad7Score?: number;
  }) => {
    // Themen aus Scores ableiten
    const derivedTopics: string[] = data.topics || [];

    // Aus PHQ-9 Score ableiten
    if (data.phq9Score !== undefined && data.phq9Score >= 5) {
      if (!derivedTopics.includes('depression')) derivedTopics.push('depression');
    }

    // Aus GAD-7 Score ableiten
    if (data.gad7Score !== undefined && data.gad7Score >= 5) {
      if (!derivedTopics.includes('angst')) derivedTopics.push('angst');
    }

    const updated: UserPreferences = {
      ...getStoredPreferences(),
      triageTopics: derivedTopics,
      triageSeverity: data.severity,
      triageCompletedAt: new Date().toISOString(),
    };

    // Interessen aktualisieren
    updated.interests = computeInterests(updated);

    savePreferences(updated);
    setPreferences(updated);
  }, []);

  // Artikel als gelesen markieren
  const trackArticleRead = useCallback((slug: string) => {
    const current = getStoredPreferences() || {};
    const readArticles = current.readArticles || [];

    // Nur hinzufügen wenn nicht bereits gelesen
    if (!readArticles.includes(slug)) {
      const updated: UserPreferences = {
        ...current,
        readArticles: [...readArticles, slug].slice(-50), // Max 50 Artikel behalten
      };

      savePreferences(updated);
      setPreferences(updated);
    }
  }, []);

  // Empfohlene Themen berechnen (priorisiert nach Aktualität und Quelle)
  const getRecommendedTopics = useCallback((): string[] => {
    if (!preferences) return [];

    const topics: string[] = [];

    // Triage hat höchste Priorität (wissenschaftlich fundiert)
    if (preferences.triageTopics?.length) {
      topics.push(...preferences.triageTopics);
    }

    // Quiz-Topics hinzufügen (wenn nicht bereits vorhanden)
    if (preferences.quizTopics?.length) {
      preferences.quizTopics.forEach(topic => {
        if (!topics.includes(topic)) {
          topics.push(topic);
        }
      });
    }

    return topics;
  }, [preferences]);

  // Prüfen ob User Präferenzen hat
  const hasPreferences = useCallback((): boolean => {
    if (!preferences) return false;
    return !!(
      preferences.quizTopics?.length ||
      preferences.triageTopics?.length
    );
  }, [preferences]);

  // Alle Präferenzen löschen
  const clearPreferences = useCallback(() => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
    setPreferences(null);
  }, []);

  return {
    preferences,
    isLoaded,
    saveQuizResults,
    saveTriageResults,
    trackArticleRead,
    getRecommendedTopics,
    hasPreferences,
    clearPreferences,
  };
}

// Helper: Kombinierte Interessen aus allen Quellen berechnen
function computeInterests(prefs: UserPreferences): string[] {
  const interests = new Set<string>();

  // Quiz-Topics
  prefs.quizTopics?.forEach(topic => interests.add(topic));

  // Triage-Topics
  prefs.triageTopics?.forEach(topic => interests.add(topic));

  return Array.from(interests);
}

// Utility: Keywords für ein Topic-Array bekommen
export function getKeywordsForTopics(topics: string[]): string[] {
  const keywords: string[] = [];
  topics.forEach(topic => {
    const topicKeywords = TOPIC_KEYWORDS[topic];
    if (topicKeywords) {
      keywords.push(...topicKeywords);
    }
  });
  return keywords;
}
