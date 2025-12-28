// src/components/Location.jsx
import { MapPin, Navigation, Plane } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';


const Location = () => {
  const { t } = useLanguage();

  const handleDirections = () => {
    const address = "Av. Arce 2995, San Jorge, La Paz, Bolivia";
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  return (
    <section id="location" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D5A4A] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.location.title}
          </h2>
          <p className="text-xl text-gray-600">{t.location.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-6">
            <div className="bg-[#F8F5F2] p-6 rounded-xl border-l-4 border-[#A85C32]">
              <div className="flex items-start gap-4">
                <MapPin className="h-6 w-6 text-[#A85C32] flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-[#2D5A4A] text-lg mb-2">
                    {t.location.address}
                  </h3>
                  <p className="text-gray-600">San Jorge, La Paz, Bolivia</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h3 className="font-bold text-[#2D5A4A] text-xl mb-4 flex items-center gap-2">
                <Navigation className="h-6 w-6 text-[#A85C32]" />
                {t.location.nearbyTitle}
              </h3>
              <ul className="space-y-3">
                {t.location.nearby.map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-700">
                    <div className="w-2 h-2 bg-[#A85C32] rounded-full flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#2D5A4A] text-white p-6 rounded-xl">
              <div className="flex items-start gap-4">
                <Plane className="h-6 w-6 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-2">Airport Transfer</h3>
                  <p className="text-white/90">{t.location.transport}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleDirections}
              className="w-full bg-[#A85C32] text-white py-4 rounded-lg font-semibold text-lg hover:bg-[#8B4926] transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="h-5 w-5" />
              {t.location.directions}
            </button>
          </div>

          <div className="relative h-96 lg:h-full min-h-[400px] rounded-xl overflow-hidden shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.2193064656967!2d-68.11923399999999!3d-16.5150224!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x915f20f4d4c97a6b%3A0xdf138ca8a8316023!2sTSE%2C%20Av.%20Arce%202995%2C%20La%20Paz!5e0!3m2!1sfr!2sbo!4v1765854160241!5m2!1sfr!2sbo"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="La Casa de Teresita Location"
            />
          </div>
        </div>
      </div>
    </section>
    
  );
};

export default Location;