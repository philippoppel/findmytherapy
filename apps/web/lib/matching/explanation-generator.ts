import type {
  ScoreBreakdown,
  MatchExplanation,
  TherapistForMatching,
  MatchingPreferencesInput,
} from './types'

interface ExplanationItem {
  text: string
  priority: number // Höher = wichtiger
  type: 'primary' | 'secondary' | 'warning'
}

export function generateMatchExplanation(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput,
  scoreBreakdown: ScoreBreakdown
): MatchExplanation {
  const items: ExplanationItem[] = []

  // Spezialisierungs-Erklärungen
  const specialtyComponent = scoreBreakdown.components.specialty
  if (specialtyComponent.score >= 0.8) {
    const matchedAreas = getMatchedSpecialties(therapist, preferences)
    if (matchedAreas.length > 0) {
      items.push({
        text: `Spezialisiert auf ${matchedAreas.slice(0, 2).join(' und ')}`,
        priority: 10,
        type: 'primary',
      })
    }
  } else if (specialtyComponent.score >= 0.5) {
    items.push({
      text: 'Erfahrung in verwandten Bereichen',
      priority: 5,
      type: 'secondary',
    })
  } else if (specialtyComponent.score < 0.3) {
    items.push({
      text: 'Spezialisierung passt möglicherweise nicht optimal',
      priority: 3,
      type: 'warning',
    })
  }

  // Distanz-Erklärungen
  const distanceComponent = scoreBreakdown.components.distance
  if (distanceComponent.distanceKm !== undefined) {
    if (distanceComponent.distanceKm <= 5) {
      items.push({
        text: `Nur ${distanceComponent.distanceKm} km entfernt`,
        priority: 9,
        type: 'primary',
      })
    } else if (distanceComponent.distanceKm <= 15) {
      items.push({
        text: `${distanceComponent.distanceKm} km entfernt`,
        priority: 6,
        type: 'secondary',
      })
    } else if (distanceComponent.distanceKm <= 30) {
      items.push({
        text: `${distanceComponent.distanceKm} km Entfernung`,
        priority: 4,
        type: 'secondary',
      })
    } else {
      items.push({
        text: `${distanceComponent.distanceKm} km entfernt - größere Anfahrt`,
        priority: 2,
        type: 'warning',
      })
    }
  } else if (therapist.online && preferences.format !== 'IN_PERSON') {
    items.push({
      text: 'Bietet Online-Therapie an',
      priority: 8,
      type: 'primary',
    })
  }

  // Online-Therapie Bonus
  if (therapist.online && preferences.format === 'ONLINE') {
    items.push({
      text: 'Online-Therapie verfügbar',
      priority: 7,
      type: 'primary',
    })
  } else if (therapist.online && preferences.format === 'BOTH') {
    items.push({
      text: 'Online & Präsenz möglich',
      priority: 5,
      type: 'secondary',
    })
  }

  // Verfügbarkeits-Erklärungen
  const availabilityComponent = scoreBreakdown.components.availability
  if (availabilityComponent.waitWeeks !== undefined) {
    if (availabilityComponent.waitWeeks === 0) {
      items.push({
        text: 'Sofort Termine verfügbar',
        priority: 9,
        type: 'primary',
      })
    } else if (availabilityComponent.waitWeeks <= 2) {
      items.push({
        text: `Termine innerhalb von ${availabilityComponent.waitWeeks} Wochen`,
        priority: 7,
        type: 'primary',
      })
    } else if (availabilityComponent.waitWeeks <= 4) {
      items.push({
        text: `Ca. ${availabilityComponent.waitWeeks} Wochen Wartezeit`,
        priority: 4,
        type: 'secondary',
      })
    } else {
      items.push({
        text: `Wartezeit ca. ${availabilityComponent.waitWeeks} Wochen`,
        priority: 2,
        type: 'warning',
      })
    }
  }

  // Methoden-Erklärungen
  const methodsComponent = scoreBreakdown.components.methods
  if (methodsComponent.matchedMethods && methodsComponent.matchedMethods.length > 0) {
    const methodsList = methodsComponent.matchedMethods.slice(0, 2).join(', ')
    items.push({
      text: `Arbeitet mit ${methodsList}`,
      priority: 6,
      type: 'secondary',
    })
  }

  // Sprach-Erklärungen
  if (scoreBreakdown.components.language.score >= 0.8 && preferences.languages.length > 0) {
    const matchedLangs = getMatchedLanguages(therapist, preferences)
    if (matchedLangs.length > 0) {
      items.push({
        text: `Spricht ${matchedLangs.join(' und ')}`,
        priority: 5,
        type: 'secondary',
      })
    }
  }

  // Bewertungs-Erklärungen
  if (therapist.rating && therapist.rating >= 4.5 && (therapist.reviewCount || 0) >= 5) {
    items.push({
      text: `Sehr gut bewertet (${therapist.rating.toFixed(1)} ⭐)`,
      priority: 6,
      type: 'secondary',
    })
  } else if (therapist.rating && therapist.rating >= 4.0) {
    items.push({
      text: `Gut bewertet (${therapist.rating.toFixed(1)} ⭐)`,
      priority: 4,
      type: 'secondary',
    })
  }

  // Erfahrungs-Erklärungen
  if (therapist.yearsExperience && therapist.yearsExperience >= 10) {
    items.push({
      text: `${therapist.yearsExperience} Jahre Erfahrung`,
      priority: 5,
      type: 'secondary',
    })
  } else if (therapist.yearsExperience && therapist.yearsExperience >= 5) {
    items.push({
      text: `${therapist.yearsExperience} Jahre Berufserfahrung`,
      priority: 3,
      type: 'secondary',
    })
  }

  // Preis-Erklärungen
  if (preferences.priceMax && therapist.priceMin) {
    if (therapist.priceMin <= preferences.priceMax) {
      items.push({
        text: 'Preislich im Budget',
        priority: 4,
        type: 'secondary',
      })
    } else {
      items.push({
        text: 'Möglicherweise über Budget',
        priority: 2,
        type: 'warning',
      })
    }
  }

  // Versicherungs-Erklärungen
  if (preferences.insuranceType !== 'ANY' && therapist.acceptedInsurance) {
    const hasInsurance = checkInsuranceMatch(therapist, preferences)
    if (hasInsurance) {
      items.push({
        text: 'Akzeptiert Ihre Versicherung',
        priority: 5,
        type: 'secondary',
      })
    }
  }

  // Items sortieren und aufteilen
  items.sort((a, b) => b.priority - a.priority)

  const primary = items
    .filter(i => i.type === 'primary')
    .slice(0, 3)
    .map(i => i.text)

  const secondary = items
    .filter(i => i.type === 'secondary')
    .slice(0, 4)
    .map(i => i.text)

  const warnings = items
    .filter(i => i.type === 'warning')
    .map(i => i.text)

  // Sicherstellen, dass wir mindestens einen Hauptgrund haben
  if (primary.length === 0 && secondary.length > 0) {
    primary.push(secondary.shift()!)
  }

  return {
    primary,
    secondary,
    warnings: warnings.length > 0 ? warnings : undefined,
  }
}

// Hilfsfunktion: Passende Spezialisierungen finden
function getMatchedSpecialties(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput
): string[] {
  const therapistSpecs = therapist.specialties || []
  const matched: string[] = []

  for (const spec of therapistSpecs) {
    const specLower = spec.toLowerCase()
    for (const area of preferences.problemAreas) {
      const areaLower = area.toLowerCase()
      if (specLower.includes(areaLower) || areaLower.includes(specLower)) {
        matched.push(spec)
        break
      }
    }
  }

  return [...new Set(matched)] // Duplikate entfernen
}

// Hilfsfunktion: Passende Sprachen finden
function getMatchedLanguages(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput
): string[] {
  const therapistLangs = (therapist.languages || []).map(l => l.toLowerCase())

  return preferences.languages.filter(lang =>
    therapistLangs.includes(lang.toLowerCase())
  )
}

// Hilfsfunktion: Versicherungs-Match prüfen
function checkInsuranceMatch(
  therapist: TherapistForMatching,
  preferences: MatchingPreferencesInput
): boolean {
  if (preferences.insuranceType === 'ANY') return true
  if (!therapist.acceptedInsurance || therapist.acceptedInsurance.length === 0) {
    return preferences.insuranceType === 'SELF_PAY' && therapist.privatePractice
  }

  const insuranceMap: Record<string, string[]> = {
    'PUBLIC': ['gesetzlich', 'öffentlich', 'krankenkasse', 'gkk', 'ögk', 'bva', 'svs'],
    'PRIVATE': ['privat', 'private'],
    'SELF_PAY': ['selbstzahler', 'privat'],
  }

  const keywords = insuranceMap[preferences.insuranceType] || []
  const therapistInsLower = therapist.acceptedInsurance.map(i => i.toLowerCase())

  return keywords.some(kw =>
    therapistInsLower.some(ins => ins.includes(kw))
  )
}

// Kurze Zusammenfassung generieren (für Listen-Ansicht)
export function generateShortExplanation(explanation: MatchExplanation): string {
  if (explanation.primary.length > 0) {
    return explanation.primary[0]
  }
  if (explanation.secondary.length > 0) {
    return explanation.secondary[0]
  }
  return 'Passender Therapeut'
}
