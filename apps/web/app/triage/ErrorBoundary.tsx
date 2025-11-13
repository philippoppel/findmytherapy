'use client'

import React, { Component, ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Mail } from 'lucide-react'
import { Button } from '@mental-health/ui'

type ErrorBoundaryProps = {
  children: ReactNode
  fallback?: ReactNode
}

type ErrorBoundaryState = {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

export class TriageErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Triage Error Boundary caught an error:', error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // You can also log the error to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
    // Reload the page to reset the app state
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback
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
              <h2 className="text-2xl font-bold text-default">Etwas ist schiefgelaufen</h2>
              <p className="text-sm text-muted">
                Es tut uns leid, aber bei der Durchführung der Ersteinschätzung ist ein Fehler aufgetreten.
              </p>
            </div>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-left">
                <p className="text-xs font-semibold text-red-900">Entwicklermodus - Fehlerdetails:</p>
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
                Seite neu laden
              </Button>

              <div className="text-xs text-muted">
                oder
              </div>

              <Button variant="outline" asChild className="w-full">
                <a href="/contact">
                  <Mail className="mr-2 h-4 w-4" aria-hidden />
                  Problem melden
                </a>
              </Button>
            </div>

            {/* Help Text */}
            <div className="mt-6 rounded-xl border border-primary-200 bg-primary-50 p-4">
              <p className="text-xs text-primary-900">
                <strong>Tipp:</strong> Wenn das Problem weiterhin besteht, versuche die Seite in einem privaten/Inkognito-Fenster zu öffnen oder deinen Browser-Cache zu leeren.
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
