interface MicrositeServicesProps {
  services: string[];
  modalities: string[];
}

export function MicrositeServices({ services, modalities }: MicrositeServicesProps) {
  if ((!services || services.length === 0) && (!modalities || modalities.length === 0)) {
    return null;
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-900">Angebot & Modalitäten</h2>

      {services && services.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Leistungen</h3>
          <ul className="space-y-2">
            {services.map((service) => (
              <li key={service} className="flex items-start gap-2 text-gray-700">
                <span className="text-teal-600 mt-1">✓</span>
                <span>{service}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modalities && modalities.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-3 text-gray-800">Format</h3>
          <div className="flex flex-wrap gap-2">
            {modalities.map((modality) => (
              <span
                key={modality}
                className="inline-flex items-center px-3 py-1 rounded-md text-sm bg-gray-100 text-gray-800"
              >
                {modality}
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
