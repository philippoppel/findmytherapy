import Image from 'next/image';

interface MicrositeHeroProps {
  profile: {
    displayName: string;
    title?: string | null;
    headline?: string | null;
    profileImageUrl?: string | null;
    city?: string | null;
    country: string;
    rating?: number | null;
    reviewCount?: number | null;
    yearsExperience?: number | null;
  };
}

export function MicrositeHero({ profile }: MicrositeHeroProps) {
  return (
    <section className="bg-gradient-to-br from-teal-50 to-blue-50 py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {profile.profileImageUrl ? (
              <div className="relative w-40 h-40 md:w-48 md:h-48">
                <Image
                  src={profile.profileImageUrl}
                  alt={profile.displayName}
                  fill
                  className="rounded-full object-cover shadow-lg border-4 border-white"
                  priority
                />
              </div>
            ) : (
              <div className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-teal-200 flex items-center justify-center shadow-lg border-4 border-white">
                <span className="text-5xl font-bold text-teal-700">
                  {profile.displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                {profile.displayName}
              </h1>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-teal-100 text-teal-800">
                ✓ Verifiziert
              </span>
            </div>

            {profile.title && (
              <p className="text-xl text-gray-600 mb-4">{profile.title}</p>
            )}

            {profile.headline && (
              <p className="text-lg text-gray-700 mb-4 max-w-2xl">
                {profile.headline}
              </p>
            )}

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-600">
              {profile.city && (
                <span className="flex items-center gap-1">
                  📍 {profile.city}, {profile.country}
                </span>
              )}
              {profile.yearsExperience && (
                <span className="flex items-center gap-1">
                  🎓 {profile.yearsExperience} Jahre Erfahrung
                </span>
              )}
              {profile.rating && (
                <span className="flex items-center gap-1">
                  ⭐ {profile.rating.toFixed(1)} ({profile.reviewCount || 0} Bewertungen)
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
