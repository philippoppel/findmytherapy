interface MicrositeExpertiseProps {
  specialties: string[];
}

export function MicrositeExpertise({ specialties }: MicrositeExpertiseProps) {
  if (!specialties || specialties.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Spezialisierungen</h2>
      <div className="flex flex-wrap gap-3">
        {specialties.map((specialty) => (
          <span
            key={specialty}
            className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors"
          >
            {specialty}
          </span>
        ))}
      </div>
    </section>
  );
}
