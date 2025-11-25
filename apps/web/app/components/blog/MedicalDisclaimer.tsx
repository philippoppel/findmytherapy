import { AlertCircle } from 'lucide-react';

export function MedicalDisclaimer() {
  return (
    <div className="my-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 shadow-sm">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <AlertCircle className="h-6 w-6 text-amber-600" aria-hidden="true" />
        </div>
        <div className="space-y-3 text-sm text-neutral-700">
          <h3 className="text-base font-semibold text-neutral-900">Medizinischer Hinweis</h3>
          <p className="leading-relaxed">
            Die Inhalte auf FindMyTherapy dienen ausschließlich zu Informationszwecken und ersetzen{' '}
            <strong>keine professionelle medizinische Beratung, Diagnose oder Behandlung</strong>.
            Bei gesundheitlichen Fragen oder Beschwerden wenden Sie sich bitte immer an einen Arzt,
            Psychotherapeuten oder andere qualifizierte Gesundheitsdienstleister.
          </p>
          <p className="leading-relaxed">
            Alle medizinischen Inhalte werden von lizenzierten Psychotherapeuten geprüft und
            basieren auf wissenschaftlichen Leitlinien. Dennoch kann FindMyTherapy keine Haftung für
            die Vollständigkeit, Richtigkeit und Aktualität der bereitgestellten Informationen
            übernehmen.
          </p>
          <p className="font-semibold text-neutral-900">
            Im Notfall: Wählen Sie{' '}
            <a href="tel:144" className="underline">
              144
            </a>{' '}
            (Rettung) oder{' '}
            <a href="tel:142" className="underline">
              142
            </a>{' '}
            (Telefonseelsorge, 24/7 kostenlos).
          </p>
        </div>
      </div>
    </div>
  );
}
