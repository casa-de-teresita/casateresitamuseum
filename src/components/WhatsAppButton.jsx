// ==========================================
// 1. src/components/WhatsAppButton.jsx 
// ==========================================

import { MessageCircle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';
import * as analytics from '../utils/analytics';

const WhatsAppButton = () => {
  const { language, t } = useLanguage();
  const { config } = useData();

  const handleClick = () => {
    const message = t.whatsapp.homeMessage;
    const url = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    // ✅ TRACK AVANT D'OUVRIR WHATSAPP
    analytics.trackWhatsAppClick(
      'floating_button',  // source
      undefined,          // roomId
      undefined,          // roomName
      undefined,          // totalPrice
      undefined,          // nights
      false              // hasDateRange
    );
    
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 z-50 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {language === 'en' ? 'Chat with us!' : '¡Chatea con nosotros!'}
      </span>
    </button>
  );
};

export default WhatsAppButton;