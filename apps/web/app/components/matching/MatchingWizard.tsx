'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Wallet, Search, Lock, X, Check, Heart, Briefcase, CreditCard } from 'lucide-react';
import {
  WizardFormData,
  defaultFormData,
  PROBLEM_AREAS,
  FORMAT_OPTIONS,
  LANGUAGES,
} from './types';
import { useMatchingWizard } from './MatchingWizardContext';

// Vereinfachte 3 Schritte
const STEPS = [
  { id: 1, title: 'Thema', description: 'Was beschäftigt dich?' },
  { id: 2, title: 'Format', description: 'Wie möchtest du?' },
  { id: 3, title: 'Details', description: 'Fast geschafft' },
];

export function MatchingWizard() {
  const {
    isOpen,
    closeWizard,
    setResults,
    setFormData: setContextFormData,
    setShowResults,
    showResults,
  } = useMatchingWizard();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(defaultFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateForm = (updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const toggleArrayItem = (field: keyof WizardFormData, item: string) => {
    const current = formData[field] as string[];
    const updated = current.includes(item) ? current.filter((i) => i !== item) : [...current, item];
    updateForm({ [field]: updated });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const resetWizard = () => {
    setCurrentStep(1);
    setFormData(defaultFormData);
    setError(null);
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

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
          limit: 10,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Fehler beim Matching (${response.status})`);
      }

      const result = await response.json();
      setResults(result);
      setContextFormData(formData);
      setShowResults(true);
      resetWizard();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten';
      console.error('Matching error:', errorMessage, err);
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.problemAreas.length > 0;
      case 2:
        return (
          formData.format === 'ONLINE' ||
          formData.postalCode.length >= 4 ||
          formData.city.length >= 2
        );
      case 3:
        return formData.languages.length > 0;
      default:
        return false;
    }
  };

  const handleClose = () => {
    resetWizard();
    closeWizard();
  };

  if (!isOpen || showResults) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full overflow-hidden"
        id="matching-wizard"
      >
        <div className="py-8 sm:py-12">
          <div className="mx-auto max-w-[1200px] px-2 sm:px-3 lg:px-4">
            {/* Header */}
            <div className="relative mb-8 text-center">
              <button
                onClick={handleClose}
                className="absolute right-0 top-0 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                aria-label="Schließen"
              >
                <X className="h-6 w-6" />
              </button>

              <h2 className="mb-2 text-2xl font-bold text-neutral-900 sm:text-3xl">
                {STEPS[currentStep - 1].description}
              </h2>
              <p className="text-muted" role="status" aria-live="polite" aria-atomic="true">
                Schritt {currentStep} von {STEPS.length}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-xl border-2 border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {/* Progress */}
            <div className="mb-8" role="progressbar" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Fortschritt: Schritt ${currentStep} von ${STEPS.length}`}>
              <div className="h-2 overflow-hidden rounded-full bg-neutral-200">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-primary-600"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            {/* Form Card */}
            <div className="rounded-3xl border border-neutral-200/60 bg-white p-6 shadow-xl sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Schritt 1: Themen mit Bildern */}
                  {currentStep === 1 && (
                    <div>
                      <p className="mb-6 text-center text-muted">
                        Wähle alle Themen aus, die auf dich zutreffen
                      </p>
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                        {PROBLEM_AREAS.map((area) => {
                          const isSelected = formData.problemAreas.includes(area.id);
                          return (
                            <button
                              key={area.id}
                              onClick={() => toggleArrayItem('problemAreas', area.id)}
                              className="group relative overflow-hidden rounded-2xl transition-all duration-200"
                            >
                              <div
                                className={`relative aspect-[4/3] overflow-hidden rounded-2xl border-2 transition-all ${
                                  isSelected
                                    ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                                    : 'border-transparent hover:border-primary-300'
                                }`}
                              >
                                <Image
                                  src={area.image}
                                  alt=""
                                  fill
                                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
                                  className={`object-cover transition-transform duration-300 ${
                                    isSelected ? 'scale-110' : 'group-hover:scale-105'
                                  }`}
                                />
                                {/* Overlay */}
                                <div
                                  className={`absolute inset-0 transition-all ${
                                    isSelected
                                      ? 'bg-primary-600/40'
                                      : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'
                                  }`}
                                />
                                {/* Label */}
                                <div className="absolute inset-x-0 bottom-0 p-3">
                                  <span className="text-sm font-semibold text-white drop-shadow-lg">
                                    {area.label}
                                  </span>
                                </div>
                                {/* Checkmark */}
                                {isSelected && (
                                  <div className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-lg">
                                    <Check className="h-4 w-4 text-primary-600" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Schritt 2: Format mit Bildern */}
                  {currentStep === 2 && (
                    <div>
                      <p className="mb-6 text-center text-muted">
                        Wie möchtest du deine Therapie machen?
                      </p>

                      {/* Format-Auswahl */}
                      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        {FORMAT_OPTIONS.map((format) => {
                          const isSelected = formData.format === format.id;
                          return (
                            <button
                              key={format.id}
                              onClick={() =>
                                updateForm({ format: format.id as WizardFormData['format'] })
                              }
                              className="group relative overflow-hidden rounded-2xl transition-all duration-200"
                            >
                              <div
                                className={`relative aspect-[4/3] overflow-hidden rounded-2xl border-2 transition-all ${
                                  isSelected
                                    ? 'border-primary-500 shadow-lg shadow-primary-500/20'
                                    : 'border-transparent hover:border-primary-300'
                                }`}
                              >
                                <Image
                                  src={format.image}
                                  alt=""
                                  fill
                                  sizes="(min-width: 640px) 33vw, 100vw"
                                  className={`object-cover transition-transform duration-300 ${
                                    isSelected ? 'scale-110' : 'group-hover:scale-105'
                                  }`}
                                />
                                <div
                                  className={`absolute inset-0 transition-all ${
                                    isSelected
                                      ? 'bg-primary-600/40'
                                      : 'bg-gradient-to-t from-black/60 via-black/20 to-transparent'
                                  }`}
                                />
                                <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                                  <span className="block text-lg font-bold text-white drop-shadow-lg">
                                    {format.label}
                                  </span>
                                  <span className="text-sm text-white/80">{format.desc}</span>
                                </div>
                                {isSelected && (
                                  <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg">
                                    <Check className="h-5 w-5 text-primary-600" />
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </div>

                      {/* Standort (nur wenn nicht rein Online) */}
                      {formData.format !== 'ONLINE' && (
                        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6">
                          <label htmlFor="location-input" className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                            <MapPin className="h-4 w-4 text-primary-600" />
                            Wo suchst du?
                          </label>
                          <input
                            id="location-input"
                            type="text"
                            value={formData.postalCode || formData.city}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (/^\d+$/.test(value)) {
                                updateForm({ postalCode: value, city: '' });
                              } else {
                                updateForm({ city: value, postalCode: '' });
                              }
                            }}
                            placeholder="PLZ oder Stadt eingeben"
                            className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3 text-base transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
                          />
                          <p className="mt-3 text-sm text-muted">
                            Umkreis: <span className="font-medium">{formData.maxDistanceKm} km</span>
                            <input
                              type="range"
                              min="5"
                              max="100"
                              step="5"
                              value={formData.maxDistanceKm}
                              onChange={(e) =>
                                updateForm({ maxDistanceKm: parseInt(e.target.value) })
                              }
                              className="ml-4 inline-block w-32 cursor-pointer accent-primary-500"
                            />
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Schritt 3: Details (vereinfacht) */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      {/* Sprachen */}
                      <div role="group" aria-labelledby="language-label">
                        <div id="language-label" className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                          <Globe className="h-4 w-4 text-primary-600" />
                          In welcher Sprache?
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {LANGUAGES.map((lang) => {
                            const isSelected = formData.languages.includes(lang.id);
                            return (
                              <button
                                key={lang.id}
                                onClick={() => toggleArrayItem('languages', lang.id)}
                                className={`rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
                                  isSelected
                                    ? 'bg-primary-600 text-white shadow-md'
                                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                                }`}
                              >
                                {lang.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Versicherung */}
                      <div role="group" aria-labelledby="insurance-label">
                        <div id="insurance-label" className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-900">
                          <Wallet className="h-4 w-4 text-primary-600" />
                          Kostenübernahme
                        </div>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {[
                            { id: 'ANY', label: 'Egal', Icon: Check },
                            { id: 'PUBLIC', label: 'Kasse', Icon: Heart },
                            { id: 'PRIVATE', label: 'Privat', Icon: Briefcase },
                            { id: 'SELF_PAY', label: 'Selbst', Icon: CreditCard },
                          ].map((ins) => {
                            const isSelected = formData.insuranceType === ins.id;
                            return (
                              <button
                                key={ins.id}
                                onClick={() =>
                                  updateForm({
                                    insuranceType: ins.id as WizardFormData['insuranceType'],
                                  })
                                }
                                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                                  isSelected
                                    ? 'border-primary-500 bg-primary-50 shadow-md'
                                    : 'border-neutral-200 bg-white hover:border-primary-300'
                                }`}
                              >
                                <ins.Icon
                                  className={`h-5 w-5 ${isSelected ? 'text-primary-600' : 'text-neutral-500'}`}
                                />
                                <span
                                  className={`text-sm font-medium ${isSelected ? 'text-primary-700' : 'text-neutral-700'}`}
                                >
                                  {ins.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="mt-8 flex justify-between gap-3 border-t border-neutral-100 pt-6">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`rounded-xl px-6 py-3 text-base font-semibold transition-all ${
                    currentStep === 1
                      ? 'cursor-not-allowed text-neutral-300'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  ← Zurück
                </button>

                {currentStep < 3 ? (
                  <button
                    onClick={nextStep}
                    disabled={!canProceed()}
                    className={`rounded-xl px-8 py-3 text-base font-semibold transition-all ${
                      canProceed()
                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700'
                        : 'cursor-not-allowed bg-neutral-200 text-neutral-400'
                    }`}
                  >
                    Weiter →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !canProceed()}
                    className="flex items-center gap-2 rounded-xl bg-primary-600 px-8 py-3 text-base font-semibold text-white shadow-lg shadow-primary-600/30 transition-all hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Suche läuft...
                      </>
                    ) : (
                      <>
                        <Search className="h-5 w-5" />
                        Ergebnisse anzeigen
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Privacy note */}
            <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted">
              <Lock className="h-4 w-4" />
              Deine Daten werden vertraulich behandelt
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
