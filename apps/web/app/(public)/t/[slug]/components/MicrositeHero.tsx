import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, Calendar, MapPin, Award, Globe, Star } from 'lucide-react';

interface MicrositeHeroProps {
  profile: {
    displayName: string;
    title?: string | null;
    headline?: string | null;
    profileImageUrl?: string | null;
    city?: string | null;
    country: string;
    yearsExperience?: number | null;
    socialLinkedin?: string | null;
    socialInstagram?: string | null;
    socialFacebook?: string | null;
    websiteUrl?: string | null;
    online?: boolean | null;
    acceptingClients?: boolean | null;
    micrositeSlug?: string | null;
    rating?: number | null;
    reviewCount?: number | null;
  };
}

export function MicrositeHero({ profile }: MicrositeHeroProps) {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative container mx-auto px-4 py-12 md:py-16 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {profile.profileImageUrl ? (
              <div className="relative w-36 h-36 md:w-44 md:h-44">
                <Image
                  src={profile.profileImageUrl}
                  alt={profile.displayName}
                  fill
                  className="rounded-2xl object-cover object-top shadow-2xl border-4 border-white/20 ring-4 ring-white/10"
                  priority
                  quality={90}
                />
              </div>
            ) : (
              <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center shadow-2xl border-4 border-white/20">
                <span className="text-5xl font-bold text-white/90">
                  {profile.displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-3 mb-3">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">
                {profile.displayName}
              </h1>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm">
                  <Award className="w-4 h-4" />
                  Verifiziert
                </span>
                {profile.rating && profile.reviewCount !== null && profile.reviewCount > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-yellow-500/30 backdrop-blur-sm border border-yellow-400/30">
                    <Star className="w-4 h-4 fill-yellow-300 text-yellow-300" />
                    {profile.rating.toFixed(1)}
                    <span className="text-white/70">({profile.reviewCount})</span>
                  </span>
                )}
              </div>
            </div>

            {profile.title && (
              <p className="text-lg md:text-xl text-primary-100 mb-3">{profile.title}</p>
            )}

            {profile.headline && (
              <p className="text-base md:text-lg text-white/90 mb-4 max-w-2xl leading-relaxed">
                {profile.headline}
              </p>
            )}

            {/* Meta Info Badges */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-6">
              {profile.city && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-sm">
                  <MapPin className="w-4 h-4" />
                  {profile.city}
                </span>
              )}
              {profile.online && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-sm">
                  <Globe className="w-4 h-4" />
                  Online verfügbar
                </span>
              )}
              {profile.yearsExperience && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm text-sm">
                  <Award className="w-4 h-4" />
                  {profile.yearsExperience} Jahre Erfahrung
                </span>
              )}
              {profile.acceptingClients && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/30 border border-green-400/30 text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  Nimmt neue Klient:innen an
                </span>
              )}
            </div>

            {/* CTA Buttons - prominent */}
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
              <Link
                href={`/t/${profile.micrositeSlug}#kontakt`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary-700 font-semibold shadow-lg hover:bg-primary-50 transition-all hover:shadow-xl"
              >
                <MessageCircle className="w-5 h-5" />
                Termin anfragen
              </Link>
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 backdrop-blur-sm border-2 border-white/30 font-medium hover:bg-white/20 transition-all"
              >
                Mehr erfahren
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
