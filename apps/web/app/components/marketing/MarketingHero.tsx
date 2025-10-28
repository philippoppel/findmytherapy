'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@mental-health/ui'
import type { heroContent } from '../../marketing-content'
import { Reveal } from './Reveal'

interface HeroProps {
  content: typeof heroContent
}

export function MarketingHero({ content }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950 via-cyan-950 to-blue-950 px-4 py-10 text-white shadow-xl shadow-teal-900/30 sm:rounded-[2.5rem] sm:px-6 sm:py-14 md:py-16 lg:px-10"
      aria-labelledby="hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-teal-500/20 blur-3xl" />
        <div className="absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-cyan-500/25 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-7xl flex-col gap-6 sm:gap-10 md:gap-12 lg:flex-row lg:items-center lg:gap-20">
        <div className="w-full lg:max-w-xl">
          <Reveal delay={100}>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white/80 sm:gap-3 sm:px-4 sm:text-xs sm:tracking-[0.28em]">
              {content.eyebrow}
            </div>
          </Reveal>

          <Reveal delay={200}>
            <h1
              id="hero-heading"
              className="mt-5 text-balance text-3xl font-semibold leading-tight tracking-tight sm:mt-6 sm:text-4xl lg:text-6xl"
            >
              {content.title}
            </h1>
          </Reveal>
          <Reveal delay={300}>
            <p className="mt-5 max-w-xl text-pretty text-base leading-relaxed text-white/85 sm:mt-6 sm:text-lg">
              {content.highlight}
            </p>
          </Reveal>
          <Reveal delay={400}>
            <p className="mt-3 max-w-xl text-pretty text-sm leading-relaxed text-white/75 sm:text-base">
              {content.description}
            </p>
          </Reveal>

          <Reveal delay={500}>
            <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:items-center sm:gap-4">
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full !border-transparent !bg-teal-400 !py-4 !text-base !font-semibold !text-white shadow-lg shadow-teal-900/20 transition hover:-translate-y-0.5 hover:!bg-teal-300 hover:!text-white focus-visible:!ring-white/70 focus-visible:!ring-offset-teal-950 sm:w-auto sm:!py-3 md:!text-lg"
              >
                <Link href={content.primaryCta.href}>
                  {content.primaryCta.label}
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full !border-white/50 !py-4 !text-base !font-semibold !text-white hover:!border-white hover:!bg-white/15 hover:!text-white focus-visible:!ring-white/70 focus-visible:!ring-offset-teal-950 sm:w-auto sm:!py-3 md:!text-lg"
              >
                <Link href={content.secondaryCta.href}>
                  {content.secondaryCta.label}
                </Link>
              </Button>
              <Link
                href={content.tertiaryCta.href}
                className="text-center text-sm font-semibold text-teal-200 underline-offset-4 transition hover:text-teal-100 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal-950 sm:ml-2"
              >
                {content.tertiaryCta.label}
              </Link>
            </div>
          </Reveal>

          <dl className="mt-8 grid gap-3 sm:mt-10 sm:grid-cols-2 sm:gap-4 md:mt-12 md:grid-cols-3 md:gap-6">
            {content.metrics.map((metric, index) => (
              <Reveal key={metric.label} delay={600 + index * 100} className="rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-left shadow-sm backdrop-blur sm:rounded-2xl sm:px-4 sm:py-4 md:py-5">
                <dd className="text-xl font-semibold text-white sm:text-2xl">
                  {metric.value}
                </dd>
                <dt className="mt-1.5 text-[10px] font-semibold uppercase tracking-wider text-white/60 sm:mt-2 sm:text-xs">
                  {metric.label}
                </dt>
              </Reveal>
            ))}
          </dl>
        </div>

        <Reveal delay={200} className="hidden w-full md:block lg:flex-1" variant="scale">
          <div className="relative isolate overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-2 shadow-2xl backdrop-blur sm:rounded-3xl sm:p-2.5 md:p-3">
            <div className="absolute inset-0 bg-gradient-to-tr from-teal-500/8 via-white/10 to-transparent" />
            <Image
              src="/images/therapists/therapy-1.jpg"
              alt="FindMyTherapy Matching Dashboard"
              width={1280}
              height={853}
              className="relative z-10 h-full w-full rounded-xl object-cover sm:rounded-[22px]"
              priority
            />
            <div className="absolute -left-6 -top-6 hidden h-24 w-24 rounded-full border border-teal-500/30 bg-teal-500/20 blur-lg sm:block" />
            <div className="absolute -bottom-8 -right-6 hidden h-28 w-28 rounded-full border border-white/20 bg-white/10 blur-xl sm:block" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
