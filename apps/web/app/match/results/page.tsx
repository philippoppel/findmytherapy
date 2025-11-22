'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Target, Eye, Sparkles, Check, Star, ThumbsUp, Award } from 'lucide-react'
import type { MatchingResponse, MatchResult } from '@/lib/matching'
import { EncouragementBanner } from './components/EncouragementBanner'
import { NextStepsGuide } from './components/NextStepsGuide'
import { MotivationalQuote } from './components/MotivationalQuote'
import { ReassuranceBox } from './components/ReassuranceBox'
import { AvailabilityBadge } from '@/app/components/AvailabilityBadge'

// Score zu Prozent und Farbe konvertieren
function getScoreDisplay(score: number) {
  const percent = Math.round(score * 100)
  let color = 'text-gray-600'
  let bgColor = 'bg-gray-100'

  if (percent >= 80) {
    color = 'text-green-700'
    bgColor = 'bg-green-100'
  } else if (percent >= 60) {
    color = 'text-primary-700'
    bgColor = 'bg-primary-100'
  } else if (percent >= 40) {
    color = 'text-yellow-700'
    bgColor = 'bg-yellow-100'
  }

  return { percent, color, bgColor }
}

// Einzelne Match-Card Komponente
function MatchCard({ match, rank }: { match: MatchResult; rank: number }) {
  const { percent, color, bgColor } = getScoreDisplay(match.score)
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
      className="group bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden hover:shadow-xl hover:border-amber-200 transition-all duration-300"
    >
      {/* Rang-Ribbon (nur Top 3) */}
      {rank <= 3 && (
        <div className="relative h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
      )}

      <div className="p-5 sm:p-6">
        {/* Prominenter Match-Score Banner am oberen Rand */}
        <div className={`mb-4 px-4 py-3 rounded-xl ${bgColor} border-2 ${percent >= 80 ? 'border-green-300' : percent >= 60 ? 'border-primary-300' : 'border-yellow-300'}`}>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className={`w-5 h-5 sm:w-6 sm:h-6 ${color}`} strokeWidth={2.5} />
              <div>
                <div className={`text-xs font-medium ${color} opacity-80`}>Match-Score</div>
                <div className={`text-2xl sm:text-3xl font-bold ${color}`}>{percent}%</div>
              </div>
            </div>
            <div className="text-right">
              {percent >= 80 ? (
                <div className="flex items-center gap-1.5">
                  <Star className={`w-4 h-4 ${color}`} fill="currentColor" />
                  <span className={`text-sm font-bold ${color}`}>Hervorragend</span>
                </div>
              ) : percent >= 60 ? (
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className={`w-4 h-4 ${color}`} />
                  <span className={`text-sm font-bold ${color}`}>Sehr gut</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Check className={`w-4 h-4 ${color}`} />
                  <span className={`text-sm font-bold ${color}`}>Gut</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Header mit Rang */}
        <div className="flex items-start justify-between mb-4 gap-3">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {match.therapist.profileImageUrl ? (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden ring-2 ring-gray-100 group-hover:ring-amber-200 transition-all">
                  <Image
                    src={match.therapist.profileImageUrl}
                    alt={match.therapist.displayName || 'Therapeut'}
                    width={64}
                    height={64}
                    className="object-cover w-full h-full"
                  />
                </div>
              ) : (
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-amber-700 font-bold text-lg ring-2 ring-gray-100">
                  {initials}
                </div>
              )}
              {/* Rang-Badge für Top 3 */}
              {rank <= 3 && (
                <div className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg ring-2 ring-white">
                  #{rank}
                </div>
              )}
            </div>

            {/* Name & Titel */}
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-base sm:text-lg text-gray-900 break-words line-clamp-1 mb-0.5">
                {match.therapist.displayName || 'Therapeut:in'}
              </h3>
              {match.therapist.title && (
                <p className="text-xs sm:text-sm text-gray-600 break-words line-clamp-1">{match.therapist.title}</p>
              )}
            </div>
          </div>

          {/* Verfügbarkeit Badge */}
          <div className="flex-shrink-0">
            <AvailabilityBadge
              status={match.therapist.availabilityStatus}
              estimatedWaitWeeks={match.therapist.estimatedWaitWeeks}
              acceptingClients={match.therapist.acceptingClients}
              variant="default"
            />
          </div>
        </div>

        {/* Headline */}
        {match.therapist.headline && (
          <p className="text-xs sm:text-sm text-gray-600 mb-3 line-clamp-2 break-words">{match.therapist.headline}</p>
        )}

        {/* Warum passt dieser Therapeut? */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" strokeWidth={2.5} />
            <h4 className="text-sm font-bold text-gray-900">
              Warum passt {match.therapist.displayName?.split(' ')[0] || 'diese:r Therapeut:in'} zu dir?
            </h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {match.explanation.primary.map((reason, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 text-green-800 text-xs font-semibold shadow-sm"
              >
                <Check className="w-3 h-3 text-green-600" strokeWidth={2.5} />
                {reason}
              </span>
            ))}
          </div>
        </div>

        {/* Zusätzliche Infos */}
        <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
          {/* Standort/Distanz */}
          {match.distanceKm !== undefined && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {match.distanceKm} km
            </span>
          )}
          {match.therapist.city && !match.distanceKm && (
            <span className="flex items-center gap-1 break-words max-w-full">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              {match.therapist.city}
            </span>
          )}

          {/* Online */}
          {match.therapist.online && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Online
            </span>
          )}

          {/* Bewertung */}
          {match.therapist.rating && match.therapist.rating > 0 && (
            <span className="flex items-center gap-1 whitespace-nowrap">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
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
            className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100"
          >
            {/* Weitere Gründe */}
            {match.explanation.secondary.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-500 mb-2">Weitere Gründe:</p>
                <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                  {match.explanation.secondary.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2 break-words">
                      <span className="text-gray-400 flex-shrink-0">•</span>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Warnungen */}
            {match.explanation.warnings && match.explanation.warnings.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-yellow-600 mb-2">Hinweise:</p>
                <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                  {match.explanation.warnings.map((warning, idx) => (
                    <li key={idx} className="flex items-start gap-2 break-words">
                      <span className="flex-shrink-0">⚠️</span>
                      <span>{warning}</span>
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
                  <div key={key} className="flex justify-between gap-2">
                    <span className="text-gray-500 capitalize break-words">{key}:</span>
                    <span className="font-medium whitespace-nowrap">{Math.round(value.score * 100)}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-5 flex gap-3">
          <Link
            href={`/therapists/${match.therapist.id}`}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3.5 text-sm font-bold text-white shadow-lg shadow-amber-200 transition-all hover:shadow-xl hover:scale-[1.02] active:scale-95"
          >
            <Eye className="w-5 h-5" strokeWidth={2.5} />
            <span>Profil ansehen</span>
          </Link>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-4 py-3.5 text-gray-700 text-sm font-semibold border-2 border-gray-200 rounded-xl hover:border-amber-300 hover:bg-amber-50 transition-all"
          >
            {showDetails ? '▲' : '▼'}
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
    <div className="min-h-screen bg-gradient-to-b from-amber-50/30 via-white to-stone-50/20">
      <div className="container mx-auto px-4 py-6 sm:py-10 max-w-6xl">
        {/* Header */}
        <div className="mb-8 sm:mb-10">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 px-4 py-2 rounded-xl hover:bg-white transition-all group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Zurück zur Suche</span>
          </button>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-lg mb-4 sm:mb-6">
              <Target className="w-8 h-8 sm:w-10 sm:h-10 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 break-words">
              Deine persönlichen Empfehlungen
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto break-words">
              {results?.total === 0
                ? 'Leider keine passenden Therapeut:innen gefunden.'
                : results?.total === 1
                ? 'Wir haben die perfekte Therapeut:in für dich gefunden!'
                : `Wir haben ${results?.total} Therapeut:innen gefunden, die gut zu dir passen!`}
            </p>
          </div>
        </div>

        {/* Encouragement Banner */}
        {results && results.matches.length > 0 && <EncouragementBanner />}

        {/* Motivational Quote */}
        {results && results.matches.length > 0 && <MotivationalQuote />}

        {/* Keine Matches */}
        {results?.matches.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-center">
            <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🔍</div>
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 break-words">
              Keine passenden Therapeut:innen gefunden
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mb-5 sm:mb-6 break-words">
              Versuchen Sie, Ihre Suchkriterien anzupassen oder den Suchradius zu erweitern.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Link
                href="/match"
                className="px-5 sm:px-6 py-2 bg-primary-600 text-white text-sm sm:text-base rounded-lg hover:bg-primary-700 transition-colors"
              >
                Neue Suche
              </Link>
              <Link
                href="/therapists"
                className="px-5 sm:px-6 py-2 border border-gray-300 text-gray-700 text-sm sm:text-base rounded-lg hover:bg-gray-50 transition-colors"
              >
                Alle Therapeuten
              </Link>
            </div>
          </div>
        )}

        {/* Match-Liste */}
        {results && results.matches.length > 0 && (
          <>
            <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-gray-900">
              Deine Top-Matches
            </h2>
            <div className="grid gap-3 sm:gap-4 mb-6 sm:mb-8 md:grid-cols-2">
              {results.matches.map((match, index) => (
                <MatchCard key={match.therapist.id} match={match} rank={index + 1} />
              ))}
            </div>

            {/* Next Steps Guide */}
            <NextStepsGuide />

            {/* Reassurance Box */}
            <ReassuranceBox />
          </>
        )}

        {/* Footer Actions */}
        {results && results.matches.length > 0 && (
          <div className="mt-6 sm:mt-8 text-center px-4">
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              Nicht das Richtige dabei?
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center">
              <Link
                href="/match"
                className="px-5 sm:px-6 py-2 border border-gray-300 text-gray-700 text-sm sm:text-base rounded-lg hover:bg-gray-50 transition-colors"
              >
                Suche anpassen
              </Link>
              <Link
                href="/therapists"
                className="px-5 sm:px-6 py-2 text-primary-600 text-sm sm:text-base hover:text-primary-700 transition-colors"
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
