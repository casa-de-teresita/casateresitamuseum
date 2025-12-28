// src/pages/BlogPage.jsx - ROUTES FIXED
import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { BookOpen, Filter, Star } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getBlogPostsByCategory } from '../utils/contentLoader';
import BlogCard from '../components/BlogCard';
import SEOHelmet from '../components/SEOHelmet';

const BlogPage = () => {
  const location = useLocation();
  const { language, setLanguage, t } = useLanguage();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Travel', 'History', 'Culture', 'Tips'];

  // 🔧 FIX: Détecter la langue depuis l'URL au chargement
  useEffect(() => {
    const pathLanguage = location.pathname.startsWith('/es/') ? 'es' : 'en';
    if (pathLanguage !== language) {
      console.log(`🌐 Changing language to: ${pathLanguage} (from URL)`);
      setLanguage(pathLanguage);
    }
  }, [location.pathname]);

  useEffect(() => {
    loadPosts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [language]);
  
  useEffect(() => {
    loadPosts();
  }, [language, selectedCategory]);
  
  const loadPosts = async () => {
    setLoading(true);
    try {
      console.log('🔍 Loading posts for:', language, 'category:', selectedCategory);
      const loadedPosts = await getBlogPostsByCategory(
        selectedCategory === 'All' ? null : selectedCategory, 
        language
      );
      console.log('✅ Posts loaded:', loadedPosts);
      setPosts(loadedPosts);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Separate featured and regular posts
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);
  
  // SEO keywords for blog page
  const blogKeywords = [
    'La Paz blog',
    'Bolivia travel blog',
    'La Paz travel tips',
    'Bolivia culture',
    'La Paz history',
    'South America travel',
    'Bolivia tourism',
    'La Casa de Teresita blog'
  ];

  const pageDescription = language === 'en'
    ? 'Discover stories, travel tips, cultural insights and historical tales about La Paz, Bolivia. Read our blog for insider information about visiting La Casa de Teresita and exploring La Paz.'
    : 'Descubre historias, consejos de viaje, insights culturales y relatos históricos sobre La Paz, Bolivia. Lee nuestro blog para información privilegiada sobre visitar La Casa de Teresita y explorar La Paz.';
  
  // 🔧 FIX: URL avec préfixe langue
  const currentUrl = `/${language}/blog`;
  
  return (
    <div className="min-h-screen pt-20 bg-[#F8F5F2]">
      <SEOHelmet
        title={t.blog.title}
        description={pageDescription}
        url={currentUrl}
        type="website"
        keywords={blogKeywords}
        currentLanguage={language}
        alternateLanguages={{
          en: '/en/blog',
          es: '/es/blog'
        }}
      />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#2D5A4A] via-[#3D6A5A] to-[#A85C32] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="h-12 w-12" />
          </div>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {t.blog.title}
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            {t.blog.subtitle}
          </p>
        </div>
      </section>
      
      {/* Filter Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-gray-700">
            <Filter className="h-5 w-5" />
            <span className="font-semibold">{t.blog.filterBy}:</span>
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-[#A85C32] text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>
      
      {/* Blog Posts Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A85C32] mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {language === 'en' ? 'Loading posts...' : 'Cargando artículos...'}
            </p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <p className="text-xl text-gray-600">{t.blog.noPosts}</p>
          </div>
        ) : (
          <>
            {/* Featured Posts */}
            {featuredPosts.length > 0 && selectedCategory === 'All' && (
              <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                  <Star className="h-8 w-8 text-[#A85C32]" />
                  <h2 className="text-3xl font-bold text-[#2D5A4A]">
                    {language === 'en' ? 'Featured Articles' : 'Artículos Destacados'}
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {featuredPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} featured={true} />
                  ))}
                </div>
              </div>
            )}

            {/* Regular Posts */}
            {regularPosts.length > 0 && (
              <div>
                {selectedCategory === 'All' && featuredPosts.length > 0 && (
                  <h2 className="text-2xl font-bold text-[#2D5A4A] mb-8">
                    {language === 'en' ? 'More Articles' : 'Más Artículos'}
                  </h2>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {regularPosts.map((post) => (
                    <BlogCard key={post.slug} post={post} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default BlogPage;