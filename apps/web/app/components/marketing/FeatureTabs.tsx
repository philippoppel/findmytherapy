'use client'

import { useId, useState } from 'react'
import { cn } from '@mental-health/ui'
import type { LucideIcon } from 'lucide-react'
import { BarChart3, FileText, Mic, Sparkles, Users, Video } from 'lucide-react'
import type { FeatureIconKey, FeatureTab } from '../../marketing-content'

const FEATURE_ICON_MAP: Record<FeatureIconKey, LucideIcon> = {
  mic: Mic,
  users: Users,
  video: Video,
  fileText: FileText,
  sparkles: Sparkles,
  chart: BarChart3,
}

interface FeatureTabsProps {
  tabs: FeatureTab[]
}

export function FeatureTabs({ tabs }: FeatureTabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]?.value ?? '')
  const tabsId = useId()

  const activeContent = tabs.find((tab) => tab.value === activeTab) ?? tabs[0]

  return (
    <section id="features" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-12 rounded-[2.5rem] border border-divider bg-white p-6 shadow-xl shadow-secondary/10 sm:p-8 md:p-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                  Unsere Angebote
                </span>
                <h2 className="mt-4 text-pretty text-3xl font-semibold tracking-tight text-default sm:text-4xl">
                  Alles für deine mentale Gesundheit
                </h2>
                <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted">
                  Von der ersten Einschätzung bis zur passenden Unterstützung – transparent, sicher und wissenschaftlich fundiert.
                </p>
              </div>
            </div>

            <div className="md:hidden">
              <label htmlFor={`${tabsId}-mobile-select`} className="text-sm font-semibold text-default">
                Modul auswählen
              </label>
              <div className="mt-2 rounded-2xl border border-divider bg-surface-2 p-3 shadow-inner shadow-secondary/10">
                <select
                  id={`${tabsId}-mobile-select`}
                  value={activeTab}
                  onChange={(event) => setActiveTab(event.target.value)}
                  className="w-full rounded-xl border border-transparent bg-white px-4 py-3 text-sm font-semibold text-default shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/60"
                >
                  {tabs.map((tab) => (
                    <option key={tab.value} value={tab.value}>
                      {tab.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="hidden overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:block md:overflow-visible">
              <div
                role="tablist"
                aria-label="Praxisfunktionen"
                className="flex flex-nowrap gap-2 rounded-full bg-surface-2/70 p-2 text-sm shadow-inner shadow-secondary/10 md:flex-wrap md:gap-3 md:rounded-none md:bg-transparent md:p-0 md:shadow-none"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    id={`${tabsId}-tab-${tab.value}`}
                    type="button"
                    role="tab"
                    aria-controls={`${tabsId}-panel-${tab.value}`}
                    aria-selected={tab.value === activeTab}
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      'flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-white',
                      tab.value === activeTab
                        ? 'border-primary bg-primary/15 text-primary'
                        : 'border-divider text-muted hover:border-primary/30 hover:text-primary',
                    )}
                  >
                    <span className="text-primary">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {activeContent ? (
            <div
              role="tabpanel"
              id={`${tabsId}-panel-${activeContent.value}`}
              aria-labelledby={`${tabsId}-tab-${activeContent.value}`}
              className="grid gap-8 lg:grid-cols-2 lg:gap-10"
            >
              <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-3">
                  {(() => {
                    const IconComponent = FEATURE_ICON_MAP[activeContent.icon] ?? Mic
                    return (
                      <span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <IconComponent className="h-6 w-6" aria-hidden />
                        <span className="sr-only">{activeContent.label}</span>
                      </span>
                    )
                  })()}
                  <div className="min-w-0 flex-1">
                    <h3 className="text-balance text-xl font-semibold text-default sm:text-2xl">
                      {activeContent.heading}
                    </h3>
                    <p className="mt-2 text-pretty text-sm text-muted sm:text-base">
                      {activeContent.description}
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {activeContent.points.map((point) => (
                    <div
                      key={point.title}
                      className="flex h-full flex-col gap-2 rounded-2xl border border-divider bg-surface-1 p-4 shadow-sm"
                    >
                      <h4 className="text-sm font-semibold text-default sm:text-base">
                        {point.title}
                      </h4>
                      <p className="text-pretty text-sm leading-relaxed text-muted">
                        {point.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 shadow-inner shadow-primary/10 lg:sticky lg:top-24">
                <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80 sm:text-sm">
                  {activeContent.highlights.title}
                </h4>
                <ul className="space-y-3 text-sm leading-relaxed text-default">
                  {activeContent.highlights.items.map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 text-pretty">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
