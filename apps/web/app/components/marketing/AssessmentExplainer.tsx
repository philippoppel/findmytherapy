'use client';

import { Brain, ClipboardList } from 'lucide-react';
import { SectionHeading } from './SectionHeading';
import { Reveal } from './Reveal';

const tools = [
  {
    name: 'PHQ-9',
    icon: ClipboardList,
    description:
      'Patient Health Questionnaire – misst, wie stark depressive Symptome deinen Alltag beeinflussen.',
    details: [
      '9 Fragen, die in internationalen Leitlinien empfohlen werden',
      'Erkennt leichte, mittlere und schwere Ausprägungen',
      'Hilft Therapeut:innen, Veränderungen über die Zeit sichtbar zu machen',
    ],
  },
  {
    name: 'GAD-7',
    icon: Brain,
    description:
      'Generalized Anxiety Disorder Scale – zeigt, wie stark Anspannung, Grübeln und Sorgen präsent sind.',
    details: [
      '7 Fragen zu typischen Anzeichen von Angst und Anspannung',
      'Unterstützt Entscheidungen, ob Selbsthilfe oder Therapie sinnvoll ist',
      'Kann bei Verlaufsmessungen helfen, Erfolge zu dokumentieren',
    ],
  },
];

export function AssessmentExplainer() {
  return (
    <section id="phq-info" className="py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Screenings verstanden"
            title="Warum wir mit PHQ-9 und GAD-7 arbeiten"
            description="Beide Fragebögen sind wissenschaftlich geprüft, werden weltweit eingesetzt und lassen sich gut mit persönlichen Gesprächen kombinieren."
          />
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {tools.map((tool, index) => (
            <Reveal key={tool.name} delay={index * 120}>
              <article className="h-full rounded-3xl border border-divider bg-white p-6 shadow-lg shadow-secondary/10">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <tool.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="text-xl font-semibold text-default">{tool.name}</h3>
                </div>
                <p className="mt-4 text-pretty text-base leading-relaxed text-muted">
                  {tool.description}
                </p>
                <ul className="mt-4 space-y-2 text-sm leading-relaxed text-default">
                  {tool.details.map((detail) => (
                    <li key={detail} className="flex items-start gap-2">
                      <span className="mt-1 inline-flex h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                      <span className="text-pretty">{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
