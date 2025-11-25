interface MicrositeQualificationsProps {
  qualifications: string[];
}

export function MicrositeQualifications({ qualifications }: MicrositeQualificationsProps) {
  if (!qualifications || qualifications.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Qualifikationen & Zertifikate</h2>

      <div className="space-y-3">
        {qualifications.map((qualification, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-primary-50 border border-primary-100"
          >
            <span className="text-2xl flex-shrink-0" aria-hidden="true">
              🎓
            </span>
            <span className="text-gray-800 leading-relaxed">{qualification}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
