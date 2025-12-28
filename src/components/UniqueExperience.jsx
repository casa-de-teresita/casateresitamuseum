import { useState, useEffect, useRef } from 'react';
import { Book, Flower, Briefcase } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const UniqueExperience = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState({
    title: false,
    intro: false,
    features: [false, false, false],
    photo: false,
    mission: false
  });
  
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const introRef = useRef(null);
  const featureRefs = useRef([]);
  const photoRef = useRef(null);
  const missionRef = useRef(null);

  const icons = [Book, Flower, Briefcase];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.2,
      rootMargin: '0px 0px -100px 0px'
    };

    const handleIntersect = (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          
          if (target === titleRef.current) {
            setIsVisible(prev => ({ ...prev, title: true }));
          } else if (target === introRef.current) {
            setTimeout(() => {
              setIsVisible(prev => ({ ...prev, intro: true }));
            }, 200);
          } else if (target === photoRef.current) {
            setIsVisible(prev => ({ ...prev, photo: true }));
          } else if (target === missionRef.current) {
            setIsVisible(prev => ({ ...prev, mission: true }));
          } else {
            // Check features
            featureRefs.current.forEach((ref, index) => {
              if (target === ref) {
                setTimeout(() => {
                  setIsVisible(prev => {
                    const newFeatures = [...prev.features];
                    newFeatures[index] = true;
                    return { ...prev, features: newFeatures };
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
    if (introRef.current) observer.observe(introRef.current);
    if (photoRef.current) observer.observe(photoRef.current);
    if (missionRef.current) observer.observe(missionRef.current);
    featureRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" className="py-20 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre avec animation */}
        <div 
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-1000 ${
            isVisible.title
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-12'
          }`}
        >
          <h2
            className="text-4xl md:text-5xl font-bold text-[#2D5A4A] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.uniqueExperience.title}
          </h2>
          <p className="text-xl text-[#A85C32] font-semibold mb-6">
            {t.uniqueExperience.subtitle}
          </p>
        </div>

        {/* Intro avec animation */}
        <div className="max-w-4xl mx-auto mb-16">
          <div 
            ref={introRef}
            className={`bg-[#F8F5F2] p-8 rounded-xl border-l-4 border-[#A85C32] transition-all duration-1000 ${
              isVisible.intro
                ? 'opacity-100 translate-x-0'
                : 'opacity-0 -translate-x-12'
            }`}
          >
            <p className="text-lg text-gray-700 leading-relaxed">
              {t.uniqueExperience.intro}
            </p>
          </div>
        </div>

        {/* Features avec animation en cascade */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {t.uniqueExperience.features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={index}
                ref={el => featureRefs.current[index] = el}
                className={`text-center group transition-all duration-1000 ${
                  isVisible.features[index]
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-12'
                }`}
              >
                <div className="bg-[#2D5A4A] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-[#A85C32] transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                  <Icon className="h-10 w-10 text-white" />
                </div>
                <h3
                  className="text-2xl font-bold text-[#2D5A4A] mb-4"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Photo des fondateurs avec animation */}
        <div 
          ref={photoRef}
          className={`max-w-3xl mx-auto mb-12 transition-all duration-1000 ${
            isVisible.photo
              ? 'opacity-100 scale-100'
              : 'opacity-0 scale-95'
          }`}
        >
          <div className="rounded-xl overflow-hidden shadow-2xl mb-6">
            <img 
              src="/parents.webp" 
              alt={t.uniqueExperience.photoAlt}
              className="w-full h-auto object-cover"
            />
          </div>
          <p className="text-center text-gray-700 leading-relaxed italic px-4">
            {t.uniqueExperience.photoCaption}
          </p>
        </div>

        {/* Mission avec animation */}
        <div className="max-w-4xl mx-auto text-center">
          <div 
            ref={missionRef}
            className={`bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] p-8 rounded-xl text-white transition-all duration-1000 ${
              isVisible.mission
                ? 'opacity-100 scale-100'
                : 'opacity-0 scale-95'
            }`}
          >
            <p className="text-lg leading-relaxed italic">
              "{t.uniqueExperience.mission}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniqueExperience;