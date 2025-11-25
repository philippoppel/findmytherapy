'use client';

import type { partnerLogos } from '../../marketing-content';

interface PartnerLogosProps {
  partners: typeof partnerLogos;
}

export function PartnerLogos({ partners }: PartnerLogosProps) {
  return (
    <section aria-labelledby="partners-heading" className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-divider bg-white/70 p-10 shadow-lg shadow-secondary/10 backdrop-blur">
          <div className="flex flex-col items-center justify-between gap-6 text-center sm:flex-row">
            <div className="space-y-2">
              <span className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
                Vertrauenspartner:innen
              </span>
              <p id="partners-heading" className="text-sm text-muted">
                Zusammenarbeit mit Netzwerken, Hochschulen und Berufsverbänden
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
              {partners.map((partner) => (
                <div
                  key={partner.name}
                  className="flex h-16 min-w-[120px] items-center justify-center rounded-2xl border border-divider bg-surface-1 px-5 text-sm font-semibold text-default shadow-sm"
                >
                  <span className="sr-only">{partner.name}</span>
                  <span aria-hidden>{partner.initials}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
