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
      className="mb-6 sm:mb-8 rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-4 sm:p-6 md:p-8"
    >
      <h3 className="mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 break-words">
        <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-blue-600" />
        <span>Wichtig zu wissen</span>
      </h3>

      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {reassurances.map((item, index) => (
          <div key={index} className="rounded-xl bg-white/80 p-3 sm:p-4 shadow-sm">
            <h4 className="mb-1 text-sm sm:text-base font-semibold text-gray-900 break-words">{item.title}</h4>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed break-words">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 sm:mt-6 rounded-xl bg-blue-100 border border-blue-200 p-3 sm:p-4">
        <p className="text-xs sm:text-sm text-blue-900 leading-relaxed break-words">
          <strong>📞 Tipp für den ersten Kontakt:</strong> Du musst nicht sofort alles erzählen.
          Ein einfaches &ldquo;Ich interessiere mich für ein Erstgespräch&rdquo; reicht völlig aus. Die meisten
          Therapeut:innen sind sehr verständnisvoll und erklären dir den weiteren Ablauf.
        </p>
      </div>
    </motion.div>
  )
}
