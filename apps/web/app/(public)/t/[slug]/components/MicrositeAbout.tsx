import { Heart, Sparkles, Briefcase, Quote } from 'lucide-react';

interface MicrositeAboutProps {
  about?: string | null;
  approachSummary?: string | null;
  experienceSummary?: string | null;
}

export function MicrositeAbout({ about, approachSummary, experienceSummary }: MicrositeAboutProps) {
  if (!about && !approachSummary && !experienceSummary) {
    return null;
  }

  return (
    <section id="about" className="bg-white rounded-lg shadow-sm p-8 scroll-mt-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Über mich</h2>

      {about && (
        <div className="prose prose-lg max-w-none mb-8">
          <p className="text-gray-700 whitespace-pre-line leading-relaxed">{about}</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {approachSummary && (
          <div className="relative bg-gradient-to-br from-primary-50 to-primary-100/50 rounded-xl p-6 border border-primary-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary-600 text-white">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Mein Ansatz</h3>
            </div>
            <div className="relative">
              <Quote className="absolute -top-2 -left-1 w-6 h-6 text-primary-300 transform rotate-180" />
              <p className="text-gray-700 whitespace-pre-line leading-relaxed pl-6 italic">
                {approachSummary}
              </p>
            </div>
          </div>
        )}

        {experienceSummary && (
          <div className="relative bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-6 border border-amber-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-amber-500 text-white">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Meine Erfahrung</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {experienceSummary}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
