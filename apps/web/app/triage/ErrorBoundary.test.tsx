/**
 * Error Boundary Tests
 * Tests error handling and fallback UI
 */

import { render, screen, fireEvent } from '@testing-library/react'
import { TriageErrorBoundary } from './ErrorBoundary'

// Component that throws an error
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>Working component</div>
}

// Suppress console errors during tests
const originalError = console.error
beforeAll(() => {
  console.error = jest.fn()
})

afterAll(() => {
  console.error = originalError
})

describe('TriageErrorBoundary', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render children when there is no error', () => {
    render(
      <TriageErrorBoundary>
        <div>Test content</div>
      </TriageErrorBoundary>
    )

    expect(screen.getByText('Test content')).toBeInTheDocument()
  })

  it('should render error UI when child component throws', () => {
    render(
      <TriageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </TriageErrorBoundary>
    )

    expect(screen.getByText(/etwas ist schiefgelaufen/i)).toBeInTheDocument()
    expect(screen.getByText(/fehler aufgetreten/i)).toBeInTheDocument()
  })

  it('should show reload button in error state', () => {
    render(
      <TriageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </TriageErrorBoundary>
    )

    const reloadButton = screen.getByRole('button', { name: /seite neu laden/i })
    expect(reloadButton).toBeInTheDocument()
  })

  it('should show problem reporting link', () => {
    render(
      <TriageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </TriageErrorBoundary>
    )

    const reportLink = screen.getByRole('link', { name: /problem melden/i })
    expect(reportLink).toBeInTheDocument()
    expect(reportLink).toHaveAttribute('href', '/contact')
  })

  it('should show help text with troubleshooting tips', () => {
    render(
      <TriageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </TriageErrorBoundary>
    )

    expect(screen.getByText(/tipp:/i)).toBeInTheDocument()
    expect(screen.getByText(/browser-cache/i)).toBeInTheDocument()
  })

  it('should render custom fallback if provided', () => {
    const customFallback = <div>Custom error message</div>

    render(
      <TriageErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </TriageErrorBoundary>
    )

    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText(/etwas ist schiefgelaufen/i)).not.toBeInTheDocument()
  })

  it('should reload page when reset button is clicked', () => {
    // Mock window.location.reload
    delete (window as any).location
    window.location = { reload: jest.fn() } as any

    render(
      <TriageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </TriageErrorBoundary>
    )

    const reloadButton = screen.getByRole('button', { name: /seite neu laden/i })
    fireEvent.click(reloadButton)

    expect(window.location.reload).toHaveBeenCalled()
  })

  it('should display error icon', () => {
    const { container } = render(
      <TriageErrorBoundary>
        <ThrowError shouldThrow={true} />
      </TriageErrorBoundary>
    )

    // Check for error icon container
    const errorIconContainer = container.querySelector('.bg-red-100')
    expect(errorIconContainer).toBeInTheDocument()
  })

  describe('Development Mode', () => {
    const originalEnv = process.env.NODE_ENV

    afterEach(() => {
      process.env.NODE_ENV = originalEnv
    })

    it('should show error details in development mode', () => {
      process.env.NODE_ENV = 'development'

      render(
        <TriageErrorBoundary>
          <ThrowError shouldThrow={true} />
        </TriageErrorBoundary>
      )

      expect(screen.getByText(/entwicklermodus - fehlerdetails:/i)).toBeInTheDocument()
      expect(screen.getByText(/test error/i)).toBeInTheDocument()
    })

    it('should NOT show error details in production mode', () => {
      process.env.NODE_ENV = 'production'

      render(
        <TriageErrorBoundary>
          <ThrowError shouldThrow={true} />
        </TriageErrorBoundary>
      )

      expect(screen.queryByText(/entwicklermodus/i)).not.toBeInTheDocument()
    })
  })
})
