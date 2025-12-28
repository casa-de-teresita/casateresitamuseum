import { Phone, Mail, MapPin, Home, Clock, Facebook, Instagram } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    // If not on home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/');
      // Wait for navigation, then scroll
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const scrollToTop = () => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // WhatsApp handler
  const handleWhatsAppClick = () => {
    const phoneNumber = "59170675985";
    const message = t.whatsapp.homeMessage;
    const encodedMessage = encodeURIComponent(message);
    const url = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // ✅ TRACK AVANT D'OUVRIR WHATSAPP
    import('../utils/analytics').then(analytics => {
      analytics.trackWhatsAppClick(
        'footer',      // source
        undefined,     // roomId
        undefined,     // roomName
        undefined,     // totalPrice
        undefined,     // nights
        false          // hasDateRange
      );
    });
    
    window.open(url, '_blank');
  };

  // Maps handler
  const handleMapsClick = () => {
    const address = "Av. Arce 2995, San Jorge, La Paz, Bolivia";
    const encodedAddress = encodeURIComponent(address);
    // Ouvre Google Maps (fonctionne sur desktop et mobile)
    const url = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    window.open(url, '_blank');
  };

  // Email handler
  const handleEmailClick = () => {
    const email = "info@lacasadeteresita.com";
    const subject = language === 'en' 
      ? "Reservation Inquiry - La Casa de Teresita"
      : "Consulta de Reserva - La Casa de Teresita";
    const body = language === 'en'
      ? "Hello,\n\nI am interested in making a reservation at La Casa de Teresita.\n\nCould you please provide me with:\n- Available dates\n- Room options\n- Pricing information\n\nThank you!\n\nBest regards"
      : "Hola,\n\nEstoy interesado en hacer una reserva en La Casa de Teresita.\n\n¿Podrían proporcionarme:\n- Fechas disponibles\n- Opciones de habitaciones\n- Información de precios\n\n¡Gracias!\n\nSaludos cordiales";
    
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const url = `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
    window.location.href = url;
  };

  return (
    <footer className="bg-[#2D5A4A] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Home className="h-8 w-8 text-[#C4A96A]" />
              <h3
                className="text-2xl font-bold"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                La Casa de Teresita
              </h3>
            </div>
            <p className="text-gray-300 leading-relaxed mb-4">
              {t.footer.aboutText}
            </p>
            <div className="flex items-center gap-2 text-[#C4A96A]">
              <Clock className="h-5 w-5" />
              <span className="text-sm">Since 2022</span>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">{t.nav.contact}</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-[#C4A96A]" />
                <button 
                  onClick={handleWhatsAppClick}
                  className="hover:text-[#C4A96A] transition-colors text-left hover:underline"
                >
                  +591 70675985 (Mobile - WhatsApp)
                </button>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-[#C4A96A]" />
                <button 
                  onClick={handleEmailClick}
                  className="hover:text-[#C4A96A] transition-colors hover:underline"
                >
                  info@lacasadeteresita.com
                </button>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-[#C4A96A] flex-shrink-0 mt-1" />
                <button 
                  onClick={handleMapsClick}
                  className="hover:text-[#C4A96A] transition-colors text-left hover:underline"
                >
                  Av. Arce #2995 San Jorge<br />La Paz, Bolivia
                </button>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={scrollToTop}
                  className="hover:text-[#C4A96A] transition-colors"
                >
                  {t.nav.home}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('experience')}
                  className="hover:text-[#C4A96A] transition-colors"
                >
                  {t.nav.story}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('rooms')}
                  className="hover:text-[#C4A96A] transition-colors"
                >
                  {t.nav.rooms}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('gallery')}
                  className="hover:text-[#C4A96A] transition-colors"
                >
                  {t.nav.gallery}
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection('location')}
                  className="hover:text-[#C4A96A] transition-colors"
                >
                  {t.nav.location}
                </button>
              </li>
            </ul>

            <div className="mt-6">
              <h5 className="font-semibold mb-3">Follow Us</h5>
              <div className="flex gap-4 mb-6">
                <a 
                  href="https://www.facebook.com/lacasadeteresita/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full hover:bg-[#C4A96A] transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a 
                  href="https://www.instagram.com/lacasadeteresitabo/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 p-3 rounded-full hover:bg-[#C4A96A] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center">
          <p className="text-gray-300">
            {currentYear} La Casa de Teresita. {t.footer.copyright}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Hotel Boutique Museo & Hogar Familiar
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;