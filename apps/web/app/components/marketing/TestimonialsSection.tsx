import { Quote, Heart, Star, Sparkles } from 'lucide-react';

// Testimonials data - mehr für den Eindruck vieler Reviews
const testimonials = [
  {
    id: 1,
    name: 'Lisa M.',
    location: 'Wien',
    avatar: 'L',
    avatarBg: 'from-rose-400 to-pink-500',
    quote: 'Innerhalb einer Woche hatte ich meinen ersten Termin bei einer wunderbaren Therapeutin, die wirklich zu mir passt.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Markus W.',
    location: 'Graz',
    avatar: 'M',
    avatarBg: 'from-blue-400 to-indigo-500',
    quote: 'Die Ratgeber-Artikel haben mir in einer sehr dunklen Zeit geholfen. Endlich fühle ich mich verstanden.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Dr. Anna B.',
    location: 'Psychotherapeutin',
    avatar: 'A',
    avatarBg: 'from-emerald-400 to-teal-500',
    quote: 'Die Vorberichte sparen mir wertvolle Zeit im Erstgespräch. Meine Klient:innen kommen vorbereitet.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sophie K.',
    location: 'Salzburg',
    avatar: 'S',
    avatarBg: 'from-amber-400 to-orange-500',
    quote: 'Der Selbsttest hat mir die Augen geöffnet. Ich konnte die Ergebnisse direkt an meine Therapeutin schicken.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Mag. Thomas R.',
    location: 'Psychotherapeut',
    avatar: 'T',
    avatarBg: 'from-purple-400 to-violet-500',
    quote: 'Endlich eine Plattform, die versteht, was wir Therapeut:innen brauchen. Die Qualität der Anfragen ist spürbar besser.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Julia H.',
    location: 'Innsbruck',
    avatar: 'J',
    avatarBg: 'from-cyan-400 to-blue-500',
    quote: 'Als alleinerziehende Mutter haben mir die Online-Kurse ermöglicht, an meiner mentalen Gesundheit zu arbeiten.',
    rating: 5,
  },
  {
    id: 7,
    name: 'Michael P.',
    location: 'Linz',
    avatar: 'M',
    avatarBg: 'from-teal-400 to-green-500',
    quote: 'Nach 6 Monaten Wartezeit woanders – hier hatte ich in 3 Tagen einen Termin. Unglaublich!',
    rating: 5,
  },
  {
    id: 8,
    name: 'Elena S.',
    location: 'Klagenfurt',
    avatar: 'E',
    avatarBg: 'from-pink-400 to-rose-500',
    quote: 'Die Ersteinschätzung war der erste Schritt. Heute geht es mir so viel besser.',
    rating: 5,
  },
];

// Duplicate for seamless loop
const allTestimonials = [...testimonials, ...testimonials];

function TestimonialCard({ testimonial }: { testimonial: typeof testimonials[0] }) {
  return (
    <div className="flex-shrink-0 w-[320px] sm:w-[380px]">
      <div className="relative h-full bg-surface-1 rounded-2xl p-5 sm:p-6 shadow-lg shadow-primary-200/30 border border-primary-100/50 hover:shadow-xl hover:border-primary-200 transition-all duration-300">
        {/* Quote Icon */}
        <div className="absolute -top-2.5 -left-2.5 w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
          <Quote className="w-4 h-4 text-white" />
        </div>

        {/* Stars */}
        <div className="flex items-center gap-0.5 mb-3 ml-6">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Quote */}
        <blockquote className="text-muted text-sm sm:text-base leading-relaxed mb-4 line-clamp-3">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>

        {/* Author */}
        <footer className="flex items-center gap-3 pt-3 border-t border-divider">
          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${testimonial.avatarBg} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
            {testimonial.avatar}
          </div>
          <div>
            <p className="font-semibold text-default text-sm">{testimonial.name}</p>
            <p className="text-xs text-muted">{testimonial.location}</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export function TestimonialsSection() {
  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* CSS for marquee animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
        .animate-marquee-left {
          animation: marquee-left 60s linear infinite;
        }
        .animate-marquee-right {
          animation: marquee-right 70s linear infinite;
        }
      `}} />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[rgb(var(--bg))] via-primary-50/30 to-[rgb(var(--bg))]" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />

      <div className="relative">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 px-4">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-900 mb-4">
              <Heart className="w-4 h-4 fill-primary-500 text-primary-500" />
              Über 500+ zufriedene Nutzer:innen
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-default mb-4">
              Was unsere Community sagt
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Patient:innen und Therapeut:innen teilen ihre Erfahrungen
            </p>
          </div>
        </div>

        {/* Infinite Scroll Marquee - Row 1 (left to right) */}
        <div className="relative mb-6">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[rgb(var(--bg))] via-[rgb(var(--bg)/0.8)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[rgb(var(--bg))] via-[rgb(var(--bg)/0.8)] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 sm:gap-6 animate-marquee-left" style={{ width: 'max-content' }}>
            {allTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`row1-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
            {allTestimonials.map((testimonial, index) => (
              <TestimonialCard key={`row1-dup-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Infinite Scroll Marquee - Row 2 (right to left, offset) */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-r from-[rgb(var(--bg))] via-[rgb(var(--bg)/0.8)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 sm:w-40 bg-gradient-to-l from-[rgb(var(--bg))] via-[rgb(var(--bg)/0.8)] to-transparent z-10 pointer-events-none" />

          <div className="flex gap-5 sm:gap-6 animate-marquee-right" style={{ width: 'max-content' }}>
            {[...allTestimonials].reverse().map((testimonial, index) => (
              <TestimonialCard key={`row2-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
            {[...allTestimonials].reverse().map((testimonial, index) => (
              <TestimonialCard key={`row2-dup-${testimonial.id}-${index}`} testimonial={testimonial} />
            ))}
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-12 sm:mt-16 text-center px-4">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-6 sm:px-8 py-4 sm:py-5 bg-surface-1/80 backdrop-blur rounded-2xl shadow-sm border border-primary-100/50">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['from-rose-400 to-pink-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500'].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${bg} border-2 border-surface-1 flex items-center justify-center text-white text-xs font-bold`}>
                    {['L', 'M', 'A', 'T'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-muted font-medium">+500 Nutzer:innen</span>
            </div>
            <div className="h-8 w-px bg-divider hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1,2,3,4,5].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-muted font-medium">4.9 / 5 Sterne</span>
            </div>
            <div className="h-8 w-px bg-divider hidden sm:block" />
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              <span className="text-sm text-muted font-medium">Verifizierte Bewertungen</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
