# Wissenschaftliche Validierung der Adaptive Triage

## Zusammenfassung

Die adaptive Triage wurde wissenschaftlich korrekt implementiert gemäß **Option 1**:

- PHQ-2/GAD-2 Scores <3: **"Screening unauffällig"** - kein vollständiger Score wird berechnet
- PHQ-2/GAD-2 Scores ≥3: Vollständige PHQ-9/GAD-7 Fragebögen werden durchgeführt
- **Kein Padding mit Nullen** bei unvollständigen Fragebögen

---

## Problem: Vorherige Implementierung

### ❌ **Wissenschaftlich NICHT korrekt (vor dieser Änderung):**

```typescript
// FALSCH: Padding mit Nullen
const fullPHQ9Answers = [...answers.phq2, ...answers.phq9Expanded];
const fullGAD7Answers = [...answers.gad2, ...answers.gad7Expanded];

while (fullPHQ9Answers.length < 9) fullPHQ9Answers.push(0); // NICHT valide!
while (fullGAD7Answers.length < 7) fullGAD7Answers.push(0); // NICHT valide!
```

**Warum das falsch war:**

1. ✗ Fehlende Antworten wurden fälschlicherweise als 0 ("überhaupt nicht") angenommen
2. ✗ PHQ-2/GAD-2 sind **Screening-Tools**, keine vollständigen Assessments
3. ✗ Wichtige Symptome (z.B. Suizidgedanken in PHQ-9 Item 9) konnten übersehen werden
4. ✗ Der berechnete Score war systematisch zu niedrig und **nicht wissenschaftlich valide**

**Gefährliches Beispiel:**

```
Person:
- PHQ-2: Frage 1 = 0, Frage 2 = 2 → Score = 2 (< 3)
- Quiz endet hier
- ABER: Diese Person könnte bei Frage 9 (Suizidgedanken) einen hohen Score haben
- Die Frage wird NIE gestellt
- Frage 9 wird mit 0 gepadded
- **Suizidrisiko wird NICHT erkannt!**
```

---

## Lösung: Neue Implementierung

### ✅ **Wissenschaftlich korrekt (nach dieser Änderung):**

```typescript
const checkExpansionNeeded = () => {
  const { needsFullPHQ9, needsFullGAD7, phq2Score, gad2Score } = adaptiveFlow;

  if (needsFullPHQ9 || needsFullGAD7) {
    // Scores ≥3: Vollständiges Assessment durchführen
    setAssessmentType('full');
    setCurrentPhase('expanded');
    setExpandedSections({ phq9: needsFullPHQ9, gad7: needsFullGAD7 });
  } else {
    // Scores <3: NUR Screening-Ergebnis anzeigen
    // KEIN Padding mit Nullen!
    setAssessmentType('screening');
    setScreeningResult({
      phq2Score,
      gad2Score,
      message: 'Screening unauffällig',
      interpretation:
        'Basierend auf validiertem Kurzscreening (PHQ-2/GAD-2) zeigen sich minimale Symptome.',
    });
  }
};
```

---

## Wissenschaftliche Grundlagen

### PHQ-2 (Patient Health Questionnaire-2)

**Validierung:**

- Sensitivität: **83%** für Major Depression
- Spezifität: **92%** für Major Depression
- Cutoff: **≥3** Punkte

**Quelle:**

- Kroenke, K., Spitzer, R. L., & Williams, J. B. (2003). The Patient Health Questionnaire-2: validity of a two-item depression screener. _Medical care_, 1284-1292.

### GAD-2 (Generalized Anxiety Disorder-2)

**Validierung:**

- Sensitivität: **86%** für Angststörungen
- Spezifität: **83%** für Angststörungen
- Cutoff: **≥3** Punkte

**Quelle:**

- Kroenke, K., Spitzer, R. L., Williams, J. B., Monahan, P. O., & Löwe, B. (2007). Anxiety disorders in primary care: prevalence, impairment, comorbidity, and detection. _Annals of internal medicine_, 146(5), 317-325.

---

## Implementierungs-Details

### 1. API-Route (`/api/triage`)

**Änderungen:**

- Discriminated Union für `assessmentType: 'screening' | 'full'`
- Separate Schemas für Screening-Only vs. Full Assessment
- Keine Datenpersistierung für Screening-Only (nur minimale Logs)

```typescript
// Schema for full assessment
const fullTriagePayloadSchema = z.object({
  assessmentType: z.literal('full'),
  phq9Answers: z.array(z.number().int().min(0).max(3)).length(9),
  gad7Answers: z.array(z.number().int().min(0).max(3)).length(7),
  // ...
});

// Schema for screening-only
const screeningOnlyPayloadSchema = z.object({
  assessmentType: z.literal('screening'),
  phq2Answers: z.array(z.number().int().min(0).max(3)).length(2),
  gad2Answers: z.array(z.number().int().min(0).max(3)).length(2),
  // ...
});
```

### 2. AdaptiveTriageFlow.tsx

**Änderungen:**

- Neue State-Variablen: `assessmentType`, `screeningResult`
- Separate Summary-Views für Screening vs. Full Assessment
- Validierung: Bei Full Assessment MUSS Array-Länge exakt sein (kein Padding!)

```typescript
// Verify we have complete answers (no padding!)
if (fullPHQ9Answers.length !== 9 || fullGAD7Answers.length !== 7) {
  throw new Error('Incomplete questionnaire data - this should not happen');
}
```

### 3. User Experience

**Screening-Only Ergebnis zeigt:**

- ✅ PHQ-2 und GAD-2 Scores
- ✅ Wissenschaftlicher Hinweis über Screening-Instrumente
- ✅ Option, trotzdem vollständiges Assessment durchzuführen
- ✅ Präventive Empfehlungen
- ✅ **KEINEN** falschen PHQ-9/GAD-7 Gesamtscore

**Full Assessment Ergebnis zeigt:**

- ✅ Vollständige PHQ-9 und GAD-7 Scores
- ✅ Ampel-Visualisierung
- ✅ Risikoeinschätzung
- ✅ Therapeuten-Empfehlungen
- ✅ Kurs-Empfehlungen

---

## Wissenschaftliche Korrektheit

| Szenario                 | Implementierung                                               | Wissenschaftlich korrekt?               |
| ------------------------ | ------------------------------------------------------------- | --------------------------------------- |
| **PHQ-2/GAD-2 Score ≥3** | Vollständige PHQ-9/GAD-7 durchführen                          | ✅ Ja                                   |
| **PHQ-2/GAD-2 Score <3** | Nur Screening-Ergebnis anzeigen, **kein** vollständiger Score | ✅ Ja                                   |
| **Vorherige Version**    | Score mit Nullen padden                                       | ❌ Nein - wissenschaftlich nicht valide |

---

## Nutzerperspektive

### Szenario 1: Screening unauffällig (Score <3)

**Nutzer sieht:**

```
✅ Screening unauffällig

Dein Screening-Ergebnis
Basierend auf dem validierten Kurzscreening (PHQ-2/GAD-2) zeigen sich aktuell minimale Symptome.

📘 Wissenschaftlicher Hinweis
PHQ-2 und GAD-2 sind validierte Screening-Instrumente mit hoher Sensitivität.
Da deine Scores unter dem Schwellenwert von 3 liegen, wurde das vollständige Assessment nicht durchgeführt.

⚠️ Wichtig: Ein unauffälliges Screening bedeutet nicht zwingend, dass keine Symptome vorliegen.
Falls du trotzdem Unterstützung suchst, kannst du das vollständige Assessment durchführen.

[Button: Vollständiges Assessment durchführen]
```

### Szenario 2: Screening auffällig (Score ≥3)

**Nutzer wird automatisch weitergeleitet zu:**

- Fragen 3-9 des PHQ-9 (wenn PHQ-2 ≥3)
- Fragen 3-7 des GAD-7 (wenn GAD-2 ≥3)
- Anschließend: Vollständiger Score und Empfehlungen

---

## Deployment & Testing

### Build Status

✅ Build erfolgreich (`pnpm build`)
✅ TypeScript-Kompilierung erfolgreich
✅ Keine breaking changes

### Zu testen:

1. Screening-Pfad (PHQ-2 Score = 0-2, GAD-2 Score = 0-2)
2. Expansion-Pfad (PHQ-2 Score ≥3 oder GAD-2 Score ≥3)
3. Option "Vollständiges Assessment durchführen" aus Screening-Ergebnis
4. API-Response für beide Typen
5. Analytics-Tracking für beide Pfade

---

## Referenzen

1. **Kroenke, K., Spitzer, R. L., & Williams, J. B. (2001).** The PHQ-9: validity of a brief depression severity measure. _Journal of general internal medicine_, 16(9), 606-613.

2. **Kroenke, K., Spitzer, R. L., & Williams, J. B. (2003).** The Patient Health Questionnaire-2: validity of a two-item depression screener. _Medical care_, 1284-1292.

3. **Spitzer, R. L., Kroenke, K., Williams, J. B., & Löwe, B. (2006).** A brief measure for assessing generalized anxiety disorder: the GAD-7. _Archives of internal medicine_, 166(10), 1092-1097.

4. **Kroenke, K., Spitzer, R. L., Williams, J. B., Monahan, P. O., & Löwe, B. (2007).** Anxiety disorders in primary care: prevalence, impairment, comorbidity, and detection. _Annals of internal medicine_, 146(5), 317-325.

5. **Löwe, B., Decker, O., Müller, S., et al. (2008).** Validation and standardization of the Generalized Anxiety Disorder Screener (GAD-7) in the general population. _Medical care_, 46(3), 266-274.

---

## Fazit

✅ Die adaptive Triage ist nun **wissenschaftlich fundiert und korrekt** implementiert.

✅ Es werden **keine falschen Scores** mehr durch Null-Padding generiert.

✅ Die Implementierung folgt den **validierten Cutoff-Werten** der wissenschaftlichen Literatur.

✅ Nutzer erhalten **transparente Information** über die Art des durchgeführten Assessments.

✅ Die Option für ein vollständiges Assessment bleibt **jederzeit verfügbar**.
