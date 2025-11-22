'use client'

import { motion } from 'framer-motion'

const quotes = [
  {
    text: "Der wichtigste Schritt in der Therapie ist der erste: Hilfe zu suchen.",
    author: "Psychologie Heute"
  },
  {
    text: "Therapie ist kein Zeichen von Schwäche, sondern von Mut und Selbstfürsorge.",
    author: "Mental Health Foundation"
  },
  {
    text: "Die Reise von tausend Meilen beginnt mit dem ersten Schritt.",
    author: "Laozi"
  },
  {
    text: "Sich Hilfe zu holen ist eine der stärksten Entscheidungen, die man treffen kann.",
    author: "Österreichischer Bundesverband für Psychotherapie"
  },
]

export function MotivationalQuote() {
  // Wähle ein zufälliges Zitat
  const quote = quotes[Math.floor(Math.random() * quotes.length)]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-6 sm:mb-8 rounded-2xl border-l-4 border-primary-500 bg-gradient-to-r from-primary-50 to-transparent p-4 sm:p-6"
    >
      <blockquote className="text-gray-700">
        <p className="mb-2 text-sm sm:text-base md:text-lg italic leading-relaxed break-words">
          &ldquo;{quote.text}&rdquo;
        </p>
        <footer className="text-xs sm:text-sm font-medium text-gray-600 break-words">
          — {quote.author}
        </footer>
      </blockquote>
    </motion.div>
  )
}
