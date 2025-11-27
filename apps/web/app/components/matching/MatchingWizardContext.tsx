'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { MatchingResponse } from '@/lib/matching';
import type { WizardFormData } from '@/app/match/components/types';

interface MatchingWizardContextType {
  isOpen: boolean;
  openWizard: () => void;
  closeWizard: () => void;
  results: MatchingResponse | null;
  setResults: (results: MatchingResponse | null) => void;
  formData: WizardFormData | null;
  setFormData: (data: WizardFormData | null) => void;
  showResults: boolean;
  setShowResults: (show: boolean) => void;
}

const MatchingWizardContext = createContext<MatchingWizardContextType | undefined>(undefined);

export function MatchingWizardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<MatchingResponse | null>(null);
  const [formData, setFormData] = useState<WizardFormData | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Auto-open wizard if URL has ?matching=true (without useSearchParams to avoid Suspense)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('matching') === 'true') {
      setIsOpen(true);
      setShowResults(false);
      setResults(null);
      // Scroll to wizard after brief delay
      setTimeout(() => {
        const wizardElement = document.getElementById('matching-wizard');
        if (wizardElement) {
          wizardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  const openWizard = () => {
    setIsOpen(true);
    setShowResults(false);
    setResults(null);
  };

  const closeWizard = () => {
    setIsOpen(false);
    setShowResults(false);
    // Don't clear results/formData immediately to allow for animations
    setTimeout(() => {
      setResults(null);
      setFormData(null);
    }, 300);
  };

  return (
    <MatchingWizardContext.Provider
      value={{
        isOpen,
        openWizard,
        closeWizard,
        results,
        setResults,
        formData,
        setFormData,
        showResults,
        setShowResults,
      }}
    >
      {children}
    </MatchingWizardContext.Provider>
  );
}

export function useMatchingWizard() {
  const context = useContext(MatchingWizardContext);
  if (context === undefined) {
    throw new Error('useMatchingWizard must be used within a MatchingWizardProvider');
  }
  return context;
}
