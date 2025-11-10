interface MicrositeAboutProps {
  about?: string | null;
  approachSummary?: string | null;
  experienceSummary?: string | null;
}

export function MicrositeAbout({
  about,
  approachSummary,
  experienceSummary,
}: MicrositeAboutProps) {
  if (!about && !approachSummary && !experienceSummary) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Über mich</h2>

      {about && (
        <div className="prose prose-lg max-w-none mb-6">
          <p className="text-gray-700 whitespace-pre-line">{about}</p>
        </div>
      )}

      {approachSummary && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Mein Ansatz</h3>
          <p className="text-gray-700 whitespace-pre-line">{approachSummary}</p>
        </div>
      )}

      {experienceSummary && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Meine Erfahrung</h3>
          <p className="text-gray-700 whitespace-pre-line">{experienceSummary}</p>
        </div>
      )}
    </section>
  );
}
