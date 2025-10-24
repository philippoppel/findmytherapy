'use client'

import { useState, useRef, useEffect } from 'react'
import { Info, HelpCircle } from 'lucide-react'

type QuestionTooltipProps = {
  helpText?: string
  scientificContext?: string
  variant?: 'icon' | 'inline'
  className?: string
}

export function QuestionTooltip({
  helpText,
  scientificContext,
  variant = 'icon',
  className = '',
}: QuestionTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current &&
        buttonRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!helpText && !scientificContext) {
    return null
  }

  if (variant === 'inline') {
    return (
      <div className={`rounded-lg border border-blue-200 bg-blue-50 p-3 ${className}`}>
        <div className="flex items-start gap-2">
          <Info className="mt-0.5 h-4 w-4 flex-none text-blue-600" aria-hidden />
          <div className="flex-1 text-sm">
            {helpText && <p className="text-blue-900">{helpText}</p>}
            {scientificContext && (
              <p className="mt-1 text-xs text-blue-700">
                <span className="font-semibold">Hintergrund:</span> {scientificContext}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative inline-block ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex h-6 w-6 items-center justify-center rounded-full text-white/80 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950"
        aria-label="Mehr Informationen"
      >
        <HelpCircle className="h-4 w-4 text-white" aria-hidden />
      </button>

      {isOpen && (
        <div
          ref={tooltipRef}
          className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-divider bg-white p-4 shadow-xl sm:left-auto sm:right-0"
          role="tooltip"
        >
          <div className="space-y-2">
            {helpText && (
              <div>
                <p className="text-sm font-semibold text-default">Erklärung</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{helpText}</p>
              </div>
            )}
            {scientificContext && (
              <div>
                <p className="text-sm font-semibold text-primary">Wissenschaftlicher Hintergrund</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{scientificContext}</p>
              </div>
            )}
          </div>
          <div className="absolute -top-2 right-4 h-4 w-4 rotate-45 border-l border-t border-divider bg-white sm:left-auto" />
        </div>
      )}
    </div>
  )
}
