// src/pages/MuseumDetailPage.jsx - STYLE MUSÉE AVEC MINIATURE ET BADGES QR
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Calendar, Info, Youtube, Music, Award, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../context/LanguageContext';
import { getMuseumArtwork } from '../utils/contentLoader';
import SEOHelmet from '../components/SEOHelmet';
import ScrollMiniature from '../components/ScrollMiniature';

const MuseumDetailPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [showMiniature, setShowMiniature] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    loadArtwork();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
      // Afficher la miniature après 400px de scroll
      setShowMiniature(position > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Vérifier la position initiale
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadArtwork = async () => {
    setLoading(true);
    setImageError(false);
    try {
      const loadedArtwork = await getMuseumArtwork(slug, language);
      setArtwork(loadedArtwork);
    } catch (error) {
      console.error('Error loading artwork:', error);
      setArtwork(null);
    } finally {
      setLoading(false);
    }
  };

  const alternateLanguages = {
  en: `/museum/${slug}`,
  es: `/museum/${slug}`
  };

  const handleImageError = (e) => {
  const imageSrc = artwork?.image || artwork?.featuredImage?.src;
  console.error('❌ Image failed to load:', imageSrc);
  setImageError(true);
};

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getSpotifyTrackId = (url) => {
    if (!url) return null;
    const match = url.match(/track\/([a-zA-Z0-9]+)/);
    return match ? match[1] : null;
  };

  const categoryColors = {
    Painting: 'bg-red-900 text-red-100 border-red-700',
    Sculpture: 'bg-blue-900 text-blue-100 border-blue-700',
    Piano: 'bg-purple-900 text-purple-100 border-purple-700',
    Furniture: 'bg-amber-900 text-amber-100 border-amber-700',
    Document: 'bg-green-900 text-green-100 border-green-700',
    Activity: 'bg-pink-900 text-pink-100 border-pink-700',
    'Stained Glass Art': 'bg-indigo-900 text-indigo-100 border-indigo-700',
    Viewpoint: 'bg-cyan-900 text-cyan-100 border-cyan-700',
    Textile: 'bg-rose-900 text-rose-100 border-rose-700'
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-[#1a1a1a] to-[#2D5A4A]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#C4A96A] mx-auto mb-4"></div>
          <p className="text-[#C4A96A]">
            {language === 'en' ? 'Loading artwork...' : 'Cargando obra...'}
          </p>
        </div>
      </div>
    );
  }

  if (!artwork) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-gradient-to-b from-[#1a1a1a] to-[#2D5A4A]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#C4A96A] mb-4">
            {language === 'en' ? 'Artwork Not Found' : 'Obra No Encontrada'}
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            {language === 'en' 
              ? 'The artwork you are looking for does not exist.'
              : 'La obra que buscas no existe.'}
          </p>
          <Link
            to={`/${language}/museum`}
            className="inline-flex items-center gap-2 bg-[#C4A96A] text-[#1a1a1a] px-8 py-4 rounded-lg font-semibold hover:bg-[#A85C32] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {language === 'en' ? 'Back to Museum' : 'Volver al Museo'}
          </Link>
        </div>
      </div>
    );
  }

  const youtubeVideoId = getYouTubeVideoId(artwork.youtube);
  const spotifyTrackId = getSpotifyTrackId(artwork.spotify);

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a]">
        <SEOHelmet
          title={artwork.title}
          description={artwork.excerpt || artwork.body?.substring(0, 160)}
          image={artwork.image || artwork.featuredImage?.src}
          url={`/museum/${artwork.slug}`}
          type="article"
          currentLanguage={language}
          alternateLanguages={alternateLanguages}
        />

      {/* Miniature flottante */}
      {showMiniature && artwork && (
        <ScrollMiniature 
          artwork={artwork}
          scrollPosition={scrollPosition}
        />
      )}

      {/* Museum Header Banner */}
      <div className="bg-gradient-to-r from-[#2D5A4A] via-[#C4A96A] to-[#2D5A4A] py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-3">
          <Award className="h-5 w-5 text-[#1a1a1a]" />
          <span className="text-sm font-semibold text-[#1a1a1a] tracking-wider uppercase">
            {language === 'en' ? 'Museum Collection' : 'Colección del Museo'}
          </span>
          <Sparkles className="h-5 w-5 text-[#1a1a1a]" />
        </div>
      </div>

      {/* Hero Image with Museum Frame */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative bg-[#1a1a1a] p-8 rounded-lg shadow-2xl border-4 border-[#C4A96A]">
          {/* Museum Lighting Effect */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-[#C4A96A]/20 to-transparent blur-2xl -z-10"></div>
          
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden shadow-xl">
            {!imageError && (artwork.image || artwork.featuredImage?.src) ? (
              <img
                src={artwork.image || artwork.featuredImage?.src}
                alt={artwork.featuredImage?.alt || artwork.title}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-900">
                <div className="text-center text-[#C4A96A] p-8">
                  <Info className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-xl mb-2">Image not available</p>
                </div>
              </div>
            )}
          </div>

          {/* Museum Plaque */}
          <div className="mt-6 bg-gradient-to-b from-[#C4A96A] to-[#A85C32] p-6 rounded-lg shadow-inner">
            <h1
              className="text-3xl md:text-4xl font-bold text-[#1a1a1a] text-center mb-3 tracking-wide"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {artwork.title}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[#1a1a1a]/90 text-sm">
              {artwork.artist && (
                <span className="font-semibold italic">{artwork.artist}</span>
              )}
              {artwork.year && (
                <>
                  <span className="text-[#1a1a1a]/50">•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {artwork.year}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Back Button */}
        <Link
          to={`/${language}/museum`}
          className="absolute top-4 left-4 bg-[#C4A96A]/90 hover:bg-[#C4A96A] text-[#1a1a1a] p-3 rounded-full shadow-lg transition-all z-10 backdrop-blur-sm"
        >
          <ArrowLeft className="h-6 w-6" />
        </Link>

        {/* Category Badge */}
        {artwork.category && (
          <div className="absolute top-4 right-4 z-10">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold shadow-lg border-2 ${categoryColors[artwork.category] || 'bg-gray-900 text-gray-100 border-gray-700'}`}>
              {artwork.category}
            </span>
          </div>
        )}

        {/* QR Exclusive Badge */}
        {artwork.accessibility === 'qr-only' && (
          <div className="absolute top-16 right-4 z-10">
            <div className="bg-gradient-to-r from-[#C4A96A] to-[#A85C32] px-4 py-2 rounded-lg shadow-xl border-2 border-[#1a1a1a]/20 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#1a1a1a] animate-pulse" />
                <span className="text-xs font-bold text-[#1a1a1a] uppercase tracking-wider">
                  {language === 'en' ? 'Museum Visitor Exclusive' : 'Exclusivo Visitantes del Museo'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Museum Panel Style */}
          <div className="lg:col-span-2 space-y-8">
            {/* YouTube Video in Elegant Frame */}
            {youtubeVideoId && (
              <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#C4A96A]/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#C4A96A]/30">
                  <Youtube className="h-6 w-6 text-[#C4A96A]" />
                  <h3 className="text-xl font-bold text-[#C4A96A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {language === 'en' ? 'Video Presentation' : 'Presentación en Video'}
                  </h3>
                </div>
                <div className="relative rounded-lg overflow-hidden" style={{ paddingBottom: '56.25%', height: 0 }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                    title="YouTube video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* Spotify in Elegant Frame */}
            {spotifyTrackId && (
              <div className="bg-[#1a1a1a] p-6 rounded-lg border-2 border-[#C4A96A]/50 shadow-xl">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#C4A96A]/30">
                  <Music className="h-6 w-6 text-[#C4A96A]" />
                  <h3 className="text-xl font-bold text-[#C4A96A]" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {language === 'en' ? 'Audio Accompaniment' : 'Acompañamiento Musical'}
                  </h3>
                </div>
                <iframe
                  className="rounded-lg w-full"
                  src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator&theme=0`}
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                />
              </div>
            )}

            {/* Description Panel */}
            <div className="bg-gradient-to-br from-[#2D5A4A] to-[#1a1a1a] p-8 rounded-lg border-2 border-[#C4A96A]/30 shadow-xl">
              <div className="prose prose-invert prose-lg max-w-none">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({node, ...props}) => (
                      <h1 
                        className="text-3xl font-bold text-[#C4A96A] mt-8 mb-4 border-b-2 border-[#C4A96A]/30 pb-3" 
                        style={{ fontFamily: "'Playfair Display', serif" }} 
                        {...props} 
                      />
                    ),
                    h2: ({node, ...props}) => (
                      <h2 
                        className="text-2xl font-bold text-[#C4A96A] mt-6 mb-3" 
                        style={{ fontFamily: "'Playfair Display', serif" }} 
                        {...props} 
                      />
                    ),
                    h3: ({node, ...props}) => (
                      <h3 
                        className="text-xl font-bold text-[#C4A96A] mt-5 mb-2" 
                        style={{ fontFamily: "'Playfair Display', serif" }} 
                        {...props} 
                      />
                    ),
                    p: ({node, ...props}) => (
                      <p className="text-gray-200 leading-relaxed mb-4 text-base" {...props} />
                    ),
                    ul: ({node, ...props}) => (
                      <ul className="list-disc list-inside space-y-2 my-4 text-gray-200 ml-4" {...props} />
                    ),
                    li: ({node, ...props}) => (
                      <li className="ml-4 text-gray-200" {...props} />
                    ),
                    strong: ({node, ...props}) => (
                      <strong className="font-bold text-[#C4A96A]" {...props} />
                    ),
                    em: ({node, ...props}) => (
                      <em className="italic text-[#C4A96A]/90" {...props} />
                    ),
                    blockquote: ({node, ...props}) => (
                      <blockquote 
                        className="border-l-4 border-[#C4A96A] pl-6 italic text-gray-300 my-6 bg-black/30 py-4 rounded-r-lg" 
                        {...props} 
                      />
                    ),
                    a: ({node, ...props}) => (
                      <a className="text-[#C4A96A] hover:text-[#A85C32] underline transition-colors" {...props} />
                    )
                  }}
                >
                  {artwork.body}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Sidebar - Museum Info Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Artifact Details */}
              <div className="bg-[#1a1a1a] rounded-lg border-2 border-[#C4A96A]/50 p-6 shadow-xl">
                <h3 className="text-xl font-bold text-[#C4A96A] mb-4 pb-3 border-b border-[#C4A96A]/30" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {language === 'en' ? 'Artifact Details' : 'Detalles del Objeto'}
                </h3>
                <div className="space-y-4">
                  {artwork.artist && (
                    <div>
                      <div className="text-xs text-[#C4A96A]/70 uppercase tracking-wider mb-1">
                        {language === 'en' ? 'Artist / Creator' : 'Artista / Creador'}
                      </div>
                      <div className="font-semibold text-gray-200">{artwork.artist}</div>
                    </div>
                  )}
                  {artwork.year && (
                    <div>
                      <div className="text-xs text-[#C4A96A]/70 uppercase tracking-wider mb-1">
                        {language === 'en' ? 'Period' : 'Período'}
                      </div>
                      <div className="font-semibold text-gray-200">{artwork.year}</div>
                    </div>
                  )}
                  {artwork.category && (
                    <div>
                      <div className="text-xs text-[#C4A96A]/70 uppercase tracking-wider mb-1">
                        {language === 'en' ? 'Classification' : 'Clasificación'}
                      </div>
                      <div className="font-semibold text-gray-200">{artwork.category}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Media Links */}
              {(artwork.youtube || artwork.spotify) && (
                <div className="bg-gradient-to-br from-[#C4A96A] to-[#A85C32] rounded-lg p-6 shadow-xl">
                  <h3 className="text-lg font-bold text-[#1a1a1a] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {language === 'en' ? 'Additional Media' : 'Medios Adicionales'}
                  </h3>
                  <div className="space-y-3">
                    {artwork.youtube && (
                      <a
                        href={artwork.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-black rounded-lg transition-colors border border-[#1a1a1a]/30"
                      >
                        <Youtube className="h-5 w-5 text-red-500" />
                        <span className="font-semibold text-gray-200 text-sm">
                          {language === 'en' ? 'View Video' : 'Ver Video'}
                        </span>
                      </a>
                    )}
                    {artwork.spotify && (
                      <a
                        href={artwork.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-[#1a1a1a] hover:bg-black rounded-lg transition-colors border border-[#1a1a1a]/30"
                      >
                        <Music className="h-5 w-5 text-green-500" />
                        <span className="font-semibold text-gray-200 text-sm">
                          {language === 'en' ? 'Listen' : 'Escuchar'}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Museum Notice */}
              <div className="bg-[#2D5A4A]/50 backdrop-blur-sm rounded-lg p-5 border border-[#C4A96A]/30 text-center">
                <Award className="h-8 w-8 text-[#C4A96A] mx-auto mb-3" />
                <p className="text-sm text-gray-300 leading-relaxed">
                  {language === 'en' 
                    ? 'Part of the permanent collection at La Casa de Teresita'
                    : 'Parte de la colección permanente de La Casa de Teresita'}
                </p>
              </div>

              {/* QR Exclusive Notice */}
              {artwork.accessibility === 'qr-only' && (
                <div className="bg-gradient-to-br from-[#C4A96A] to-[#A85C32] rounded-lg p-5 border-2 border-[#1a1a1a]/20 shadow-xl">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <Sparkles className="h-6 w-6 text-[#1a1a1a]" />
                    <Info className="h-6 w-6 text-[#1a1a1a]" />
                  </div>
                  <p className="text-sm text-[#1a1a1a] font-semibold leading-relaxed text-center">
                    {language === 'en' 
                      ? 'This artwork is exclusively accessible to hotel guests and museum visitors via QR code on-site'
                      : 'Esta obra es accesible exclusivamente para huéspedes del hotel y visitantes del museo mediante código QR en el sitio'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Museum Footer CTA */}
      <section className="border-t-4 border-[#C4A96A] bg-gradient-to-r from-[#1a1a1a] via-[#2D5A4A] to-[#1a1a1a] py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block p-4 bg-[#C4A96A]/10 rounded-full mb-6">
            <Sparkles className="h-12 w-12 text-[#C4A96A]" />
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-[#C4A96A] mb-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {language === 'en' ? 'Explore More Treasures' : 'Explora Más Tesoros'}
          </h2>
          <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
            {language === 'en'
              ? 'Continue your journey through our historic collection of artifacts and artworks'
              : 'Continúa tu viaje por nuestra variada colección'}
          </p>
          <Link
            to={`/${language}/museum`}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C4A96A] to-[#A85C32] text-[#1a1a1a] px-8 py-4 rounded-lg font-bold hover:scale-105 transition-transform shadow-lg"
          >
            <Award className="h-5 w-5" />
            {language === 'en' ? 'Return to Collection' : 'Volver a la Colección'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default MuseumDetailPage;