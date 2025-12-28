// src/components/RoomsPreview.jsx - VERSION AVEC TRACKING COMPLET
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import * as analytics from '../utils/analytics';

const RoomsPreview = () => {
  const { language, t } = useLanguage();
  const { rooms, isLoading, dataSource } = useData();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const carouselRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Sort rooms by price
  const sortedRooms = [...rooms].sort((a, b) => a.price - b.price);
  
  // Create infinite array by duplicating rooms for seamless looping
  const infiniteRooms = [...sortedRooms, ...sortedRooms, ...sortedRooms];
  
  // Always show 3 cards (desktop, tablet, and mobile)
  const visibleCards = 3;
  const maxIndex = sortedRooms.length;

  // ✅ TRACKING: Vue automatique des chambres dans le carousel
  useEffect(() => {
    if (sortedRooms.length > 0 && !isLoading) {
      const currentRoom = sortedRooms[currentIndex];
      if (currentRoom) {
        // Track la vue de la chambre dans le carousel
        analytics.trackRoomView(
          currentRoom.id,
          currentRoom.name[language],
          currentRoom.price,
          'homepage_carousel'
        );
        
        console.log('🏨 Room viewed in carousel:', {
          room: currentRoom.name[language],
          index: currentIndex,
          price: currentRoom.price
        });
      }
    }
  }, [currentIndex, sortedRooms, language, isLoading]);

  // Auto-play carousel
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % maxIndex);
      }, 5000); // Change slide every 5 seconds
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [isAutoPlaying, maxIndex]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % maxIndex);
    // ✅ TRACKING: Navigation manuelle
    analytics.trackEvent('carousel_navigation', {
      direction: 'next',
      location: 'rooms_carousel',
      from_index: currentIndex
    });
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev - 1 + maxIndex) % maxIndex);
    // ✅ TRACKING: Navigation manuelle
    analytics.trackEvent('carousel_navigation', {
      direction: 'previous',
      location: 'rooms_carousel',
      from_index: currentIndex
    });
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
    setIsAutoPlaying(false);
    
    // ✅ TRACKING: Navigation par dot
    analytics.trackEvent('carousel_dot_click', {
      location: 'rooms_carousel',
      from_index: currentIndex,
      to_index: index
    });
    
    // Restart auto-play after 8 seconds of inactivity
    setTimeout(() => {
      setIsAutoPlaying(true);
    }, 8000);
  };

  const handleMouseEnter = () => {
    setIsAutoPlaying(false);
  };

  const handleMouseLeave = () => {
    setIsAutoPlaying(true);
  };

  // ✅ TRACKING: Clic sur image de chambre
  const handleRoomImageClick = (room, displayIndex) => {
    const originalIndex = (currentIndex + displayIndex) % sortedRooms.length;
    
    analytics.trackRoomClick(
      room.id,
      room.name[language],
      room.price,
      'carousel_image'
    );
    
    console.log('🖼️ Room image clicked:', {
      room: room.name[language],
      position: displayIndex,
      price: room.price
    });
  };

  // ✅ TRACKING: Clic sur bouton "See Details"
  const handleSeeDetailsClick = (room, displayIndex) => {
    const originalIndex = (currentIndex + displayIndex) % sortedRooms.length;
    
    analytics.trackRoomClick(
      room.id,
      room.name[language],
      room.price,
      'carousel_details_button'
    );
    
    console.log('🔍 See details clicked:', {
      room: room.name[language],
      position: displayIndex,
      price: room.price
    });
  };

  // Calculate the starting index for the infinite carousel
  const getDisplayRooms = () => {
    // Start from currentIndex in the original array, but display from the duplicated section
    const startIndex = currentIndex + sortedRooms.length;
    return infiniteRooms.slice(startIndex, startIndex + visibleCards);
  };

  return (
    <section id="rooms" className="py-20 bg-[#F8F5F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D5A4A] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.roomsPreview.title}
          </h2>
          <p className="text-xl text-gray-600">
            {t.roomsPreview.subtitle}
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="relative mb-12"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Carousel Wrapper */}
          <div className="overflow-hidden" ref={carouselRef}>
            <div className="flex justify-center gap-6">
              {getDisplayRooms().map((room, displayIndex) => {
                const originalIndex = (currentIndex + displayIndex) % sortedRooms.length;
                const featured = room.id === 'deluxe-queen';
                const isPriceLoading = isLoading && dataSource === 'unknown';

                return (
                  <div
                    key={`${room.id}-${originalIndex}-${displayIndex}`}
                    className="flex-shrink-0 w-full max-w-sm"
                  >
                    <article
                      className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full ${
                        featured ? 'ring-2 ring-[#A85C32]' : ''
                      }`}
                    >
                      {featured && (
                        <div className="bg-[#A85C32] text-white text-center py-2 font-semibold">
                          {language === 'en' ? 'Popular choice' : 'Muy solicitada'}
                        </div>
                      )}

                      {/* Image - ✅ AVEC TRACKING */}
                      <Link
                        to={`/rooms/${room.slug}`}
                        onClick={() => handleRoomImageClick(room, displayIndex)}
                        className="block"
                      >
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={room.images[0]}
                            alt={room.name[language]}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </Link>

                      {/* Content */}
                      <div className="p-6">
                        {/* Room Name */}
                        <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                          {room.name[language]}
                        </h3>

                        {/* Price */}
                        <div className="mb-6">
                          <div className="flex items-baseline gap-2">
                            {isPriceLoading ? (
                              <div className="flex items-baseline gap-2 w-full">
                                <div className="h-10 w-20 bg-gray-200 animate-pulse rounded"></div>
                                <div className="h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                              </div>
                            ) : (
                              <>
                                <span className="text-4xl font-bold text-[#A85C32]">
                                  ${room.price}
                                </span>
                                <span className="text-gray-600">
                                  {t.roomsPreview.perNight}
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Amenities */}
                        <ul className="space-y-3 mb-6">
                          {room.amenities && room.amenities.slice(0, 3).map((amenity, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-gray-700">
                              <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                              <span className="text-sm">{amenity.label[language]}</span>
                            </li>
                          ))}
                        </ul>

                        {/* CTA Button - ✅ AVEC TRACKING */}
                        <Link
                          to={`/rooms/${room.slug}`}
                          onClick={() => handleSeeDetailsClick(room, displayIndex)}
                          className="block w-full bg-[#2D5A4A] text-white text-center py-3 rounded-lg font-semibold hover:bg-[#1F3D32] transition-colors"
                        >
                          {t.roomsPreview.seeDetails}
                        </Link>
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Arrows - ✅ AVEC TRACKING */}
          <>
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all z-10 group"
              aria-label="Previous room"
            >
              <ChevronLeft className="h-6 w-6 text-[#2D5A4A] group-hover:text-[#A85C32]" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-100 p-3 rounded-full shadow-lg transition-all z-10 group"
              aria-label="Next room"
            >
              <ChevronRight className="h-6 w-6 text-[#2D5A4A] group-hover:text-[#A85C32]" />
            </button>
          </>

          {/* Dots Indicator - ✅ AVEC TRACKING */}
          <div className="flex justify-center gap-2 mt-8">
            {sortedRooms.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-[#A85C32]'
                    : 'w-3 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* What's Included Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-[#2D5A4A] mb-6 text-center">
            {t.valueProposition.included.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {t.valueProposition.included.items.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-700">
                <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoomsPreview;