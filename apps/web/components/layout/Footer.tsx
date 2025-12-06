'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Compass, Mail, ShieldCheck, Lock, Award, Users, Linkedin, Instagram } from 'lucide-react';
import { FEATURES } from '@/lib/features';
import { useTranslation } from '@/lib/i18n';

export function Footer() {
  const { t } = useTranslation();

  const footerLinks = {
    main: {
      title: t('footer.navigation'),
      links: [
        ...(FEATURES.ASSESSMENT ? [{ name: t('footer.firstAssessment'), href: '/triage' }] : []),
        { name: t('footer.therapists'), href: '/therapists' },
        { name: t('footer.theTeam'), href: '/about' },
        { name: t('footer.forTherapists'), href: '/for-therapists' },
        { name: t('footer.faq'), href: '/help' },
        { name: t('footer.contact'), href: '/contact' },
      ],
    },
    legal: {
      title: t('footer.legal'),
      links: [
        { name: t('footer.privacy'), href: '/privacy' },
        { name: t('footer.cookiePolicy'), href: '/cookies' },
        { name: t('footer.imprint'), href: '/imprint' },
        { name: t('footer.terms'), href: '/terms' },
      ],
    },
  };

  return (
    <footer
      className="relative mt-auto border-t border-divider bg-surface-1/70 backdrop-blur-sm text-default"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary-200/80 to-transparent"
      />
      <div className="mx-auto max-w-[1400px] px-3 py-12 sm:px-4 lg:px-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand Section */}
          <div className="col-span-1" itemScope itemType="https://schema.org/Organization">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-700">
                <Compass className="h-5 w-5" aria-hidden />
              </span>
              <span className="text-xl font-semibold" itemProp="name">
                FindMyTherapy
              </span>
            </div>
            <p className="mb-4 text-sm text-muted" itemProp="description">
              {t('footer.tagline')}
            </p>
            <address className="not-italic">
              <div className="space-y-1 text-sm text-muted">
                <a
                  href="mailto:servus@findmytherapy.net"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-link transition hover:bg-primary-50/80"
                  itemProp="email"
                >
                  <Mail className="h-4 w-4 text-primary-500" aria-hidden="true" />
                  <span>servus@findmytherapy.net</span>
                </a>
              </div>
            </address>
            {/* Social Media */}
            <div className="mt-4 flex items-center gap-2">
              <a
                href="https://www.linkedin.com/company/findmytherapy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition hover:bg-primary-100"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/findmytherapy"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50 text-primary-600 transition hover:bg-primary-100"
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {Object.values(footerLinks).map((section) => (
            <nav key={section.title} className="col-span-1" aria-label={section.title}>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">
                {section.title}
              </h3>
              <ul className="space-y-1">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="inline-flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface-2/60 hover:text-default"
                    >
                      {link.name}
                      <span aria-hidden className="text-xs text-subtle">
                        ↗
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Partner & Empfehlungen Section */}
        <section className="mt-12 rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50/50 to-surface-1 p-6 sm:p-8">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wide text-primary-700">
            {t('footer.recommendedBy')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12">
            {/* ÖBVP */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/oebvp.png"
                alt="Österreichischer Bundesverband für Psychotherapie"
                width={120}
                height={60}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 sm:h-14"
              />
              <span className="text-[10px] text-muted text-center max-w-[100px]">ÖBVP</span>
            </div>
            {/* VÖPP */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/voepp.png"
                alt="Vereinigung Österreichischer Psychotherapeutinnen und Psychotherapeuten"
                width={120}
                height={60}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 sm:h-14"
              />
              <span className="text-[10px] text-muted text-center max-w-[100px]">VÖPP</span>
            </div>
            {/* SFU */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/sfu.svg"
                alt="Sigmund Freud Universität"
                width={120}
                height={60}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 sm:h-14"
              />
              <span className="text-[10px] text-muted text-center max-w-[100px]">SFU Wien</span>
            </div>
            {/* 2 Minuten 2 Millionen */}
            <div className="flex flex-col items-center gap-2">
              <Image
                src="/images/2min2mil.png"
                alt="2 Minuten 2 Millionen"
                width={120}
                height={60}
                className="h-12 w-auto object-contain grayscale hover:grayscale-0 transition-all duration-300 sm:h-14"
              />
              <span className="text-[10px] text-muted text-center max-w-[100px]">{t('footer.asSeenOnTv')}</span>
            </div>
          </div>
        </section>

        {/* Trust Badges Section */}
        <section
          className="mt-8 rounded-3xl border border-divider bg-surface-1/70 p-6 shadow-soft"
          aria-label={t('footer.trustIndicators')}
        >
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {/* Verified Therapists */}
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600"
                aria-hidden="true"
              >
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">{t('footer.verifiedTherapists')}</h4>
              <p className="text-xs text-muted">{t('footer.allProfilesVerified')}</p>
            </article>

            {/* Data Protection */}
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600"
                aria-hidden="true"
              >
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">{t('footer.gdprCompliant')}</h4>
              <p className="text-xs text-muted">{t('footer.yourDataIsSafe')}</p>
            </article>

            {/* Quality Standards */}
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600"
                aria-hidden="true"
              >
                <Award className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">{t('footer.qualityStandards')}</h4>
              <p className="text-xs text-muted">{t('footer.highestProfessionalStandards')}</p>
            </article>

            {/* Austrian Focus */}
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-600"
                aria-hidden="true"
              >
                <Users className="h-5 w-5" />
              </div>
              <h4 className="mb-1 text-sm font-semibold text-default">{t('footer.austriaFocus')}</h4>
              <p className="text-xs text-muted">{t('footer.specializedAustrianMarket')}</p>
            </article>
          </div>
        </section>

        {/* Bottom Section */}
        <div className="mt-10 border-t border-divider pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-sm text-muted md:flex-row md:text-left">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} FindMyTherapy. {t('footer.copyrightTagline')}
            </p>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-surface-2/70 px-3 py-1 text-sm text-default">
                🇦🇹 {t('footer.countryBadge')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
