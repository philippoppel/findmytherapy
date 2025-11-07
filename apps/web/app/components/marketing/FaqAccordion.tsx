'use client'

import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@mental-health/ui'
import type { faqItems } from '../../marketing-content'
import { Reveal } from './Reveal'

interface FaqAccordionProps {
  items: typeof faqItems
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const baseId = useId()

  return (
    <section id="faq" className="py-24" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-8 text-center sm:mb-10">
          <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
            FAQ
          </span>
          <h2 id="faq-heading" className="mt-4 text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl">
            Deine wichtigsten Fragen – transparent beantwortet
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-muted">
            Noch etwas unklar? Schreib uns an{' '}
            <a
              href="mailto:servus@findmytherapy.net"
              className="inline-flex min-h-12 items-center gap-1 px-2 py-3 font-semibold text-primary underline-offset-4 hover:underline"
            >
              servus@findmytherapy.net
            </a>
            .
          </p>
        </Reveal>

        <div className="space-y-3 sm:space-y-4">
          {items.map((item, index) => {
            const isOpen = openIndex === index
            const contentId = `${baseId}-content-${index}`
            const triggerId = `${baseId}-trigger-${index}`

            return (
              <Reveal
                key={item.question}
                delay={index * 120}
              >
                <div className="overflow-hidden rounded-2xl border border-divider bg-white shadow-lg shadow-secondary/10 sm:rounded-3xl">
                  <button
                    id={triggerId}
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={contentId}
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:gap-6 sm:px-6 sm:py-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white"
                  >
                    <span className="text-sm font-semibold text-default sm:text-base">
                      {item.question}
                    </span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 text-primary transition-transform duration-200',
                        isOpen ? 'rotate-180' : 'rotate-0',
                      )}
                      aria-hidden
                    />
                  </button>
                  <div
                    id={contentId}
                    role="region"
                    aria-labelledby={triggerId}
                    aria-hidden={!isOpen}
                    style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                    className="grid overflow-hidden transition-[grid-template-rows] duration-300 ease-in-out"
                  >
                    <div
                      className={cn(
                        'overflow-hidden px-3 pb-3 text-sm leading-relaxed text-muted transition-opacity duration-200 sm:px-6 sm:pb-6 sm:text-base',
                        isOpen ? 'opacity-100' : 'opacity-0',
                      )}
                    >
                      {item.answer}
                    </div>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
