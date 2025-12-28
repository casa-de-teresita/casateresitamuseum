// src/pages/MuseumPage.jsx - VERSION SANS SLIDER NI STATS
import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Building2, Filter, MessageCircle, Award, Sparkles, Calendar, Eye } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getPublicMuseumArtworks } from '../utils/contentLoader';
import SEOHelmet from '../components/SEOHelmet';

const MuseumPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = [
    'All', 
    'Painting',
    'Furniture', 
    'Document', 
    'Others'
  ];

  const categoryColors = {
    Painting: 'from-red-900 to-red-700',
    Sculpture: 'from-blue-900 to-blue-700',
    Piano: 'from-purple-900 to-purple-700',
    Furniture: 'from-amber-900 to-amber-700',
    Document: 'from-green-900 to-green-700',
    'Stained Glass Art': 'from-indigo-900 to-indigo-700',
    Viewpoint: 'from-cyan-900 to-cyan-700',
    Textile: 'from-rose-900 to-rose-700'
  };

  // Détecter la langue depuis l'URL
  useEffect(() => {
    const pathLanguage = location.pathname.startsWith('/es/') ? 'es' : 'en';
    if (pathLanguage !== language) {
      console.log(`🌐 Changing language to: ${pathLanguage} (from URL)`);
      setLanguage(pathLanguage);
    }
  }, [location.pathname]);

  useEffect(() => {
    loadArtworks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language]);
  
  useEffect(() => {
    loadArtworks();
  }, [language, selectedCategory]);
  
  const loadArtworks = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading PUBLIC artworks for:', language, 'category:', selectedCategory);
      
      const loadedArtworks = await getPublicMuseumArtworks(language);
      
      // Filtrer par catégorie si nécessaire
      const filteredArtworks = selectedCategory === 'All' 
        ? loadedArtworks
        : loadedArtworks.filter(artwork => artwork.category === selectedCategory);
      
      console.log('✅ Public artworks loaded:', filteredArtworks.length);
      setArtworks(filteredArtworks);
    } catch (error) {
      console.error('Error loading artworks:', error);
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBookTour = () => {
    const phoneNumber = "59170675985";
    const message = encodeURIComponent(
      language === 'en'
        ? "Hello! I'm interested in booking a guided museum tour at La Casa de Teresita. Could you provide more information? Thank you."
        : "¡Hola! Estoy interesado en reservar un tour guiado del museo en La Casa de Teresita. ¿Podrían proporcionar más información? Gracias."
    );
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(url, '_blank');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a]">
      <SEOHelmet
        title={t.museum.title}
        description={t.museum.metaDescription}
        url={`/${language}/museum`}
        type="website"
        currentLanguage={language}
        alternateLanguages={{
          en: '/en/museum',
          es: '/es/museum'
        }}
      />
      
      <div className="pt-20 md:pt-20">
        
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#C4A96A] via-[#A85C32] to-[#C4A96A] py-2 shadow-lg sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 flex items-center justify-center gap-2 py-1">
            <Award className="h-4 w-4 text-[#1a1a1a] animate-pulse" />
            <span className="text-xs font-bold text-[#1a1a1a] tracking-wider uppercase">
              {language === 'en' ? 'Permanent Collection' : 'Colección Permanente'}
            </span>
            <Sparkles className="h-4 w-4 text-[#1a1a1a] animate-pulse" />
          </div>
        </div>
        
        {/* Hero Section */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-block p-3 bg-[#C4A96A]/10 backdrop-blur-sm rounded-full mb-4 border-2 border-[#C4A96A]/30">
              <Building2 className="h-10 w-10 text-[#C4A96A]" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-[#C4A96A] mb-3" style={{ fontFamily: "'Playfair Display', serif" }}>
              {t.museum.title}
            </h1>
            
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto">
              {t.museum.subtitle}
            </p>
          </div>
        </section>

        {/* Intro Section */}
        <section className="max-w-5xl mx-auto px-4 py-6 md:py-8">
          <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-6 rounded-xl shadow-2xl border-4 border-[#C4A96A]">
            <div className="space-y-4 text-center">
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {t.museum.intro1}
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#C4A96A] to-transparent mx-auto"></div>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {t.museum.intro2}
              </p>
              <div className="w-16 h-1 bg-gradient-to-r from-transparent via-[#C4A96A] to-transparent mx-auto"></div>
              <p className="text-sm md:text-base text-gray-200 leading-relaxed">
                {t.museum.intro3}
              </p>
            </div>
          </div>
        </section>
        
        {/* Complete Collection */}
        {!loading && artworks.length > 0 && (
          <section className="max-w-7xl mx-auto px-3 sm:px-4 pb-12 md:pb-20">
            <div className="mb-8 md:mb-12">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="h-6 w-6 text-[#C4A96A]" />
                <h2 className="text-2xl md:text-3xl font-bold text-[#C4A96A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {language === 'en' ? 'Complete Collection' : 'Colección Completa'}
                </h2>
                <div className="flex-1 h-px bg-gradient-to-r from-[#C4A96A] to-transparent"></div>
              </div>
              
              {/* Filter Section */}
              <div className="mb-8">
                <div className="bg-[#1a1a1a] border-2 border-[#C4A96A]/30 rounded-xl shadow-xl overflow-hidden">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="w-full flex items-center justify-between p-4 hover:bg-[#2D5A4A]/20 transition-colors"
                  >
                    <div className="flex items-center gap-2 md:gap-4">
                      <Filter className="h-5 w-5 text-[#C4A96A]" />
                      <span className="font-bold text-[#C4A96A] text-sm md:text-base">
                        {t.museum.filterBy}
                      </span>
                      <span className="text-xs md:text-sm text-gray-400 bg-[#2D5A4A]/30 px-2 py-1 rounded-full">
                        {selectedCategory === 'All' 
                          ? (language === 'en' ? 'All' : 'Todas')
                          : selectedCategory
                        }
                      </span>
                    </div>
                    <div className={`transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`}>
                      <svg className="w-5 h-5 text-[#C4A96A]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}>
                    <div className="px-4 pb-4 border-t border-[#C4A96A]/20">
                      <div className="flex gap-2 flex-wrap pt-4">
                        {categories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              setSelectedCategory(category);
                              setShowFilters(false);
                            }}
                            className={`px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all duration-300 border-2 text-xs md:text-sm ${
                              selectedCategory === category
                                ? 'bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] border-[#C4A96A] shadow-lg scale-105'
                                : 'bg-[#2D5A4A]/30 text-gray-300 border-[#C4A96A]/20 hover:border-[#C4A96A]/50 hover:bg-[#2D5A4A]/50'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {artworks.map((artwork) => (
                  <ArtworkMuseumCard 
                    key={artwork.slug} 
                    artwork={artwork}
                    language={language}
                    categoryColors={categoryColors}
                    featured={artwork.featured}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Loading State */}
        {loading && (
          <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center">
              <div className="inline-block p-6 bg-[#C4A96A]/10 rounded-full mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#C4A96A] border-t-transparent"></div>
              </div>
              <p className="text-[#C4A96A] text-lg">
                {language === 'en' ? 'Loading collection...' : 'Cargando colección...'}
              </p>
            </div>
          </section>
        )}

        {/* No Results State */}
        {!loading && artworks.length === 0 && (
          <section className="max-w-7xl mx-auto px-4 py-20">
            <div className="text-center">
              <Building2 className="h-16 w-16 text-[#C4A96A] mx-auto mb-4" />
              <p className="text-xl text-gray-300">{t.museum.noArtworks}</p>
            </div>
          </section>
        )}
        
        {/* CTA Section */}
        <section className="border-t-4 border-[#C4A96A] bg-gradient-to-r from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a] py-12 md:py-20">
          <div className="max-w-5xl mx-auto px-4">
            <div className="relative bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-8 md:p-12 rounded-xl shadow-2xl border-4 border-[#C4A96A]">
              <div className="relative text-center">
                <div className="inline-block p-4 bg-[#C4A96A]/10 rounded-full mb-6">
                  <Award className="h-12 w-12 text-[#C4A96A]" />
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-[#C4A96A] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {t.museum.visitTitle}
                </h2>
                
                <p className="text-base md:text-xl mb-10 text-gray-200 max-w-2xl mx-auto leading-relaxed">
                  {t.museum.visitText}
                </p>
                
                <button
                  onClick={handleBookTour}
                  className="group bg-gradient-to-r from-[#25D366] to-[#20BA5A] text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-all duration-300 flex items-center gap-3 shadow-2xl mx-auto border-2 border-[#25D366]/30"
                >
                  <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
                  {t.museum.bookTour}
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

// Composant Card pour les œuvres
const ArtworkMuseumCard = ({ artwork, language, categoryColors, featured = false }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  const categoryGradient = categoryColors[artwork.category] || 'from-gray-900 to-gray-700';

  return (
    <Link 
      to={`/${language}/museum/${artwork.slug}`}
      className="group block h-full"
    >
      <article className={`h-full flex flex-col bg-[#1a1a1a] rounded-lg overflow-hidden border-2 ${
        featured ? 'border-[#C4A96A] ring-2 ring-[#C4A96A]/50' : 'border-[#C4A96A]/30'
      } shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]`}>
        
        {featured && (
          <div className="bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] px-3 py-1 text-xs font-bold flex items-center justify-center gap-2">
            <Award className="h-3 w-3" />
            {language === 'en' ? 'Featured' : 'Destacado'}
          </div>
        )}

        <div className="relative aspect-[4/3] bg-black overflow-hidden border-b-2 border-[#C4A96A]">
          {!imageError ? (
            <img 
              src={artwork.image || artwork.featuredImage?.src}
              alt={artwork.featuredImage?.alt || artwork.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
              onError={handleImageError}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-900">
              <Building2 className="h-12 w-12 text-[#C4A96A]/30" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          <div className="absolute top-2 left-2">
            <div className={`bg-gradient-to-r ${categoryGradient} px-3 py-1 rounded text-xs font-bold shadow-lg border border-white/20`}>
              {artwork.category}
            </div>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-4">
          <h3 
            className="text-lg font-bold text-[#C4A96A] mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-[#A85C32] transition-colors"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {artwork.title}
          </h3>
          
          <div className="space-y-1 text-xs text-gray-300 min-h-[3rem]">
            {artwork.artist && (
              <div className="flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-[#C4A96A]"></div>
                <span className="italic truncate">{artwork.artist}</span>
              </div>
            )}
            {artwork.year && (
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3 text-[#C4A96A]" />
                <span>{artwork.year}</span>
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
};

export default MuseumPage;