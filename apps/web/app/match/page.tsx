'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Brain,
  MapPin,
  Ruler,
  Globe,
  Wallet,
  Clock,
  User,
  MessageCircle,
  Euro,
  Lock,
  Search,
  Video,
  Building,
  RefreshCw,
  Sparkles,
  Check,
  Hospital,
  Briefcase,
  CreditCard,
  Zap,
  Flower2,
} from 'lucide-react'
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-stone-50/20">
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4 sm:mb-6">
            <Brain className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 px-2">
            Finden Sie Ihren Therapeuten
          </h1>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Beantworten Sie ein paar Fragen und wir finden die passenden Therapeut:innen für Sie.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-8 sm:mb-10">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%` }}
            />
          </div>
          <div className="flex justify-between relative">
            {STEPS.map((step) => (
              <div
                key={step.id}
                className="flex flex-col items-center flex-1"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-semibold shadow-md transition-all duration-300 ${
                    step.id < currentStep
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white scale-100'
                      : step.id === currentStep
                        ? 'bg-white text-amber-600 ring-4 ring-amber-100 scale-110'
                        : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {step.id < currentStep ? '✓' : step.id}
                </div>
                <div className={`mt-2 text-[10px] sm:text-xs font-medium text-center px-1 transition-colors ${
                  step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 lg:p-10">
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
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Was beschäftigt Sie?</h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Wählen Sie ein oder mehrere Bereiche aus, in denen Sie Unterstützung suchen.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PROBLEM_AREAS.map((area) => (
                      <button
                        key={area.id}
                        onClick={() => toggleArrayItem('problemAreas', area.id)}
                        className={`group relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          formData.problemAreas.includes(area.id)
                            ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md scale-[1.02]'
                            : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm hover:scale-[1.01]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                            formData.problemAreas.includes(area.id)
                              ? 'bg-white shadow-sm'
                              : 'bg-gray-50 group-hover:bg-amber-50'
                          }`}>
                            <span className="text-2xl">{area.icon}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-sm font-semibold text-gray-900 block leading-tight">{area.label}</span>
                          </div>
                          {formData.problemAreas.includes(area.id) && (
                            <div className="absolute top-2 right-2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Schritt 2: Standort & Format */}
              {currentStep === 2 && (
                <div>
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      Wo und wie möchten Sie therapiert werden?
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Wählen Sie Ihr bevorzugtes Format und ggf. Ihren Standort.
                    </p>
                  </div>

                  {/* Format-Auswahl */}
                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Therapieformat
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'BOTH', label: 'Beides', Icon: RefreshCw, desc: 'Flexibel' },
                        { id: 'IN_PERSON', label: 'Präsenz', Icon: Building, desc: 'Vor Ort' },
                        { id: 'ONLINE', label: 'Online', Icon: Video, desc: 'Digital' },
                      ].map((format) => (
                        <button
                          key={format.id}
                          onClick={() => updateForm({ format: format.id as WizardFormData['format'] })}
                          className={`group p-4 rounded-xl border-2 text-center transition-all duration-200 ${
                            formData.format === format.id
                              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center transition-all ${
                            formData.format === format.id
                              ? 'bg-white shadow-sm'
                              : 'bg-gray-50 group-hover:bg-amber-50'
                          }`}>
                            <format.Icon className={`w-6 h-6 ${formData.format === format.id ? 'text-amber-600' : 'text-gray-600'}`} strokeWidth={2} />
                          </div>
                          <div className="text-sm font-semibold text-gray-900">{format.label}</div>
                          <div className="text-xs text-gray-500 mt-0.5">{format.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Standort (nur wenn nicht rein Online) */}
                  {formData.format !== 'ONLINE' && (
                    <>
                      <div className="mb-6">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                          <MapPin className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                          PLZ oder Stadt
                        </label>
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
                          className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all"
                        />
                      </div>

                      {/* Umkreis */}
                      <div className="bg-gray-50 rounded-xl p-4">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                          <Ruler className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                          Maximale Entfernung: <span className="text-amber-600">{formData.maxDistanceKm} km</span>
                        </label>
                        <input
                          type="range"
                          min="5"
                          max="100"
                          step="5"
                          value={formData.maxDistanceKm}
                          onChange={(e) => updateForm({ maxDistanceKm: parseInt(e.target.value) })}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
                          <span>5 km</span>
                          <span>50 km</span>
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
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Ihre Präferenzen</h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Helfen Sie uns, die passenden Therapeut:innen zu finden.
                    </p>
                  </div>

                  {/* Sprachen */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <Globe className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                      Sprache(n)
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.id}
                          onClick={() => toggleArrayItem('languages', lang.id)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            formData.languages.includes(lang.id)
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                          }`}
                        >
                          {lang.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Versicherung */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <Wallet className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                      Kostenübernahme
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'ANY', label: 'Egal', Icon: Check },
                        { id: 'PUBLIC', label: 'Krankenkasse', Icon: Hospital },
                        { id: 'PRIVATE', label: 'Privat', Icon: Briefcase },
                        { id: 'SELF_PAY', label: 'Selbstzahler', Icon: CreditCard },
                      ].map((ins) => (
                        <button
                          key={ins.id}
                          onClick={() => updateForm({ insuranceType: ins.id as WizardFormData['insuranceType'] })}
                          className={`group p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            formData.insuranceType === ins.id
                              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-center h-8 mb-1">
                            <ins.Icon className={`w-5 h-5 ${formData.insuranceType === ins.id ? 'text-amber-600' : 'text-gray-600'}`} strokeWidth={2} />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{ins.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Wartezeit */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <Clock className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                      Maximale Wartezeit
                    </label>
                    <select
                      value={formData.maxWaitWeeks ?? ''}
                      onChange={(e) =>
                        updateForm({
                          maxWaitWeeks: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all bg-white"
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
                  <div className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Optionale Details</h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      Diese Angaben sind optional und helfen uns, noch bessere Matches zu finden.
                    </p>
                  </div>

                  {/* Therapiemethoden */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <Brain className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                      Bevorzugte Therapiemethoden <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {THERAPY_METHODS.map((method) => (
                        <button
                          key={method.id}
                          onClick={() => toggleArrayItem('preferredMethods', method.id)}
                          className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                            formData.preferredMethods.includes(method.id)
                              ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md scale-105'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                          }`}
                        >
                          {method.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Geschlecht */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <User className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                      Bevorzugtes Geschlecht <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'any', label: 'Egal', Icon: Check },
                        { id: 'female', label: 'Weiblich', Icon: User },
                        { id: 'male', label: 'Männlich', Icon: User },
                      ].map((gender) => (
                        <button
                          key={gender.id}
                          onClick={() => updateForm({ therapistGender: gender.id as WizardFormData['therapistGender'] })}
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            formData.therapistGender === gender.id
                              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-center h-8 mb-1">
                            <gender.Icon className={`w-5 h-5 ${formData.therapistGender === gender.id ? 'text-amber-600' : 'text-gray-600'}`} strokeWidth={2} />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{gender.label}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Maximaler Preis */}
                  <div className="mb-6">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <Euro className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                      Maximaler Preis pro Sitzung <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="number"
                      value={formData.priceMax || ''}
                      onChange={(e) =>
                        updateForm({
                          priceMax: e.target.value ? parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="z.B. 120"
                      className="w-full px-4 py-3 text-base border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 transition-all"
                    />
                  </div>

                  {/* Kommunikationsstil */}
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-3">
                      <MessageCircle className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
                      Kommunikationsstil <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'ANY', label: 'Egal', Icon: Check },
                        { id: 'DIRECT', label: 'Direkt', Icon: Zap },
                        { id: 'GENTLE', label: 'Sanft', Icon: Flower2 },
                      ].map((style) => (
                        <button
                          key={style.id}
                          onClick={() => updateForm({ communicationStyle: style.id as WizardFormData['communicationStyle'] })}
                          className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                            formData.communicationStyle === style.id
                              ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-md'
                              : 'border-gray-200 bg-white hover:border-amber-300 hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-center justify-center h-8 mb-1">
                            <style.Icon className={`w-5 h-5 ${formData.communicationStyle === style.id ? 'text-amber-600' : 'text-gray-600'}`} strokeWidth={2} />
                          </div>
                          <div className="text-sm font-medium text-gray-900">{style.label}</div>
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
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-3">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <span className="break-words">{error}</span>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100 gap-3">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                currentStep === 1
                  ? 'text-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100 active:scale-95'
              }`}
            >
              ← Zurück
            </button>

            {currentStep < 4 ? (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  canProceed()
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-[1.02] active:scale-95'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                Weiter →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-base font-semibold shadow-lg shadow-amber-200 hover:shadow-xl hover:scale-[1.02] active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Suche läuft...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="w-5 h-5" strokeWidth={2.5} />
                    Therapeuten finden
                  </span>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Info Text */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-xl shadow-sm border border-gray-100">
            <Lock className="w-4 h-4 text-green-600" strokeWidth={2.5} />
            <p className="text-sm text-gray-600">
              Ihre Daten werden vertraulich behandelt und nach 30 Tagen gelöscht.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
