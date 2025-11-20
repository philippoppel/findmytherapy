'use client'

import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export function ReassuranceBox() {
  const reassurances = [
    {
      title: "Es ist normal, nervös zu sein",
      text: "Viele Menschen zögern beim ersten Kontakt. Das ist völlig in Ordnung – nimm dir die Zeit, die du brauchst."
    },
    {
      title: "Du bist nicht allein",
      text: "Über 1 Million Menschen in Österreich suchen jährlich psychotherapeutische Unterstützung. Du machst einen mutigen Schritt."
    },
    {
      title: "Keine Verpflichtung",
      text: "Das Erstgespräch ist unverbindlich. Du kannst danach in Ruhe entscheiden, ob es passt."
    },
    {
      title: "Die Chemie muss stimmen",
      text: "Es ist völlig okay, mehrere Therapeut:innen zu kontaktieren, bis du die richtige Person findest."
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mb-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 sm:p-8"
    >
      <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
        <CheckCircle2 className="h-6 w-6 text-blue-600" />
        Wichtig zu wissen
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {reassurances.map((item, index) => (
          <div key={index} className="rounded-xl bg-white/80 p-4 shadow-sm">
            <h4 className="mb-1 font-semibold text-gray-900">{item.title}</h4>
            <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-blue-100 border border-blue-200 p-4">
        <p className="text-sm text-blue-900">
          <strong>📞 Tipp für den ersten Kontakt:</strong> Du musst nicht sofort alles erzählen.
          Ein einfaches "Ich interessiere mich für ein Erstgespräch" reicht völlig aus. Die meisten
          Therapeut:innen sind sehr verständnisvoll und erklären dir den weiteren Ablauf.
        </p>
      </div>
    </motion.div>
  )
}
