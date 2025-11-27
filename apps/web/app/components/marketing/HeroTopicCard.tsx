'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { HeroTopic } from './heroTopicsConfig';

interface HeroTopicCardProps {
  topic: HeroTopic;
  index: number;
  isMobile?: boolean;
}

export function HeroTopicCard({ topic, index, isMobile = false }: HeroTopicCardProps) {
  // Different rotation for visual interest
  const rotation = index % 2 === 0 ? '-2deg' : '2deg';

  // CSS animation delay based on index
  const animationDelay = `${topic.animation.delay}s`;

  return (
    <>
      {/* CSS for floating animation */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes float-${index} {
          0%, 100% { transform: rotate(${rotation}) translateY(0) translateX(0); }
          25% { transform: rotate(${rotation}) translateY(-${topic.animation.yOffset * 1.2}px) translateX(${topic.animation.xOffset * 0.5}px); }
          50% { transform: rotate(${rotation}) translateY(0) translateX(0); }
          75% { transform: rotate(${rotation}) translateY(${topic.animation.yOffset * 0.8}px) translateX(-${topic.animation.xOffset * 0.3}px); }
        }
        .float-card-${index} {
          animation: float-${index} ${topic.animation.duration}s ease-in-out infinite;
          animation-delay: ${animationDelay};
        }
        @media (prefers-reduced-motion: reduce) {
          .float-card-${index} {
            animation: none;
            transform: rotate(${rotation});
          }
        }
      `}} />
      <Link
        href={topic.targetSection}
        className={`
          group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded-2xl block
          float-card-${index}
          transition-all duration-300 ease-out
          hover:scale-[1.08] hover:-translate-y-2 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)]
          ${isMobile ? 'flex-shrink-0 w-32 h-40' : 'w-44 h-52 lg:w-52 lg:h-64 xl:w-60 xl:h-72'}
        `}
        aria-label={`Mehr erfahren: ${topic.label}`}
      >
        {/* Glass card container */}
        <div className="relative h-full w-full overflow-hidden rounded-2xl border border-white/70 bg-white/80 shadow-lg backdrop-blur-sm transition-shadow duration-300 group-hover:shadow-xl">
          {/* Image section */}
          <div className="relative h-3/4 overflow-hidden">
            <Image
              src={topic.imageSrc}
              alt={topic.imageAlt}
              fill
              sizes={isMobile ? '128px' : '(min-width: 1280px) 176px, (min-width: 1024px) 160px, 144px'}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              priority={index < 4}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          </div>

          {/* Label section */}
          <div className="absolute bottom-0 inset-x-0 p-2 lg:p-3">
            <span className="inline-flex items-center justify-center w-full rounded-full bg-white/95 px-3 py-1.5 text-xs lg:text-sm font-semibold text-neutral-800 shadow-sm transition-colors duration-200 group-hover:bg-primary-50 group-hover:text-primary-900">
              {topic.label}
            </span>
          </div>

          {/* Hover glow effect */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary-200/30 via-transparent to-secondary-200/20 pointer-events-none" />
        </div>
      </Link>
    </>
  );
}
