// src/components/TrustBadges.jsx
import { useState, useEffect, useRef } from 'react';
import { Star, Quote, Award, Sparkles, Users, Bed, MapPin, Building2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useData } from '../context/DataContext';

const TrustBadges = () => {
  const { language, t } = useLanguage();
  const { config } = useData();
  const [isVisible, setIsVisible] = useState({
    title: false,
    mainCard: false,
    scores: [false, false, false, false, false],
    testimonials: [false, false, false]
  });

  const titleRef = useRef(null);
  const mainCardRef = useRef(null);
  const scoreRefs = useRef([]);
  const testimonialRefs = useRef([]);

  // Parse booking rating properly - handle "9.6/10" format or plain number
  const parseBookingRating = (ratingStr) => {
    if (!ratingStr) return 9.6; // Default fallback
    
    // If it's already a number
    if (typeof ratingStr === 'number') return ratingStr;
    
    // If it's a string like "9.6/10", extract the first part
    const str = String(ratingStr);
    if (str.includes('/')) {
      const parts = str.split('/');
      return parseFloat(parts[0]) || 9.6;
    }
    
    // Otherwise try to parse as float
    return parseFloat(str) || 9.6;
  };
  
  const bookingRating = parseBookingRating(config?.bookingRates);

  const scores = [
    { label: t.reviews.scores.cleanliness, value: 9.8, icon: Sparkles },
    { label: t.reviews.scores.staff, value: 9.9, icon: Users },
    { label: t.reviews.scores.comfort, value: 9.7, icon: Bed },
    { label: t.reviews.scores.location, value: 9.5, icon: MapPin },
    { label: t.reviews.scores.facilities, value: 9.6, icon: Building2 }
  ];

  const testimonials = [
    {
      text: {
        en: "A perfect mix between hotel and museum. Ernesto is an incredible host who shares fascinating stories.",
        es: "Una mezcla perfecta entre hotel y museo. Ernesto es un anfitrión increíble que comparte historias fascinantes."
      },
      author: "Sarah M.",
      country: "USA"
    },
    {
      text: {
        en: "The gardens are beautiful and breakfast excellent. You really feel the history in every corner.",
        es: "Los jardines son hermosos y el desayuno excelente. Realmente sientes la historia en cada rincón."
      },
      author: "Carlos R.",
      country: "Argentina"
    },
    {
      text: {
        en: "A unique experience in La Paz. The attention to detail and hospitality are exceptional.",
        es: "Una experiencia única en La Paz. La atención al detalle y la hospitalidad son excepcionales."
      },
      author: "Emma L.",
      country: "UK"
    }
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -50px 0px'
    };

    const handleIntersect = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target === titleRef.current) {
            setIsVisible(prev => ({ ...prev, title: true }));
          } else if (target === mainCardRef.current) {
            setTimeout(() => {
              setIsVisible(prev => ({ ...prev, mainCard: true }));
            }, 200);
          } else {
            // Check scores
            scoreRefs.current.forEach((ref, index) => {
              if (target === ref) {
                setTimeout(() => {
                  setIsVisible(prev => {
                    const newScores = [...prev.scores];
                    newScores[index] = true;
                    return { ...prev, scores: newScores };
                  });
                }, index * 100);
              }
            });

            // Check testimonials
            testimonialRefs.current.forEach((ref, index) => {
              if (target === ref) {
                setTimeout(() => {
                  setIsVisible(prev => {
                    const newTestimonials = [...prev.testimonials];
                    newTestimonials[index] = true;
                    return { ...prev, testimonials: newTestimonials };
                  });
                }, index * 150);
              }
            });
          }
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    if (titleRef.current) observer.observe(titleRef.current);
    if (mainCardRef.current) observer.observe(mainCardRef.current);
    scoreRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    testimonialRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-[#F8F5F2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre avec animation */}
        <h2
          ref={titleRef}
          className={`text-4xl md:text-5xl font-bold text-[#2D5A4A] text-center mb-4 transition-all duration-1000 ${
            isVisible.title
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.reviews.title}
        </h2>

        <div className="flex flex-col items-center justify-center mb-16">
          {/* Main Rating Card avec animation */}
          <div
            ref={mainCardRef}
            className={`bg-white rounded-2xl shadow-2xl p-8 text-center mb-8 border-4 border-[#C4A96A] transition-all duration-1000 ${
              isVisible.mainCard
                ? 'opacity-100 scale-100 rotate-0'
                : 'opacity-0 scale-90 -rotate-3'
            }`}
          >
            <div className="flex justify-center mb-4">
              <Award className="h-16 w-16 text-[#C4A96A]" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-5xl font-bold text-[#2D5A4A]">{bookingRating.toFixed(1)}</span>
              <span className="text-2xl text-gray-500">/10</span>
            </div>
            <div className="flex justify-center mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 fill-[#C4A96A] text-[#C4A96A]" />
              ))}
            </div>
            <p className="text-lg text-gray-600 font-semibold">{t.reviews.rating}</p>
            <p className="text-sm text-gray-500 mt-2">Based on 247+ reviews</p>
          </div>

        </div>

        {/* Testimonials avec animation en cascade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              ref={el => testimonialRefs.current[index] = el}
              className={`bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-700 ${
                isVisible.testimonials[index]
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-12'
              }`}
            >
              <Quote className="h-8 w-8 text-[#A85C32] mb-4" />
              <p className="text-gray-700 leading-relaxed mb-4 italic">
                "{testimonial.text[language]}"
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#2D5A4A]">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.country}</p>
                </div>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-[#C4A96A] text-[#C4A96A]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;