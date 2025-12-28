// src/components/Hero.jsx 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const scrollToRooms = (e) => {
    e.preventDefault();
    const element = document.getElementById('rooms');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToExperience = (e) => {
    e.preventDefault();
    const element = document.getElementById('experience');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/house1.jpg')`,
        }}
      >
        {/* ✅ Image hero avec fetchpriority="high" */}
        <img 
          src="/house1.jpg"
          alt="La Casa de Teresita - Historic Boutique Hotel La Paz"
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ display: 'none' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" />
      </div>

      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h1
          className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight transition-all duration-1000 ${
            isLoaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          {t.hero.title}
        </h1>
        
        <div className="mb-6">
          <p
            className={`text-2xl sm:text-3xl md:text-4xl text-[#C4A96A] font-semibold mb-4 transition-all duration-1000 delay-200 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.hero.subtitle}
          </p>
          <p
            className={`text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-300 ${
              isLoaded
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
          >
            {t.hero.tagline}
          </p>
        </div>

        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center items-center mt-12 transition-all duration-1000 delay-500 ${
            isLoaded
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <a
            href="#rooms"
            onClick={scrollToRooms}
            className="group bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-[#8B4926] transition-all duration-300 flex items-center gap-2 shadow-xl hover:shadow-2xl hover:scale-105 w-full sm:w-auto justify-center"
          >
            {t.hero.viewRooms}
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>

          <a
            href="#experience"
            onClick={scrollToExperience}
            className="group bg-white/10 backdrop-blur-sm text-white border-2 border-white/50 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <BookOpen className="h-5 w-5" />
            {t.hero.discoverHistory}
          </a>
        </div>
      </div>

      <div
        className={`absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce transition-all duration-1000 delay-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;