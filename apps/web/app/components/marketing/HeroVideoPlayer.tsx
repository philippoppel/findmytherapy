interface HeroVideoPlayerProps {
  posterSrc?: string;
}

export function HeroVideoPlayer({ posterSrc }: HeroVideoPlayerProps) {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:max-w-md xl:max-w-lg aspect-[9/16] rounded-3xl overflow-hidden transition-transform duration-300 hover:scale-[1.02] hover:-rotate-[0.5deg]">
      {/* Glassmorphism frame */}
      <div className="absolute -inset-1 rounded-[28px] bg-gradient-to-br from-white/80 via-white/60 to-white/40 backdrop-blur-xl shadow-2xl" />

      {/* Inner border glow */}
      <div className="absolute inset-0 rounded-3xl border-2 border-white/50 shadow-[inset_0_0_30px_rgba(255,255,255,0.3)]" />

      {/* Video container */}
      <div className="relative h-full w-full rounded-3xl overflow-hidden bg-neutral-100">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={posterSrc}
          className="h-full w-full object-cover brightness-95"
          title="Geführter Start: Sag uns, was los ist"
          aria-label="Kurzer Einblick in den geführten Einstieg zur Psychotherapie"
        >
          <source src="/videos/hero-therapy.mp4" type="video/mp4" />
          <track
            kind="captions"
            srcLang="de"
            label="Deutsch"
            src="/videos/hero-therapy-captions.vtt"
            default
          />
          Dein Browser unterstützt keine Videos.
        </video>

        {/* Soft overlay for better button contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-white/20" />
      </div>

      {/* Decorative floating elements */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 opacity-60 blur-sm animate-float-up" />
      <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full bg-gradient-to-br from-secondary-200 to-secondary-300 opacity-50 blur-sm animate-float-down" />
    </div>
  );
}
