// src/components/DateRangePicker.jsx
import { useState, useEffect } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight, Info } from 'lucide-react';

const DateRangePicker = ({ 
  onDatesChange, 
  minNights = 1, 
  language = 'en',
  roomId = null,
  unavailableDates = [] // Array of {start: Date, end: Date} objects
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState(null);

  const texts = {
    en: {
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      selectDates: 'Select dates',
      nights: 'nights',
      night: 'night',
      clear: 'Clear',
      apply: 'Apply',
      minNights: `Minimum ${minNights} night${minNights > 1 ? 's' : ''}`,
      unavailable: 'Unavailable',
      available: 'Available',
      legend: 'Legend:',
      fullyBooked: 'Already booked',
    },
    es: {
      checkIn: 'Entrada',
      checkOut: 'Salida',
      selectDates: 'Seleccionar fechas',
      nights: 'noches',
      night: 'noche',
      clear: 'Limpiar',
      apply: 'Aplicar',
      minNights: `Mínimo ${minNights} noche${minNights > 1 ? 's' : ''}`,
      unavailable: 'No disponible',
      available: 'Disponible',
      legend: 'Leyenda:',
      fullyBooked: 'Ya reservado',
    }
  };

  const t = texts[language] || texts.en;

  const monthNames = language === 'en' 
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

  const dayNames = language === 'en'
    ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
    : ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

  useEffect(() => {
    if (checkIn && checkOut) {
      onDatesChange({ checkIn, checkOut });
    } else {
      onDatesChange(null);
    }
  }, [checkIn, checkOut]);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isDateDisabled = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateUnavailable = (date) => {
    // Check if date is in any unavailable period
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return unavailableDates.some(period => {
      const start = new Date(period.start);
      const end = new Date(period.end);
      start.setHours(0, 0, 0, 0);
      end.setHours(0, 0, 0, 0);
      
      const startTime = start.getTime();
      const endTime = end.getTime();
      const checkTime = checkDate.getTime();
      
      return checkTime >= startTime && checkTime <= endTime;
    });
  };

  const isDateInRange = (date) => {
    if (!checkIn || !checkOut) return false;
    return date > checkIn && date < checkOut;
  };

  const isDateInHoverRange = (date) => {
    if (!checkIn || checkOut || !hoverDate) return false;
    const start = checkIn < hoverDate ? checkIn : hoverDate;
    const end = checkIn < hoverDate ? hoverDate : checkIn;
    return date > start && date < end;
  };

  const hasUnavailableDateInRange = (startDate, endDate) => {
    // Check if there's any unavailable date between start and end
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (isDateUnavailable(new Date(d))) {
        return true;
      }
    }
    return false;
  };

  const handleDateClick = (date) => {
    if (isDateDisabled(date) || isDateUnavailable(date)) return;

    if (!checkIn || (checkIn && checkOut)) {
      // First click or reset
      setCheckIn(date);
      setCheckOut(null);
    } else {
      // Second click
      if (date < checkIn) {
        setCheckOut(checkIn);
        setCheckIn(date);
      } else {
        const daysDiff = Math.floor((date - checkIn) / (1000 * 60 * 60 * 24));
        
        // Check if minimum nights requirement is met
        if (daysDiff < minNights) {
          return;
        }
        
        // Check if there's any unavailable date in the range
        if (hasUnavailableDateInRange(checkIn, date)) {
          // Reset selection if there's an unavailable date in range
          setCheckIn(date);
          setCheckOut(null);
          return;
        }
        
        setCheckOut(date);
      }
    }
  };

  const handleApply = () => {
    if (checkIn && checkOut) {
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setCheckIn(null);
    setCheckOut(null);
  };

  const renderCalendar = (monthOffset = 0) => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + monthOffset);
    
    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(date);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      currentDate.setHours(0, 0, 0, 0);
      
      const isPast = isDateDisabled(currentDate);
      const isUnavailable = isDateUnavailable(currentDate);
      const isStart = checkIn && currentDate.getTime() === checkIn.getTime();
      const isEnd = checkOut && currentDate.getTime() === checkOut.getTime();
      const inRange = isDateInRange(currentDate);
      const inHoverRange = isDateInHoverRange(currentDate);

      let dayClasses = 'h-10 rounded-lg transition-all text-sm font-medium relative';
      
      if (isPast) {
        // Past dates - gray and disabled
        dayClasses += ' text-gray-300 cursor-not-allowed bg-gray-50';
      } else if (isUnavailable) {
        // Unavailable dates - RED and disabled
        dayClasses += ' bg-red-500 text-white cursor-not-allowed font-bold';
      } else if (isStart || isEnd) {
        // Selected start/end dates - dark green
        dayClasses += ' bg-[#2D5A4A] text-white hover:bg-[#1F3D32] font-bold ring-2 ring-[#2D5A4A] ring-offset-2';
      } else if (inRange || inHoverRange) {
        // Dates in selected range - medium green
        dayClasses += ' bg-[#4CAF50] text-white font-semibold';
      } else {
        // Available dates - GREEN and clickable
        dayClasses += ' bg-green-100 text-green-800 hover:bg-green-200 hover:font-semibold cursor-pointer border border-green-300';
      }

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(currentDate)}
          onMouseEnter={() => !isPast && !isUnavailable && setHoverDate(currentDate)}
          disabled={isPast || isUnavailable}
          className={dayClasses}
          title={isUnavailable ? t.fullyBooked : (isPast ? '' : t.available)}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="p-4">
        <div className="text-center font-semibold text-gray-900 mb-4">
          {monthNames[month]} {year}
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-600 h-8 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const formatDate = (date) => {
    if (!date) return '';
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'es-ES', options);
  };

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    return Math.floor((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const nights = calculateNights();

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-gray-300 rounded-lg p-4 hover:border-[#A85C32] transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-600 mb-1">{t.checkIn}</div>
            <div className="text-sm font-semibold text-gray-900">
              {checkIn ? formatDate(checkIn) : t.selectDates}
            </div>
          </div>
          <div className="mx-4 h-12 w-px bg-gray-300" />
          <div className="flex-1">
            <div className="text-xs font-semibold text-gray-600 mb-1">{t.checkOut}</div>
            <div className="text-sm font-semibold text-gray-900">
              {checkOut ? formatDate(checkOut) : t.selectDates}
            </div>
          </div>
          <Calendar className="h-5 w-5 text-[#A85C32] ml-4" />
        </div>
        {nights > 0 && (
          <div className="mt-2 text-xs text-gray-600">
            {nights} {nights === 1 ? t.night : t.nights}
          </div>
        )}
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar Panel */}
          <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-2xl z-50 border border-gray-200 max-w-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleClear}
                className="text-sm text-[#A85C32] hover:text-[#8B4926] font-semibold"
              >
                {t.clear}
              </button>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* Legend */}
            <div className="px-4 py-3 bg-gray-50 border-b">
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300 flex items-center justify-center">
                    <span className="text-green-800 font-bold text-xs">✓</span>
                  </div>
                  <span className="text-gray-700 font-medium">{t.available}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded bg-red-500 flex items-center justify-center">
                    <span className="text-white font-bold text-xs">✕</span>
                  </div>
                  <span className="text-gray-700 font-medium">{t.unavailable}</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-6 h-6 rounded bg-[#2D5A4A] ring-2 ring-[#2D5A4A] ring-offset-1"></div>
                  <span className="text-gray-700 font-medium">{language === 'en' ? 'Selected' : 'Seleccionado'}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {renderCalendar(0)}
              {renderCalendar(1)}
            </div>

            {checkIn && !checkOut && (
              <div className="p-4 bg-blue-50 text-center text-sm text-blue-800 flex items-center justify-center gap-2">
                <Info className="h-4 w-4" />
                <span>{t.minNights}</span>
              </div>
            )}

            <div className="p-4 border-t flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {checkIn && checkOut && (
                  <span className="font-semibold text-[#2D5A4A]">
                    {nights} {nights === 1 ? t.night : t.nights}
                  </span>
                )}
              </div>
              <button
                onClick={handleApply}
                disabled={!checkIn || !checkOut}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                  checkIn && checkOut
                    ? 'bg-[#2D5A4A] text-white hover:bg-[#1F3D32]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {t.apply}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DateRangePicker;