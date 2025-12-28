// src/components/BlogCard.jsx - FIXED VERSION WITH LANGUAGE PREFIX
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import { useLanguage } from '../context/LanguageContext';
import { calculateReadingTime } from '../utils/contentLoader';

const BlogCard = ({ post, featured = false }) => {
  const { language, t } = useLanguage();
  const locale = language === 'es' ? es : enUS;
  
  // Format date
  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy', { locale });
  
  // Calculate reading time
  const readingTime = calculateReadingTime(post.body);
  
  // Truncate excerpt
  const truncatedExcerpt = post.excerpt?.length > 150 
    ? post.excerpt.substring(0, 150) + '...' 
    : post.excerpt;
  
  // Get featured image (support both old and new format)
  const featuredImage = post.featuredImage?.src || post.image;
  const featuredImageAlt = post.featuredImage?.alt || post.title;
  
  // Category colors
  const categoryColors = {
    Travel: 'bg-blue-100 text-blue-800',
    History: 'bg-amber-100 text-amber-800',
    Culture: 'bg-purple-100 text-purple-800',
    Tips: 'bg-green-100 text-green-800'
  };
  
  // 🔧 FIX: Construire l'URL avec le préfixe de langue
  const blogPostUrl = `/${language}/blog/${post.slug}`;
  
  return (
    <article className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group ${featured ? 'md:col-span-1' : ''}`}>
      {/* Featured Image */}
      <Link to={blogPostUrl} className="block relative overflow-hidden aspect-video">
        <img 
          src={featuredImage} 
          alt={featuredImageAlt}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${categoryColors[post.category] || 'bg-gray-100 text-gray-800'}`}>
            {post.category}
          </span>
        </div>
        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-4 right-4 bg-[#A85C32] text-white px-3 py-1 rounded-full text-sm font-semibold">
            ⭐ Featured
          </div>
        )}
      </Link>
      
      {/* Content */}
      <div className="p-6">
        {/* Metadata */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>
        
        {/* Title */}
        <Link to={blogPostUrl}>
          <h3 className="text-2xl font-bold text-[#2D5A4A] mb-3 group-hover:text-[#A85C32] transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {truncatedExcerpt}
        </p>
        
        {/* Read More Button */}
        <Link 
          to={blogPostUrl}
          className="inline-flex items-center gap-2 text-[#A85C32] font-semibold hover:text-[#8B4926] transition-colors group/link"
        >
          {t.blog.readMore}
          <ArrowRight className="h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;