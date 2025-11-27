'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Heart, Star, Sparkles, BookOpen, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';

// Authentic testimonials data
const testimonials = [
  // Patient testimonials
  {
    id: 1,
    category: 'patient',
    name: 'Lisa M.',
    location: 'Wien',
    avatar: 'L',
    avatarBg: 'from-rose-400 to-pink-500',
    quote: 'Nach Jahren der Unsicherheit habe ich endlich den Mut gefunden, mir Hilfe zu suchen. Die Ersteinschätzung hat mir gezeigt, dass meine Gefühle valid sind. Innerhalb einer Woche hatte ich meinen ersten Termin bei einer wunderbaren Therapeutin, die wirklich zu mir passt.',
    highlight: 'Innerhalb einer Woche zum passenden Therapeuten',
    rating: 5,
    feature: 'matching',
  },
  {
    id: 2,
    category: 'patient',
    name: 'Markus W.',
    location: 'Graz',
    avatar: 'M',
    avatarBg: 'from-blue-400 to-indigo-500',
    quote: 'Die Ratgeber-Artikel haben mir in einer sehr dunklen Zeit geholfen. Besonders der Artikel über Panikattacken – ich habe ihn mitten in der Nacht gelesen und zum ersten Mal das Gefühl gehabt, dass jemand versteht, was in mir vorgeht.',
    highlight: 'Die Wissensbasis als Soforthilfe',
    rating: 5,
    feature: 'knowledge',
  },
  {
    id: 3,
    category: 'patient',
    name: 'Sophie K.',
    location: 'Salzburg',
    avatar: 'S',
    avatarBg: 'from-amber-400 to-orange-500',
    quote: 'Ich war skeptisch gegenüber Online-Tools, aber der Selbsttest hat mir die Augen geöffnet. Die Ergebnisse konnte ich direkt an meine Therapeutin schicken – das hat unser erstes Gespräch so viel einfacher gemacht.',
    highlight: 'Der Selbsttest als Türöffner',
    rating: 5,
    feature: 'assessment',
  },
  // Therapist testimonials
  {
    id: 4,
    category: 'therapist',
    name: 'Dr. Anna Berger',
    location: 'Wien',
    title: 'Psychotherapeutin – Verhaltenstherapie',
    avatar: 'A',
    avatarBg: 'from-emerald-400 to-teal-500',
    quote: 'FindMyTherapy hat meine Praxis verändert. Die Vorberichte mit PHQ-9 und GAD-7 Werten sparen mir wertvolle Zeit im Erstgespräch. Meine Klient:innen kommen vorbereitet und ich kann sofort dort ansetzen, wo es wirklich zählt.',
    highlight: 'Vorbereitete Erstgespräche',
    rating: 5,
    feature: 'for-therapists',
  },
  {
    id: 5,
    category: 'therapist',
    name: 'Mag. Thomas Reiter',
    location: 'Linz',
    title: 'Psychotherapeut – Systemische Therapie',
    avatar: 'T',
    avatarBg: 'from-purple-400 to-violet-500',
    quote: 'Endlich eine Plattform, die versteht, was wir Therapeut:innen brauchen. Die automatische Praxis-Website hat mir Tausende Euro und unzählige Stunden gespart. Und die Qualität der Anfragen ist spürbar besser.',
    highlight: 'Qualifizierte Patient:innen-Anfragen',
    rating: 5,
    feature: 'for-therapists',
  },
  {
    id: 6,
    category: 'patient',
    name: 'Julia H.',
    location: 'Innsbruck',
    avatar: 'J',
    avatarBg: 'from-cyan-400 to-blue-500',
    quote: 'Als alleinerziehende Mutter hatte ich kaum Zeit für mich selbst. Die Online-Kurse haben mir ermöglicht, an meiner mentalen Gesundheit zu arbeiten – abends, wenn die Kinder im Bett waren. Kleine Schritte, große Wirkung.',
    highlight: 'Flexible Selbsthilfe im Alltag',
    rating: 5,
    feature: 'courses',
  },
];

const categoryLabels = {
  patient: 'Patient:innen',
  therapist: 'Therapeut:innen',
};

const featureIcons = {
  matching: Heart,
  knowledge: BookOpen,
  assessment: Sparkles,
  'for-therapists': Star,
  courses: BookOpen,
};

const AUTO_PLAY_INTERVAL = 5000; // 5 seconds per slide

export function TestimonialsSection() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'patient' | 'therapist'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const filteredTestimonials = activeCategory === 'all'
    ? testimonials
    : testimonials.filter(t => t.category === activeCategory);

  const visibleTestimonials = filteredTestimonials.slice(currentIndex, currentIndex + 3);
  const totalSlides = Math.max(1, filteredTestimonials.length - 2); // Number of possible positions

  const canGoPrev = currentIndex > 0;

  const goNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev + 3 < filteredTestimonials.length) {
        return prev + 1;
      }
      // Loop back to start
      return 0;
    });
  }, [filteredTestimonials.length]);

  const goPrev = () => {
    if (canGoPrev) setCurrentIndex(prev => prev - 1);
  };

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying || isPaused) return;

    const interval = setInterval(() => {
      goNext();
    }, AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isPaused, goNext]);

  // Reset index when category changes
  const handleCategoryChange = (category: 'all' | 'patient' | 'therapist') => {
    setActiveCategory(category);
    setCurrentIndex(0);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(prev => !prev);
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-primary-50/30 to-white" />

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700 mb-4">
              <Heart className="w-4 h-4 fill-primary-500 text-primary-500" />
              Echte Geschichten
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Menschen, die ihren Weg <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-600">
                gefunden haben
              </span>
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Ob Patient:in oder Therapeut:in – lies, wie FindMyTherapy dabei hilft,
              die richtige Unterstützung zu finden.
            </p>
          </motion.div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-2xl bg-gray-100 p-1.5 gap-1">
            {[
              { key: 'all', label: 'Alle Stimmen' },
              { key: 'patient', label: 'Patient:innen' },
              { key: 'therapist', label: 'Therapeut:innen' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => handleCategoryChange(cat.key as 'all' | 'patient' | 'therapist')}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  activeCategory === cat.key
                    ? 'bg-white text-primary-700 shadow-md'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Testimonials Grid */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Navigation Arrows */}
          <div className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => { goPrev(); setIsAutoPlaying(false); }}
              disabled={!canGoPrev}
              className={`p-3 rounded-full bg-white shadow-lg border border-gray-100 transition-all ${
                canGoPrev
                  ? 'hover:shadow-xl hover:scale-110 text-gray-700'
                  : 'opacity-40 cursor-not-allowed text-gray-400'
              }`}
              aria-label="Vorherige Erfahrungsberichte"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
          <div className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10">
            <button
              onClick={() => { goNext(); setIsAutoPlaying(false); }}
              className="p-3 rounded-full bg-white shadow-lg border border-gray-100 transition-all hover:shadow-xl hover:scale-110 text-gray-700"
              aria-label="Nächste Erfahrungsberichte"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeCategory}-${currentIndex}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {visibleTestimonials.map((testimonial, index) => {
                const FeatureIcon = featureIcons[testimonial.feature as keyof typeof featureIcons] || Star;

                return (
                  <motion.article
                    key={testimonial.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group relative"
                  >
                    <div className="relative h-full bg-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-gray-200/50 border border-gray-100 hover:shadow-xl hover:border-primary-100 transition-all duration-300">
                      {/* Quote Icon */}
                      <div className="absolute -top-3 -left-3 w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform">
                        <Quote className="w-5 h-5 text-white" />
                      </div>

                      {/* Category Badge */}
                      <div className="flex items-center justify-between mb-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                          testimonial.category === 'therapist'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}>
                          <FeatureIcon className="w-3 h-3" />
                          {categoryLabels[testimonial.category]}
                        </span>

                        {/* Stars */}
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-gray-700 leading-relaxed mb-6 min-h-[120px]">
                        &ldquo;{testimonial.quote}&rdquo;
                      </blockquote>

                      {/* Highlight */}
                      <div className="mb-6 p-3 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl border border-primary-100">
                        <p className="text-sm font-semibold text-primary-700 flex items-center gap-2">
                          <Sparkles className="w-4 h-4" />
                          {testimonial.highlight}
                        </p>
                      </div>

                      {/* Author */}
                      <footer className="flex items-center gap-4 pt-4 border-t border-gray-100">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.avatarBg} flex items-center justify-center text-white font-bold text-lg shadow-md`}>
                          {testimonial.avatar}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{testimonial.name}</p>
                          <p className="text-sm text-gray-500">
                            {'title' in testimonial ? testimonial.title : testimonial.location}
                          </p>
                        </div>
                      </footer>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Progress Dots & Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            {/* Mobile Prev Button */}
            <button
              onClick={() => { goPrev(); setIsAutoPlaying(false); }}
              disabled={!canGoPrev}
              className={`lg:hidden p-2.5 rounded-full bg-white shadow-md border border-gray-100 ${
                canGoPrev ? 'text-gray-700' : 'opacity-40 text-gray-400'
              }`}
              aria-label="Vorherige"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Progress Dots */}
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setCurrentIndex(i); setIsAutoPlaying(false); }}
                  className="group relative"
                  aria-label={`Slide ${i + 1}`}
                >
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentIndex
                        ? 'w-8 bg-primary-500'
                        : 'w-2 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                  {/* Auto-play progress indicator */}
                  {i === currentIndex && isAutoPlaying && !isPaused && (
                    <motion.div
                      className="absolute inset-0 h-2 rounded-full bg-primary-300 origin-left"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: AUTO_PLAY_INTERVAL / 1000, ease: 'linear' }}
                      key={`progress-${currentIndex}`}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Play/Pause Button */}
            <button
              onClick={toggleAutoPlay}
              className="p-2.5 rounded-full bg-white shadow-md border border-gray-100 text-gray-600 hover:text-primary-600 hover:border-primary-200 transition-all"
              aria-label={isAutoPlaying ? 'Pause' : 'Play'}
            >
              {isAutoPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Next Button */}
            <button
              onClick={() => { goNext(); setIsAutoPlaying(false); }}
              className="lg:hidden p-2.5 rounded-full bg-white shadow-md border border-gray-100 text-gray-700"
              aria-label="Nächste"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex flex-wrap items-center justify-center gap-6 sm:gap-10 px-8 py-5 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['from-rose-400 to-pink-500', 'from-blue-400 to-indigo-500', 'from-emerald-400 to-teal-500', 'from-amber-400 to-orange-500'].map((bg, i) => (
                  <div key={i} className={`w-8 h-8 rounded-full bg-gradient-to-br ${bg} border-2 border-white flex items-center justify-center text-white text-xs font-bold`}>
                    {['L', 'M', 'A', 'T'][i]}
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">+500 zufriedene Nutzer:innen</span>
            </div>
            <div className="h-8 w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1,2,3,4,5].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-gray-600 font-medium">4.9 / 5 Sterne</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
