'use client';

import { ReactNode } from 'react';
import { useMatchingWizard } from './MatchingWizardContext';

interface MatchingLinkProps {
  href?: string;
  children: ReactNode;
  className?: string;
  onClick?: (event: React.MouseEvent) => void;
}

/**
 * Link component for matching navigation
 * Opens the inline matching wizard instead of navigating to a separate page
 */
export function MatchingLink({ children, className, onClick }: MatchingLinkProps) {
  const { openWizard } = useMatchingWizard();

  const handleClick = (event: React.MouseEvent) => {
    event.preventDefault();

    if (onClick) {
      onClick(event);
    }

    // Open the wizard
    openWizard();

    // Smooth scroll to the wizard after a brief delay to allow for expansion
    setTimeout(() => {
      const wizardElement = document.getElementById('matching-wizard');
      if (wizardElement) {
        wizardElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  );
}
