'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { MatchingResponse, MatchResult } from '@/lib/matching'

// Score zu Prozent und Farbe konvertieren
function getScoreDisplay(score: number) {
  const percent = Math.round(score * 100)
  let color = 'text-gray-600'
  let bgColor = 'bg-gray-100'
  let label = 'Passend'

  if (percent >= 80) {
    color = 'text-green-700'
    bgColor = 'bg-green-100'
    label = 'Sehr passend'
  } else if (percent >= 60) {
    color = 'text-primary-700'
    bgColor = 'bg-primary-100'
    label = 'Gut passend'
  } else if (percent >= 40) {
    color = 'text-yellow-700'
    bgColor = 'bg-yellow-100'
    label = 'Passend'
  }

  return { percent, color, bgColor, label }
}

// Einzelne Match-Card Komponente
function MatchCard({ match, rank }: { match: MatchResult; rank: number }) {
  const { percent, color, bgColor, label } = getScoreDisplay(match.score)
  const [showDetails, setShowDetails] = useState(false)

  // Initiale für Avatar
  const initials = match.therapist.displayName
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '?'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: rank * 0.1 }}
      className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="p-5">
        {/* Header mit Rang und Score */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="relative">
              {match.therapist.profileImageUrl ? (
                <Image
                  src={match.therapist.profileImageUrl}
                  alt={match.therapist.displayName || 'Therapeut'}
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold">
                  {initials}
                </div>
              )}
              {/* Rang-Badge */}
              {rank <= 3 && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {rank}
                </div>
              )}
            </div>

            {/* Name & Titel */}
            <div>
              <h3 className="font-semibold text-gray-900">
                {match.therapist.displayName || 'Therapeut:in'}
              </h3>
              {match.therapist.title && (
                <p className="text-sm text-gray-600">{match.therapist.title}</p>
              )}
            </div>
          </div>

          {/* Score */}
          <div className={`px-3 py-1 rounded-full ${bgColor} ${color} text-sm font-medium`}>
            {percent}%
          </div>
        </div>

        {/* Headline */}
        {match.therapist.headline && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{match.therapist.headline}</p>
        )}

        {/* Hauptgründe für das Match */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {match.explanation.primary.map((reason, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary-50 text-primary-700 text-xs font-medium"
              >
                ✓ {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Zusätzliche Infos */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
          {/* Standort/Distanz */}
          {match.distanceKm !== undefined && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {match.distanceKm} km
            </span>
          )}
          {match.therapist.city && !match.distanceKm && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {match.therapist.city}
            </span>
          )}

          {/* Online */}
          {match.therapist.online && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Online
            </span>
          )}

          {/* Bewertung */}
          {match.therapist.rating && match.therapist.rating > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {match.therapist.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Erweiterte Details (optional) */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 pt-4 border-t border-gray-100"
          >
            {/* Weitere Gründe */}
            {match.explanation.secondary.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-2">Weitere Gründe:</p>
                <ul className="text-sm text-gray-600 space-y-1">
                  {match.explanation.secondary.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnungen */}
            {match.explanation.warnings && match.explanation.warnings.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-yellow-600 mb-2">Hinweise:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {match.explanation.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>⚠️</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Score-Breakdown */}
            <div>
              <p className="text-xs font-medium text-gray-500 mb-2">Score-Details:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(match.scoreBreakdown.components).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-gray-500 capitalize">{key}:</span>
                    <span className="font-medium">{Math.round(value.score * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mt-4">
          <Link
            href={`/therapists/${match.therapist.id}`}
            className="flex-1 px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg text-center hover:bg-primary-700 transition-colors"
          >
            Profil ansehen
          </Link>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-2 text-gray-600 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {showDetails ? 'Weniger' : 'Details'}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function MatchResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<MatchingResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ergebnisse aus Session Storage laden
    const stored = sessionStorage.getItem('matchResults')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setResults(parsed)
      } catch {
        console.error('Failed to parse match results')
      }
    }
    setIsLoading(false)
  }, [])

  // Keine Ergebnisse vorhanden
  if (!isLoading && !results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Keine Ergebnisse gefunden</h2>
          <p className="text-gray-600 mb-4">
            Bitte starten Sie eine neue Suche.
          </p>
          <Link
            href="/match"
            className="inline-flex px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Neue Suche starten
          </Link>
        </div>
      </div>
    )
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Lade Ergebnisse...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Zurück
          </button>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Ihre Matches
          </h1>
          <p className="text-gray-600">
            {results?.total === 0
              ? 'Leider keine passenden Therapeut:innen gefunden.'
              : `Wir haben ${results?.total} passende Therapeut:innen für Sie gefunden.`}
          </p>
        </div>

        {/* Keine Matches */}
        {results?.matches.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="text-5xl mb-4">🔍</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Keine passenden Therapeut:innen gefunden
            </h2>
            <p className="text-gray-600 mb-6">
              Versuchen Sie, Ihre Suchkriterien anzupassen oder den Suchradius zu erweitern.
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/match"
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Neue Suche
              </Link>
              <Link
                href="/therapists"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Alle Therapeuten
              </Link>
            </div>
          </div>
        )}

        {/* Match-Liste */}
        {results && results.matches.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2">
            {results.matches.map((match, index) => (
              <MatchCard key={match.therapist.id} match={match} rank={index + 1} />
            ))}
          </div>
        )}

        {/* Footer Actions */}
        {results && results.matches.length > 0 && (
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">
              Nicht das Richtige dabei?
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                href="/match"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Suche anpassen
              </Link>
              <Link
                href="/therapists"
                className="px-6 py-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                Alle Therapeuten ansehen →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
