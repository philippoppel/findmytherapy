'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  WizardFormData,
  defaultFormData,
  PROBLEM_AREAS,
  THERAPY_METHODS,
  LANGUAGES,
  WAIT_TIME_OPTIONS,
} from './components/types'

// Wizard-Schritte
const STEPS = [
  { id: 1, title: 'Anliegen', description: 'Was beschäftigt Sie?' },
  { id: 2, title: 'Standort', description: 'Wo suchen Sie?' },
  { id: 3, title: 'Präferenzen', description: 'Ihre Wünsche' },
  { id: 4, title: 'Details', description: 'Optionale Angaben' },
]

export default function MatchPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<WizardFormData>(defaultFormData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Form-Update-Handler
  const updateForm = (updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  // Toggle für Array-Felder
  const toggleArrayItem = (field: keyof WizardFormData, item: string) => {
    const current = formData[field] as string[]
    const updated = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item]
    updateForm({ [field]: updated })
  }

  // Weiter zum nächsten Schritt
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Zurück zum vorherigen Schritt
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Formular absenden
  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problemAreas: formData.problemAreas,
          languages: formData.languages,
          insuranceType: formData.insuranceType,
          format: formData.format,
          maxDistanceKm: formData.format !== 'ONLINE' ? formData.maxDistanceKm : undefined,
          latitude: formData.latitude,
          longitude: formData.longitude,
          postalCode: formData.postalCode || undefined,
          city: formData.city || undefined,
          maxWaitWeeks: formData.maxWaitWeeks,
          preferredMethods: formData.preferredMethods.length > 0 ? formData.preferredMethods : undefined,
          therapistGender: formData.therapistGender !== 'any' ? formData.therapistGender : undefined,
          communicationStyle: formData.communicationStyle !== 'ANY' ? formData.communicationStyle : undefined,
          priceMax: formData.priceMax ? formData.priceMax * 100 : undefined, // Euro zu Cent
          limit: 10,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Fehler beim Matching')
      }

      const result = await response.json()

      // Ergebnisse in Session Storage speichern und zur Ergebnisseite navigieren
      sessionStorage.setItem('matchResults', JSON.stringify(result))
      sessionStorage.setItem('matchPreferences', JSON.stringify(formData))
      router.push('/match/results')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten')
    } finally {
      setIsLoading(false)
    }
  }

  // Validierung für "Weiter"-Button
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.problemAreas.length > 0
      case 2:
        return formData.format === 'ONLINE' || formData.postalCode.length >= 4 || formData.city.length >= 2
      case 3:
        return formData.languages.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Finden Sie Ihren Therapeuten
          </h1>
          <p className="text-gray-600">
            Beantworten Sie ein paar Fragen und wir finden die passenden Therapeut:innen für Sie.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between mb-8">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex-1 text-center ${
                step.id < currentStep
                  ? 'text-primary-600'
                  : step.id === currentStep
                    ? 'text-primary-600'
                    : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-medium ${
                  step.id < currentStep
                    ? 'bg-primary-600 text-white'
                    : step.id === currentStep
                      ? 'bg-primary-100 text-primary-600 border-2 border-primary-600'
                      : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.id < currentStep ? '✓' : step.id}
              </div>
              <div className="mt-2 text-xs font-medium hidden sm:block">{step.title}</div>
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Schritt 1: Problemfelder */}
              {currentStep === 1 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Was beschäftigt Sie?</h2>
                  <p className="text-gray-600 mb-6">
                    Wählen Sie die Bereiche aus, in denen Sie Unterstützung suchen.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {PROBLEM_AREAS.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => toggleArrayItem('problemAreas', area.id)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.problemAreas.includes(area.id)
                            ? 'border-primary-600 bg-primary-50 text-primary-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="text-lg mr-2">{area.icon}</span>
                        <span className="text-sm font-medium">{area.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Schritt 2: Standort & Format */}
              {currentStep === 2 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Wo und wie möchten Sie therapiert werden?</h2>

                  {/* Format-Auswahl */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Therapieformat
                    </span>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'BOTH', label: 'Beides', icon: '🔄' },
                        { id: 'IN_PERSON', label: 'Präsenz', icon: '🏢' },
                        { id: 'ONLINE', label: 'Online', icon: '💻' },
                      ].map((format) => (
                        <button
                          key={format.id}
                          onClick={() => updateForm({ format: format.id as WizardFormData['format'] })}
                          className={`p-3 rounded-lg border-2 text-center transition-all ${
                            formData.format === format.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span className="text-xl block mb-1">{format.icon}</span>
                          <span className="text-sm font-medium">{format.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Standort (nur wenn nicht rein Online) */}
                  {formData.format !== 'ONLINE' && (
                    <>
                      <div className="mb-4">
                        <span className="block text-sm font-medium text-gray-700 mb-2">
                          PLZ oder Stadt
                        </span>
                        <input
                          type="text"
                          value={formData.postalCode || formData.city}
                          onChange={(e) => {
                            const value = e.target.value
                            if (/^\d+$/.test(value)) {
                              updateForm({ postalCode: value, city: '' })
                            } else {
                              updateForm({ city: value, postalCode: '' })
                            }
                          }}
                          placeholder="z.B. 1010 oder Wien"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                      </div>

                      {/* Umkreis */}
                      <div>
                        <span className="block text-sm font-medium text-gray-700 mb-2">
                          Maximale Entfernung: {formData.maxDistanceKm} km
                        </span>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="5"
                          value={formData.maxDistanceKm}
                          onChange={(e) => updateForm({ maxDistanceKm: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5 km</span>
                          <span>100 km</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Schritt 3: Präferenzen */}
              {currentStep === 3 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Ihre Präferenzen</h2>

                  {/* Sprachen */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Sprache(n)
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => toggleArrayItem('languages', lang.id)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            formData.languages.includes(lang.id)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Versicherung */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Kostenübernahme
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: 'ANY', label: 'Egal' },
                        { id: 'PUBLIC', label: 'Krankenkasse' },
                        { id: 'PRIVATE', label: 'Privat' },
                        { id: 'SELF_PAY', label: 'Selbstzahler' },
                      ].map((ins) => (
                        <button
                          key={ins.id}
                          onClick={() => updateForm({ insuranceType: ins.id as WizardFormData['insuranceType'] })}
                          className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                            formData.insuranceType === ins.id
                              ? 'border-primary-600 bg-primary-50 text-primary-700'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {ins.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wartezeit */}
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Maximale Wartezeit
                    </span>
                    <select
                      value={formData.maxWaitWeeks ?? ''}
                      onChange={(e) =>
                        updateForm({
                          maxWaitWeeks: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    >
                      {WAIT_TIME_OPTIONS.map((opt) => (
                        <option key={opt.label} value={opt.value ?? ''}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Schritt 4: Optionale Details */}
              {currentStep === 4 && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Optionale Details</h2>
                  <p className="text-gray-600 mb-6 text-sm">
                    Diese Angaben sind optional und helfen uns, noch bessere Matches zu finden.
                  </p>

                  {/* Therapiemethoden */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Bevorzugte Therapiemethoden
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {THERAPY_METHODS.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => toggleArrayItem('preferredMethods', method.id)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                            formData.preferredMethods.includes(method.id)
                              ? 'bg-primary-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Geschlecht */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Bevorzugtes Geschlecht
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'any', label: 'Egal' },
                        { id: 'female', label: 'Weiblich' },
                        { id: 'male', label: 'Männlich' },
                      ].map((gender) => (
                        <button
                          key={gender.id}
                          onClick={() => updateForm({ therapistGender: gender.id as WizardFormData['therapistGender'] })}
                          className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                            formData.therapistGender === gender.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {gender.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Maximaler Preis */}
                  <div className="mb-6">
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Maximaler Preis pro Sitzung (€)
                    </span>
                    <input
                      type="number"
                      value={formData.priceMax || ''}
                      onChange={(e) =>
                        updateForm({
                          priceMax: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="z.B. 120"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>

                  {/* Kommunikationsstil */}
                  <div>
                    <span className="block text-sm font-medium text-gray-700 mb-2">
                      Bevorzugter Kommunikationsstil
                    </span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'ANY', label: 'Egal' },
                        { id: 'DIRECT', label: 'Direkt' },
                        { id: 'GENTLE', label: 'Sanft' },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateForm({ communicationStyle: style.id as WizardFormData['communicationStyle'] })}
                          className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                            formData.communicationStyle === style.id
                              ? 'border-primary-600 bg-primary-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Zurück
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  canProceed()
                    ? 'bg-primary-600 text-white hover:bg-primary-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Weiter
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-all disabled:opacity-50"
              >
                {isLoading ? 'Suche läuft...' : 'Therapeuten finden'}
              </button>
            )}
          </div>
        </div>

        {/* Info Text */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Ihre Daten werden vertraulich behandelt und nach 30 Tagen gelöscht.
        </p>
      </div>
    </div>
  )
}
