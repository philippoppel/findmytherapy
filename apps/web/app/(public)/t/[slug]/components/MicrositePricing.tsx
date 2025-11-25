interface MicrositePricingProps {
  priceMin?: number | null;
  priceMax?: number | null;
  pricingNote?: string | null;
  languages: string[];
  city?: string | null;
  country: string;
  online: boolean;
  acceptingClients: boolean;
  responseTime?: string | null;
  availabilityNote?: string | null;
  ageGroups?: string[];
  acceptedInsurance?: string[];
  privatePractice?: boolean;
}

export function MicrositePricing({
  priceMin,
  priceMax,
  pricingNote,
  languages,
  city,
  country,
  online,
  acceptingClients,
  responseTime,
  availabilityNote,
  ageGroups,
  acceptedInsurance,
  privatePractice,
}: MicrositePricingProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Auf einen Blick</h3>

      {privatePractice && (
        <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200">
          <span>🏥</span>
          <span>Privatpraxis</span>
        </div>
      )}

      <dl className="space-y-4">
        {/* Pricing */}
        {(priceMin || priceMax) && (
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Preis pro Sitzung</dt>
            <dd className="text-lg font-semibold text-gray-900">
              {priceMin && priceMax && priceMin !== priceMax
                ? `${formatPrice(priceMin)} - ${formatPrice(priceMax)}`
                : formatPrice(priceMin || priceMax!)}
            </dd>
            {pricingNote && <dd className="text-sm text-gray-600 mt-1">{pricingNote}</dd>}
          </div>
        )}

        {/* Location */}
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Standort</dt>
          <dd className="text-gray-900">
            {city ? `${city}, ${country}` : country}
            {online && <span className="block text-sm text-primary-600">+ Online möglich</span>}
          </dd>
        </div>

        {/* Languages */}
        {languages && languages.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Sprachen</dt>
            <dd className="text-gray-900">{languages.join(', ')}</dd>
          </div>
        )}

        {/* Availability */}
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Verfügbarkeit</dt>
          <dd className="text-gray-900">
            {acceptingClients ? (
              <span className="flex items-center gap-1 text-green-600">
                <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                Nimmt neue Klient:innen an
              </span>
            ) : (
              <span className="text-orange-600">Warteliste</span>
            )}
            {responseTime && (
              <span className="block text-sm text-gray-600 mt-1">Antwortzeit: {responseTime}</span>
            )}
            {availabilityNote && (
              <span className="block text-sm text-gray-600 mt-1">{availabilityNote}</span>
            )}
          </dd>
        </div>

        {/* Age Groups */}
        {ageGroups && ageGroups.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Altersgruppen</dt>
            <dd className="text-gray-900">
              <div className="flex flex-wrap gap-2">
                {ageGroups.map((ageGroup, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-1 rounded-md text-sm bg-gray-100 text-gray-700"
                  >
                    {ageGroup}
                  </span>
                ))}
              </div>
            </dd>
          </div>
        )}

        {/* Accepted Insurance */}
        {acceptedInsurance && acceptedInsurance.length > 0 && (
          <div>
            <dt className="text-sm font-medium text-gray-500 mb-1">Akzeptierte Versicherungen</dt>
            <dd className="text-gray-900">
              <ul className="text-sm space-y-1">
                {acceptedInsurance.map((insurance, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span>
                    <span>{insurance}</span>
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        )}
      </dl>
    </div>
  );
}
