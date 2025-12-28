// src/components/museum/ScrollMiniature.jsx
import { useState, useEffect } from 'react';

const ScrollMiniature = ({ artwork, scrollPosition }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasAppeared, setHasAppeared] = useState(false);
  
  // Détecter si on est sur mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Gérer l'apparition après un certain seuil de scroll
  useEffect(() => {
    // Seuil pour l'apparition (300px de scroll)
    if (scrollPosition > 300 && !hasAppeared) {
      setIsVisible(true);
      setHasAppeared(true);
    }
  }, [scrollPosition, hasAppeared]);
  
  if (!isVisible || !artwork) return null;

  // Déterminer l'image et l'alt (priorité: image > featuredImage.src)
  const imageSrc = artwork.image || artwork.featuredImage?.src;
  const imageAlt = artwork.title || artwork.featuredImage?.alt || 'Artwork';

  // Si aucune image n'est disponible, ne rien afficher
  if (!imageSrc) return null;

  // Tailles fixes selon le device
  const baseSize = isMobile ? 60 : 80;
  
  // Tailles augmentées
  const mobileSize = Math.round(baseSize * 1.18);  // +18%
  const desktopSize = Math.round(baseSize * 1.8);   // +80%
  
  // Taille actuelle
  const currentSize = isMobile ? mobileSize : desktopSize;

  // Image de remplacement en cas d'erreur
  const handleImageError = (e) => {
    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%23C4A96A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>';
  };

  return (
    <div 
      className="fixed top-24 left-4 sm:left-6 z-40"
      style={{
        animation: 'miniatureAppear 0.5s ease-out forwards'
      }}
    >
      <div className="relative group">
        {/* Miniature principale - simple et propre */}
        <div 
          className="overflow-hidden bg-black border-2 border-[#C4A96A] transition-all duration-300 hover:border-[#A85C32]"
          style={{
            width: `${currentSize}px`,
            height: `${currentSize}px`,
            borderRadius: '8px',
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            onError={handleImageError}
          />
          
          {/* Overlay subtil au survol */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#C4A96A]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>

        {/* Animation CSS */}
        <style jsx>{`
          @keyframes miniatureAppear {
            0% {
              opacity: 0;
              transform: translateX(-20px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ScrollMiniature;