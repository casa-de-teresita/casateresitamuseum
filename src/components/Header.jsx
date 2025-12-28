// src/components/Header.jsx
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Home } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ FIX: Détecter si on est sur la page Dashboard
  const isDashboardPage = location.pathname === '/dashboard';

  // Detect if on detail/blog/museum pages
  const isDetailPage = location.pathname.includes('/rooms/') || 
                        location.pathname.includes('/blog') ||
                        location.pathname.includes('/museum');
  
  // ✅ FIX: Toujours utiliser le style sombre sur Dashboard
  const shouldUseDarkStyle = isScrolled || isDetailPage || isDashboardPage;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
    setIsMobileMenuOpen(false);
  };

  const handleLanguageToggle = () => {
    const currentPath = location.pathname;
    
    const blogMatch = currentPath.match(/^\/(en|es)\/blog\/(.+)$/);
    if (blogMatch) {
      const [, currentLang, slug] = blogMatch;
      const newLang = currentLang === 'en' ? 'es' : 'en';
      toggleLanguage();
      navigate(`/${newLang}/blog/${slug}`, { replace: true });
      return;
    }
    
    const museumMatch = currentPath.match(/^\/(en|es)\/museum\/(.+)$/);
    if (museumMatch) {
      const [, currentLang, slug] = museumMatch;
      const newLang = currentLang === 'en' ? 'es' : 'en';
      toggleLanguage();
      navigate(`/${newLang}/museum/${slug}`, { replace: true });
      return;
    }
    
    toggleLanguage();
  };

  const linkClass = (isActive) => `font-medium transition-colors cursor-pointer ${
    shouldUseDarkStyle
      ? 'text-gray-700 hover:text-[#A85C32]'
      : 'text-white hover:text-[#C4A96A]'
  } ${isActive ? 'border-b-2 border-current' : ''}`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        shouldUseDarkStyle ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-2">
            <Home className={`h-8 w-8 ${shouldUseDarkStyle ? 'text-[#A85C32]' : 'text-white'}`} />
            <span
              className={`text-xl md:text-2xl font-serif font-bold ${
                shouldUseDarkStyle ? 'text-[#2D5A4A]' : 'text-white'
              }`}
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              La Casa de Teresita
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {/* ✅ FIX: Cacher les liens de navigation sur Dashboard */}
            {!isDashboardPage && (
              <>
                <button
                  onClick={() => scrollToSection('experience')}
                  className={linkClass(false)}
                >
                  {t.nav.story}
                </button>

                <button
                  onClick={() => scrollToSection('rooms')}
                  className={linkClass(location.pathname.includes('/rooms'))}
                >
                  {t.nav.rooms}
                </button>

                <Link
                  to={`/${language}/blog`}
                  className={linkClass(location.pathname.includes('/blog'))}
                >
                  {t.nav.blog}
                </Link>

                <Link
                  to={`/${language}/museum`}
                  className={linkClass(location.pathname.includes('/museum'))}
                >
                  {t.nav.museum}
                </Link>

                <button
                  onClick={() => scrollToSection('location')}
                  className={linkClass(false)}
                >
                  {t.nav.location}
                </button>

                <button
                  onClick={handleLanguageToggle}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    shouldUseDarkStyle
                      ? 'bg-[#A85C32] text-white hover:bg-[#8B4926]'
                      : 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm'
                  }`}
                >
                  {language === 'en' ? '🇬🇧 EN' : '🇪🇸 ES'}
                </button>
              </>
            )}

            {/* ✅ FIX: Afficher seulement le titre Dashboard si on est dessus */}
            {isDashboardPage && (
              <span className="text-lg font-semibold text-[#2D5A4A]">
                Analytics Dashboard
              </span>
            )}
          </nav>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden"
          >
            {isMobileMenuOpen ? (
              <X className={`h-6 w-6 ${shouldUseDarkStyle ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${shouldUseDarkStyle ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && !isDashboardPage && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-4">
            <Link
              to="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-gray-700 hover:text-[#A85C32] font-medium ${
                location.pathname === '/' ? 'text-[#A85C32]' : ''
              }`}
            >
              {t.nav.home}
            </Link>

            <button
              onClick={() => scrollToSection('experience')}
              className="block w-full text-left text-gray-700 hover:text-[#A85C32] font-medium"
            >
              {t.nav.story}
            </button>

            <button
              onClick={() => scrollToSection('rooms')}
              className={`block w-full text-left text-gray-700 hover:text-[#A85C32] font-medium ${
                location.pathname.includes('/rooms') ? 'text-[#A85C32]' : ''
              }`}
            >
              {t.nav.rooms}
            </button>

            <Link
              to={`/${language}/blog`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-gray-700 hover:text-[#A85C32] font-medium ${
                location.pathname.includes('/blog') ? 'text-[#A85C32]' : ''
              }`}
            >
              {t.nav.blog}
            </Link>

            <Link
              to={`/${language}/museum`}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block text-gray-700 hover:text-[#A85C32] font-medium ${
                location.pathname.includes('/museum') ? 'text-[#A85C32]' : ''
              }`}
            >
              {t.nav.museum}
            </Link>

            <button
              onClick={() => scrollToSection('location')}
              className="block w-full text-left text-gray-700 hover:text-[#A85C32] font-medium"
            >
              {t.nav.location}
            </button>

            <button
              onClick={() => {
                handleLanguageToggle();
                setIsMobileMenuOpen(false);
              }}
              className="w-full px-4 py-2 bg-[#A85C32] text-white rounded-md font-medium hover:bg-[#8B4926]"
            >
              {language === 'en' ? '🇬🇧 Switch to ES' : '🇪🇸 Cambiar a EN'}
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;