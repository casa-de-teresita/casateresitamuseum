// src/pages/RoomDetailPage.jsx - SANS ACCESSOIRES
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Wifi, Tv, Bath, Trees, Coffee, Shirt, Users, 
  Star, Maximize2, Bed, Check, MessageCircle, 
  ChevronLeft, ChevronRight, ArrowLeft, X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import DateRangePicker from '../components/DateRangePicker';
import PriceBreakdown from '../components/PriceBreakdown';
import { getAvailability } from '../services/dataManager';
import * as analytics from '../utils/analytics';

const RoomDetailPage = () => {
  const { roomSlug } = useParams();
  const { language } = useLanguage();
  const { rooms, config, isInitialLoad } = useData();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [dateRange, setDateRange] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);

  const room = rooms.find(r => r.slug === roomSlug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [roomSlug]);

  useEffect(() => {
    const loadUnavailability = async () => {
      if (!room) return;
      
      try {
        const availability = await getAvailability();
        
        const roomUnavailability = availability
          .filter(av => av.chambreId === room.id && av.statut === 'Unavailable')
          .map(av => ({
            start: new Date(av.dateDebut),
            end: new Date(av.dateFin)
          }));
        
        setUnavailableDates(roomUnavailability);
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    };

    loadUnavailability();
  }, [room?.id]);

  if (!room) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#F8F5F2]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#2D5A4A] mb-4">
            {language === 'en' ? 'Room Not Found' : 'Habitación No Encontrada'}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {language === 'en' 
              ? 'The room you are looking for does not exist or is no longer available.'
              : 'La habitación que buscas no existe o ya no está disponible.'}
          </p>
          <Link
            to="/#rooms"
            className="inline-flex items-center gap-2 bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8B4926] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {language === 'en' ? 'Back to Rooms' : 'Volver a Habitaciones'}
          </Link>
        </div>
      </div>
    );
  }

  const iconMap = {
    Wifi, Tv, Bath, Trees, Coffee, Shirt, Users
  };

  const handleWhatsApp = async () => {
    const phoneNumber = config.whatsappNumber || "59170675985";
    const roomName = room.name[language];
    
    const { calculateTotalPrice } = await import('../services/dataManager');
    
    let message = '';
    let totalPrice = room.price;
    let nights = 1;
    let hasDateRange = false;
    
    if (dateRange && dateRange.checkIn && dateRange.checkOut) {
      const priceData = await calculateTotalPrice(room.id, dateRange.checkIn, dateRange.checkOut);
      totalPrice = priceData.totalPrice;
      nights = priceData.nights;
      hasDateRange = true;
      
      const checkInStr = dateRange.checkIn.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      const checkOutStr = dateRange.checkOut.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { 
        year: 'numeric', month: 'long', day: 'numeric' 
      });
      
      message = language === 'en'
        ? `Hello! I'm interested in booking the ${roomName} room.\n\n` +
          `Check-in: ${checkInStr}\n` +
          `Check-out: ${checkOutStr}\n` +
          `Nights: ${priceData.nights}\n\n` +
          `Total: $${priceData.totalPrice}`
        : `¡Hola! Estoy interesado en reservar la habitación ${roomName}.\n\n` +
          `Entrada: ${checkInStr}\n` +
          `Salida: ${checkOutStr}\n` +
          `Noches: ${priceData.nights}\n\n` +
          `Total: $${priceData.totalPrice}`;
    } else {
      message = language === 'en'
        ? `Hello! I'm interested in booking the ${roomName} room.\n\nPrice: $${room.price}/night`
        : `¡Hola! Estoy interesado en reservar la habitación ${roomName}.\n\nPrecio: $${room.price}/noche`;
    }
    
    // ✅ TRACK AVANT D'OUVRIR WHATSAPP
    analytics.trackWhatsAppClick(
      'room_detail_page',  // source
      room.id,             // roomId
      roomName,            // roomName
      totalPrice,          // totalPrice
      nights,              // nights
      hasDateRange         // hasDateRange
    );
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % room.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + room.images.length) % room.images.length);
  };

  const isDynamicDataLoading = isInitialLoad && (!room.isAvailable && room.isAvailable !== false);

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Image Gallery */}
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        <img
          src={room.images[currentImageIndex]}
          alt={room.name[language]}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {room.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronLeft className="h-6 w-6 text-[#2D5A4A]" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
            >
              <ChevronRight className="h-6 w-6 text-[#2D5A4A]" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg">
          {currentImageIndex + 1} / {room.images.length}
        </div>

        <Link
          to="/#rooms"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
        >
          <ArrowLeft className="h-6 w-6 text-[#2D5A4A]" />
        </Link>
      </div>

      {/* Room Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1
                className="text-4xl md:text-5xl font-bold text-[#2D5A4A] mb-4"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {room.name[language]}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-4 py-2 rounded-lg">
                  <Maximize2 className="h-5 w-5 text-[#A85C32]" />
                  <span className="font-semibold">{room.size}m²</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-4 py-2 rounded-lg">
                  <Bed className="h-5 w-5 text-[#A85C32]" />
                  <span className="font-semibold">{room.beds[language]}</span>
                </div>
                <div className="flex items-center gap-2 bg-[#F8F5F2] px-4 py-2 rounded-lg">
                  <Star className="h-5 w-5 fill-[#C4A96A] text-[#C4A96A]" />
                  <span className="font-semibold">{room.rating}/10</span>
                  <span className="text-sm text-gray-600">({room.reviewCount})</span>
                </div>
              </div>

              <p className="text-lg text-gray-700 leading-relaxed mb-8">
                {room.description[language]}
              </p>
            </div>

            {/* Amenities */}
            <div className="mb-8 bg-[#F8F5F2] p-6 rounded-xl">
              <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                {language === 'en' ? 'Amenities' : 'Servicios'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {room.amenities && room.amenities.map((amenity, index) => {
                  const Icon = iconMap[amenity.icon] || Check;
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                      <span className="text-gray-700">{amenity.label[language]}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bathroom */}
            {room.bathroom && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                  {language === 'en' ? 'Bathroom' : 'Baño'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.bathroom[language].map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Views */}
            {room.view && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                  {language === 'en' ? 'Views' : 'Vistas'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.view[language].map((view, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Trees className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                      <span className="text-gray-700">{view}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Features */}
            {room.features && (
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-[#2D5A4A] mb-4">
                  {language === 'en' ? 'Features' : 'Características'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {room.features[language].map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-[#A85C32] flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Non-Smoking Badge */}
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-8">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-full">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <span className="font-semibold text-green-800">
                  {language === 'en' ? 'Non-smoking room' : 'Habitación para no fumadores'}
                </span>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Date Picker */}
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-[#2D5A4A] mb-4">
                  {language === 'en' ? 'Select your dates' : 'Selecciona tus fechas'}
                </h3>
                <DateRangePicker 
                  onDatesChange={setDateRange}
                  language={language}
                  minNights={1}
                  roomId={room.id}
                  unavailableDates={unavailableDates}
                />
              </div>

              {/* Price Breakdown */}
              {dateRange && dateRange.checkIn && dateRange.checkOut && (
                <PriceBreakdown 
                  roomId={room.id}
                  dateRange={dateRange}
                  language={language}
                />
              )}

              {/* Booking Summary Card */}
              <div className="bg-white border-2 border-[#A85C32] rounded-xl p-6 shadow-xl">
                {/* Price Display */}
                {!dateRange || !dateRange.checkIn || !dateRange.checkOut ? (
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">
                      {language === 'en' ? 'Starting from' : 'Desde'}
                    </div>
                    <div className="flex items-baseline gap-2 mb-2">
                      {isDynamicDataLoading ? (
                        <div className="h-12 w-32 bg-gray-200 animate-pulse rounded"></div>
                      ) : (
                        <>
                          <span className="text-5xl font-bold text-[#A85C32]">
                            ${room.price}
                          </span>
                          <span className="text-xl text-gray-600">
                            {language === 'en' ? '/ night' : '/ noche'}
                          </span>
                        </>
                      )}
                    </div>
                    <div className="text-sm text-green-600 font-semibold">
                      ✓ {language === 'en' ? 'Free cancellation' : 'Cancelación gratuita'}
                    </div>
                  </div>
                ) : (
                  <div className="mb-6">
                    <div className="text-sm text-gray-600 mb-2">
                      {language === 'en' ? 'Your reservation' : 'Tu reserva'}
                    </div>
                    <div className="bg-[#F8F5F2] rounded-lg p-4 mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">{language === 'en' ? 'Check-in' : 'Entrada'}</span>
                        <span className="font-semibold">
                          {dateRange.checkIn.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { 
                            month: 'short', day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">{language === 'en' ? 'Check-out' : 'Salida'}</span>
                        <span className="font-semibold">
                          {dateRange.checkOut.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', { 
                            month: 'short', day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* What's Included */}
                <div className="mb-6 bg-[#F8F5F2] p-4 rounded-lg">
                  <h4 className="font-bold text-[#2D5A4A] mb-3">
                    {language === 'en' ? "What's Included" : 'Qué está incluido'}
                  </h4>
                  <ul className="space-y-2">
                    {room.included && room.included[language].map((item, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-[#A85C32] flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Book Now Button */}
                <button
                  onClick={handleWhatsApp}
                  className="w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-lg mb-4 bg-[#25D366] text-white hover:bg-[#20BA5A] hover:shadow-xl hover:scale-105"
                >
                  <MessageCircle className="h-6 w-6" />
                  {language === 'en' ? 'Book Now via WhatsApp' : 'Reservar por WhatsApp'}
                </button>

                <p className="text-sm text-gray-600 text-center">
                  {language === 'en' 
                    ? 'Instant confirmation • Best price guarantee'
                    : 'Confirmación instantánea • Garantía del mejor precio'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white hover:text-[#C4A96A] transition-colors"
          >
            <X className="h-8 w-8" />
          </button>

          <div className="max-w-6xl w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {room.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${room.name[language]} - ${index + 1}`}
                  className="w-full h-64 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomDetailPage;