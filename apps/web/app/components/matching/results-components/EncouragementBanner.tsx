'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Users } from 'lucide-react'

export function EncouragementBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-3xl border-2 border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-6 sm:p-8 shadow-xl"
    >
      <div className="mb-3 sm:mb-4 flex items-start sm:items-center gap-2 sm:gap-3">
        <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 shadow-lg">
          <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-white" fill="currentColor" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 break-words leading-tight">
            Der erste Schritt ist gemacht!
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 break-words">
            Das ist oft der schwerste – und du hast ihn bereits geschafft.
          </p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <p className="text-xs sm:text-sm md:text-base text-gray-700 leading-relaxed break-words">
          Diese Therapeut:innen passen zu deinen Bedürfnissen. Jede:r von ihnen ist{' '}
          <strong>staatlich geprüft und verifiziert</strong>. Die Prozentangaben zeigen, wie gut
          ihre Spezialisierung, Verfügbarkeit und Methoden zu deinen Wünschen passen.
        </p>

        <div className="grid gap-2 sm:gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-white/80 p-2.5 sm:p-3 shadow-sm">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">Verifiziert</p>
              <p className="text-[10px] sm:text-xs text-gray-600 break-words leading-tight">Staatlich geprüfte Therapeut:innen</p>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-white/80 p-2.5 sm:p-3 shadow-sm">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-100">
              <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-secondary-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">Persönlich</p>
              <p className="text-[10px] sm:text-xs text-gray-600 break-words leading-tight">Auf dich zugeschnitten</p>
            </div>
          </div>

          <div className="flex items-start gap-2 sm:gap-3 rounded-xl bg-white/80 p-2.5 sm:p-3 shadow-sm">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-gray-900 break-words">Vertraulich</p>
              <p className="text-[10px] sm:text-xs text-gray-600 break-words leading-tight">Geschützter Raum</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
