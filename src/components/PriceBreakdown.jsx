// src/components/PriceBreakdown.jsx
import { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { calculateTotalPrice } from '../services/dataManager';

const PriceBreakdown = ({ roomId, dateRange, language = 'en', className = '' }) => {
  const [priceData, setPriceData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const texts = {
    en: {
      loading: 'Calculating price...',
      total: 'Total',
      perNight: 'per night',
      nights: 'nights',
      night: 'night',
      basePrice: 'Base price',
      breakdown: 'Price breakdown',
      hideDetails: 'Hide details',
      showDetails: 'Show details',
      noPrice: 'Select dates to see price',
      averagePerNight: 'Average per night',
      variablePricing: 'Variable pricing applies'
    },
    es: {
      loading: 'Calculando precio...',
      total: 'Total',
      perNight: 'por noche',
      nights: 'noches',
      night: 'noche',
      basePrice: 'Precio base',
      breakdown: 'Desglose de precios',
      hideDetails: 'Ocultar detalles',
      showDetails: 'Mostrar detalles',
      noPrice: 'Selecciona fechas para ver el precio',
      averagePerNight: 'Promedio por noche',
      variablePricing: 'Precios variables aplicados'
    }
  };

  const t = texts[language] || texts.en;

  useEffect(() => {
    const fetchPrice = async () => {
      if (!dateRange || !dateRange.checkIn || !dateRange.checkOut) {
        setPriceData(null);
        return;
      }

      setIsLoading(true);
      try {
        const data = await calculateTotalPrice(roomId, dateRange.checkIn, dateRange.checkOut);
        setPriceData(data);
      } catch (error) {
        console.error('Error calculating price:', error);
        setPriceData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrice();
  }, [roomId, dateRange]);

  if (!dateRange || !dateRange.checkIn || !dateRange.checkOut) {
    return (
      <div className={`bg-[#F8F5F2] rounded-lg p-4 text-center ${className}`}>
        <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-sm text-gray-600">{t.noPrice}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={`bg-[#F8F5F2] rounded-lg p-4 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/2"></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">{t.loading}</p>
      </div>
    );
  }

  if (!priceData || priceData.nights === 0) {
    return null;
  }

  const { totalPrice, nightlyPrices, basePrice, nights } = priceData;
  const averagePerNight = totalPrice / nights;
  const hasVariablePrices = nightlyPrices.some((n, idx, arr) => 
    idx > 0 && n.price !== arr[idx - 1].price
  );

  const formatDate = (date) => {
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', options);
  };

  return (
    <div className={`bg-white border-2 border-[#A85C32] rounded-xl overflow-hidden ${className}`}>
      {/* Summary */}
      <div className="p-6 bg-gradient-to-br from-[#2D5A4A] to-[#1F3D32] text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-sm opacity-90 mb-1">{t.total}</div>
            <div className="text-4xl font-bold">${totalPrice.toFixed(2)}</div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <div className="text-xs opacity-90">{nights} {nights === 1 ? t.night : t.nights}</div>
            <div className="text-sm font-semibold">${averagePerNight.toFixed(2)}</div>
            <div className="text-xs opacity-75">{t.perNight}</div>
          </div>
        </div>

        {hasVariablePrices && (
          <div className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm rounded-lg px-3 py-2">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-semibold">
              {t.variablePricing}
            </span>
          </div>
        )}
      </div>

      {/* Details Toggle */}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full px-6 py-3 bg-[#F8F5F2] hover:bg-[#E8E5E2] transition-colors flex items-center justify-between"
      >
        <span className="text-sm font-semibold text-gray-900">
          {showDetails ? t.hideDetails : t.showDetails}
        </span>
        {showDetails ? (
          <ChevronUp className="h-5 w-5 text-[#A85C32]" />
        ) : (
          <ChevronDown className="h-5 w-5 text-[#A85C32]" />
        )}
      </button>

      {/* Detailed Breakdown */}
      {showDetails && (
        <div className="p-6 space-y-3 max-h-64 overflow-y-auto">
          {nightlyPrices.map((night, index) => (
            <div 
              key={index}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#F8F5F2] flex items-center justify-center">
                  <span className="text-sm font-bold text-[#2D5A4A]">
                    {night.date.getDate()}
                  </span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatDate(night.date)}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-[#A85C32]">
                  ${night.price}
                </div>
                {night.price !== basePrice && night.price < basePrice && (
                  <div className="text-xs text-gray-500 line-through">
                    ${basePrice}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Info */}
      <div className="px-6 py-3 bg-gray-50 border-t text-center">
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span>
            {t.averagePerNight}: <span className="font-semibold text-gray-900">${averagePerNight.toFixed(2)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default PriceBreakdown;