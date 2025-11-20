'use client'

import { motion } from 'framer-motion'
import { Heart, Shield, Users } from 'lucide-react'

export function EncouragementBanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8 rounded-2xl border border-primary-200/50 bg-gradient-to-br from-primary-50 via-white to-secondary-50 p-6 sm:p-8"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 shadow-lg">
          <Heart className="h-6 w-6 text-white" fill="currentColor" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Der erste Schritt ist gemacht! 🎉
          </h2>
          <p className="text-sm text-gray-600">
            Das ist oft der schwerste – und du hast ihn bereits geschafft.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-gray-700 leading-relaxed">
          Diese Therapeut:innen passen zu deinen Bedürfnissen. Jede:r von ihnen ist{' '}
          <strong>staatlich geprüft und verifiziert</strong>. Die Prozentangaben zeigen, wie gut
          ihre Spezialisierung, Verfügbarkeit und Methoden zu deinen Wünschen passen.
        </p>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-100">
              <Shield className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Verifiziert</p>
              <p className="text-xs text-gray-600">Staatlich geprüfte Therapeut:innen</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary-100">
              <Users className="h-4 w-4 text-secondary-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Persönlich</p>
              <p className="text-xs text-gray-600">Auf dich zugeschnitten</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-xl bg-white/80 p-3 shadow-sm">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <Heart className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Vertraulich</p>
              <p className="text-xs text-gray-600">Geschützter Raum</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
