'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

interface MicrositeGalleryProps {
  images: string[];
  therapistName: string;
}

export function MicrositeGallery({ images, therapistName }: MicrositeGalleryProps) {
  const { t } = useTranslation();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!lightboxOpen) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'ArrowLeft') prevImage();
  };

  return (
    <>
      <section className="bg-white rounded-lg shadow-sm p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-900">{t('gallery.title')}</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <button
              key={index}
              onClick={() => openLightbox(index)}
              className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <Image
                src={imageUrl}
                alt={t('gallery.imageAlt', { name: therapistName, index: (index + 1).toString() })}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity duration-300" />
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxOpen && (
        <button
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4 border-0"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          aria-label={t('gallery.closeLightbox')}
          type="button"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 text-4xl font-light w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white rounded-full"
            aria-label={t('gallery.close')}
          >
            ×
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              className="absolute left-4 text-white hover:text-gray-300 text-4xl font-light w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              aria-label={t('gallery.previousImage')}
            >
              ‹
            </button>
          )}

          {/* Image */}
          <button
            className="relative max-w-5xl max-h-[80vh] w-full h-full border-0 bg-transparent"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
            type="button"
            aria-label={t('gallery.image')}
          >
            <Image
              src={images[currentImageIndex]}
              alt={t('gallery.imageAlt', { name: therapistName, index: (currentImageIndex + 1).toString() })}
              fill
              className="object-contain"
              sizes="100vw"
              priority
            />
          </button>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 text-white hover:text-gray-300 text-4xl font-light w-12 h-12 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-white rounded-full"
              aria-label={t('gallery.nextImage')}
            >
              ›
            </button>
          )}

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
              {t('gallery.imageCounter', { current: (currentImageIndex + 1).toString(), total: images.length.toString() })}
            </div>
          )}
        </button>
      )}
    </>
  );
}
