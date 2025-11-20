'use client'

import { motion } from 'framer-motion'
import { Phone, Mail, Calendar, MessageCircle } from 'lucide-react'

export function NextStepsGuide() {
  const steps = [
    {
      icon: Phone,
      title: 'Profil ansehen',
      description: 'Schau dir die Profile in Ruhe an. Lies über ihre Spezialisierungen und ihren Ansatz.',
    },
    {
      icon: MessageCircle,
      title: 'Ersten Kontakt aufnehmen',
      description: 'Ruf an oder schreib eine E-Mail. Du kannst auch erstmal nur Fragen stellen.',
    },
    {
      icon: Calendar,
      title: 'Erstgespräch vereinbaren',
      description: 'Die meisten Therapeut:innen bieten ein kostenloses Erstgespräch an (15-30 Min).',
    },
    {
      icon: Mail,
      title: 'Entscheidung in Ruhe treffen',
      description: 'Nach dem Erstgespräch entscheidest du, ob die Chemie stimmt. Kein Druck!',
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-md sm:p-8"
    >
      <h3 className="mb-2 text-xl font-bold text-gray-900">
        Was jetzt? Deine nächsten Schritte
      </h3>
      <p className="mb-6 text-gray-600">
        Du entscheidest das Tempo. Hier ist ein typischer Ablauf, aber es gibt kein Richtig oder Falsch:
      </p>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="flex items-start gap-4"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600">
              <step.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-gray-500">Schritt {index + 1}</span>
                <h4 className="font-semibold text-gray-900">{step.title}</h4>
              </div>
              <p className="mt-1 text-sm text-gray-600">{step.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4">
        <p className="text-sm text-green-800">
          <strong>💡 Tipp:</strong> Es ist völlig normal, mehrere Therapeut:innen zu kontaktieren.
          Die "Chemie" muss stimmen – und das merkst du meist schon im Erstgespräch.
        </p>
      </div>
    </motion.div>
  )
}
