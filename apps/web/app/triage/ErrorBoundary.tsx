'use client';

import React, { Component, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Mail } from 'lucide-react';
import { Button } from '@mental-health/ui';
import { useTranslation } from '@/lib/i18n';

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
  translations?: {
    title: string;
    description: string;
    devMode: string;
    reloadPage: string;
    or: string;
    reportProblem: string;
    tip: string;
    tipText: string;
  };
};

type ErrorBoundaryState = {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
};

class TriageErrorBoundaryInner extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Triage Error Boundary caught an error:', error, errorInfo);

    this.setState({
      error,
      errorInfo,
    });

    // You can also log the error to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
    // Reload the page to reset the app state
    window.location.reload();
  };

  render() {
    const { translations } = this.props;
    const t = translations || {
      title: 'Etwas ist schiefgelaufen',
      description: 'Es tut uns leid, aber bei der Durchführung der Ersteinschätzung ist ein Fehler aufgetreten.',
      devMode: 'Entwicklermodus - Fehlerdetails:',
      reloadPage: 'Seite neu laden',
      or: 'oder',
      reportProblem: 'Problem melden',
      tip: 'Tipp:',
      tipText: 'Wenn das Problem weiterhin besteht, versuche die Seite in einem privaten/Inkognito-Fenster zu öffnen oder deinen Browser-Cache zu leeren.',
    };

    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="rounded-3xl border border-divider bg-white/90 p-8 shadow-lg">
          <div className="mx-auto max-w-md space-y-6 text-center">
            {/* Error Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-8 w-8 text-red-600" aria-hidden />
            </div>

            {/* Error Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-default">{t.title}</h2>
              <p className="text-sm text-muted">
                {t.description}
              </p>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-left">
                <p className="text-xs font-semibold text-red-900">
                  {t.devMode}
                </p>
                <pre className="mt-2 overflow-auto text-xs text-red-800">
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-3">
              <Button onClick={this.handleReset} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
                {t.reloadPage}
              </Button>

              <div className="text-xs text-muted">{t.or}</div>

              <Button variant="outline" asChild className="w-full">
                <a href="/contact">
                  <Mail className="mr-2 h-4 w-4" aria-hidden />
                  {t.reportProblem}
                </a>
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-4">
              <p className="text-xs text-primary-900">
                <strong>{t.tip}</strong> {t.tipText}
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper component that provides translations via hook
export function TriageErrorBoundary({ children, fallback }: Omit<ErrorBoundaryProps, 'translations'>) {
  const { t } = useTranslation();

  const translations = {
    title: t('errorBoundary.somethingWentWrong'),
    description: t('errorBoundary.assessmentError'),
    devMode: t('errorBoundary.devModeError'),
    reloadPage: t('errorBoundary.reloadPage'),
    or: t('errorBoundary.or'),
    reportProblem: t('errorBoundary.reportProblem'),
    tip: t('errorBoundary.tip'),
    tipText: t('errorBoundary.persistentProblem'),
  };

  return (
    <TriageErrorBoundaryInner translations={translations} fallback={fallback}>
      {children}
    </TriageErrorBoundaryInner>
  );
}
