// src/components/GalleryPreview.jsx
import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const GalleryPreview = () => {
  const { t } = useLanguage();
  const [selectedImage, setSelectedImage] = useState(null);

  const images = [
    {
      url: '/entrance.jpg',
      alt: 'White entrance gate of La Casa de Teresita boutique hotel in Sucre, Bolivia'
    },
    {
      url: '/piano.webp',
      alt: 'Cozy common area with piano'
    },
    {
      url: '/library.webp',
      alt: 'Historic library collection'
    },
    {
      url: '/building.webp',
      alt: 'Building front to the garden'
    },
    {
      url: '/garden1.webp',
      alt: 'Historic garden at La Casa de Teresita'
    },
    {
      url: '/desayuno2.webp',
      alt: 'Delicious breakfast spread'
    }
  ];

  const openLightbox = (index) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section id="gallery" className="py-20 bg-[#2D5A4A]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2
          className="text-4xl md:text-5xl font-bold text-white text-center mb-16"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.gallery.title}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-lg cursor-pointer group"
              onClick={() => openLightbox(index)}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-semibold">
                  View
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-[#C4A96A] transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 text-white hover:text-[#C4A96A] transition-colors"
          >
            <ChevronLeft className="h-12 w-12" />
          </button>

          <button
            onClick={nextImage}
            className="absolute right-4 text-white hover:text-[#C4A96A] transition-colors"
          >
            <ChevronRight className="h-12 w-12" />
          </button>

          <img
            src={images[selectedImage].url}
            alt={images[selectedImage].alt}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}
    </section>
  );
};

export default GalleryPreview;