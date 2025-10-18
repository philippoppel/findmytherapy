'use client'

import { Component, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4">
          <div className="max-w-md w-full rounded-3xl border border-divider bg-white p-8 shadow-lg text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full border-4 border-red-500 flex items-center justify-center">
              <span className="text-2xl text-red-500 font-bold">!</span>
            </div>
            <h1 className="text-2xl font-semibold text-default mb-2">
              Etwas ist schiefgelaufen
            </h1>
            <p className="text-sm text-muted mb-6">
              Es tut uns leid, aber ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder kontaktieren Sie unseren Support.
            </p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
              >
                Seite neu laden
              </button>
              <button
                onClick={() => (window.location.href = '/')}
                className="w-full rounded-full border border-divider px-6 py-3 text-sm font-semibold text-default transition hover:bg-neutral-50"
              >
                Zur Startseite
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-sm font-medium text-neutral-700 cursor-pointer">
                  Fehlerdetails (nur in Entwicklung)
                </summary>
                <pre className="mt-2 text-xs text-red-600 bg-red-50 p-4 rounded-lg overflow-auto">
                  {this.state.error.toString()}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
