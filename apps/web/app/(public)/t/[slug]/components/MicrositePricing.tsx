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
}: MicrositePricingProps) {
  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('de-AT', {
      style: 'currency',
      currency: 'EUR',
    }).format(cents / 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
      <h3 className="text-xl font-semibold mb-4 text-gray-900">Auf einen Blick</h3>

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
            {pricingNote && (
              <dd className="text-sm text-gray-600 mt-1">{pricingNote}</dd>
            )}
          </div>
        )}

        {/* Location */}
        <div>
          <dt className="text-sm font-medium text-gray-500 mb-1">Standort</dt>
          <dd className="text-gray-900">
            {city ? `${city}, ${country}` : country}
            {online && <span className="block text-sm text-teal-600">+ Online möglich</span>}
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
              <span className="block text-sm text-gray-600 mt-1">
                Antwortzeit: {responseTime}
              </span>
            )}
            {availabilityNote && (
              <span className="block text-sm text-gray-600 mt-1">{availabilityNote}</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
