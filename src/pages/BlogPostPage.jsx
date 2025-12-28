// src/pages/BlogPostPage.jsx - VERSION SEO OPTIMISÉE
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, Share2, ExternalLink, Globe } from 'lucide-react';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLanguage } from '../context/LanguageContext';
import { 
  getBlogPost, 
  getRelatedPosts, 
  calculateReadingTime,
  getAlternateBlogPost // 🆕 Import de la nouvelle fonction
} from '../utils/contentLoader';
import SEOHelmet from '../components/SEOHelmet';
import BlogCard from '../components/BlogCard';
import WhatsAppButton from '../components/WhatsAppButton';

const BlogPostPage = () => {
  const { slug } = useParams();
  const { language, t } = useLanguage();
  const [post, setPost] = useState(null);
  const [alternatePost, setAlternatePost] = useState(null); // 🆕 Version alternative
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [shareSuccess, setShareSuccess] = useState(false);
  
  const locale = language === 'es' ? es : enUS;
  
  useEffect(() => {
    loadPost();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug, language]);
  
  const loadPost = async () => {
    setLoading(true);
    try {
      // Charger l'article dans la langue actuelle
      const loadedPost = await getBlogPost(slug, language);
      setPost(loadedPost);
      
      if (loadedPost) {
        // 🆕 Charger la version dans l'autre langue
        const alternate = await getAlternateBlogPost(slug, language);
        setAlternatePost(alternate);
        
        // Charger les articles connexes
        const related = await getRelatedPosts(loadedPost, language);
        setRelatedPosts(related);
      }
    } catch (error) {
      console.error('Error loading blog post:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleShare = async () => {
    const shareData = {
      title: post.title,
      text: post.excerpt,
      url: window.location.href
    };
    
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.log('Share failed:', err);
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareSuccess(true);
    setTimeout(() => setShareSuccess(false), 2000);
  };

  // Process body to replace image placeholders
  const processBodyWithImages = (body, articleImages) => {
    if (!articleImages) return body;
    
    let processedBody = body;
    
    // Replace {{< image src="image-1" >}} with actual image
    if (articleImages.image1?.src) {
      const image1Html = `\n\n![${articleImages.image1.alt || ''}](${articleImages.image1.src})${articleImages.image1.caption ? '\n*' + articleImages.image1.caption + '*' : ''}\n\n`;
      processedBody = processedBody.replace(/\{\{<\s*image\s+src="image-1"\s*>\}\}/gi, image1Html);
    }
    
    // Replace {{< image src="image-2" >}} with actual image
    if (articleImages.image2?.src) {
      const image2Html = `\n\n![${articleImages.image2.alt || ''}](${articleImages.image2.src})${articleImages.image2.caption ? '\n*' + articleImages.image2.caption + '*' : ''}\n\n`;
      processedBody = processedBody.replace(/\{\{<\s*image\s+src="image-2"\s*>\}\}/gi, image2Html);
    }
    
    return processedBody;
  };
  
  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#A85C32] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-[#F8F5F2]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-[#2D5A4A] mb-4">
            {t.blog.notFound}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t.blog.notFoundMessage}
          </p>
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 bg-[#A85C32] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#8B4926] transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            {t.blog.backToBlog}
          </Link>
        </div>
      </div>
    );
  }
  
  const formattedDate = format(new Date(post.date), 'MMMM d, yyyy', { locale });
  const readingTime = calculateReadingTime(post.body);
  const keywords = post.keywords || [];
  const author = post.author || 'La Casa de Teresita';
  
  // Get featured image (support both old and new format)
  const featuredImage = post.featuredImage?.src || post.image;
  const featuredImageAlt = post.featuredImage?.alt || post.title;
  
  // Process body with article images
  const processedBody = processBodyWithImages(post.body, post.articleImages);
  
  // 🆕 Préparer les URLs alternatives pour hreflang
  const alternateLanguages = {
    en: `/blog/${slug}`,
    es: `/blog/${slug}`
  };
  
  return (
    <div className="min-h-screen pt-20 bg-white">
      <SEOHelmet
        title={post.title}
        description={post.metaDescription || post.excerpt}
        image={featuredImage}
        url={`/blog/${post.slug}`}
        type="article"
        keywords={keywords}
        author={author}
        publishedTime={post.date}
        modifiedTime={post.modifiedDate}
        currentLanguage={language}
        alternateLanguages={alternateLanguages}
        article={{
          publishedTime: post.date,
          modifiedTime: post.modifiedDate,
          category: post.category
        }}
      />
      
      {/* Hero Image */}
      <div className="relative h-96 md:h-[500px] bg-gray-900">
        <img
          src={featuredImage}
          alt={featuredImageAlt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        
        {/* Back Button */}
        <Link
          to="/blog"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all z-10"
        >
          <ArrowLeft className="h-6 w-6 text-[#2D5A4A]" />
        </Link>

        {/* 🆕 Indicateur de version alternative disponible */}
        {alternatePost && (
          <div className="absolute top-4 right-4 bg-blue-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-10">
            <Globe className="h-4 w-4" />
            {language === 'en' ? 'También en Español' : 'Also in English'}
          </div>
        )}

        {/* Featured Badge */}
        {post.featured && (
          <div className="absolute top-16 right-4 bg-[#A85C32] text-white px-4 py-2 rounded-lg font-semibold shadow-lg z-10">
            ⭐ Featured
          </div>
        )}
      </div>
      
      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-8">
          <div className="inline-block px-4 py-2 bg-[#A85C32] text-white rounded-full font-semibold mb-4">
            {post.category}
          </div>
          
          <h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D5A4A] mb-6 leading-tight"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            {post.title}
          </h1>
          
          {/* Author & Date */}
          <div className="flex items-center gap-2 mb-6 text-gray-700">
            <span className="font-semibold">{author}</span>
            <span>•</span>
            <span>{formattedDate}</span>
          </div>
          
          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{readingTime} min read</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-[#A85C32] hover:text-[#8B4926] transition-colors"
            >
              <Share2 className="h-5 w-5" />
              <span>{shareSuccess ? 'Link copied!' : 'Share'}</span>
            </button>
          </div>
        </header>
        
        {/* Article Body */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({node, ...props}) => (
                <h1 
                  className="text-4xl font-bold text-[#2D5A4A] mt-12 mb-6 scroll-mt-24" 
                  style={{ fontFamily: "'Playfair Display', serif" }} 
                  {...props} 
                />
              ),
              h2: ({node, ...props}) => (
                <h2 
                  className="text-3xl font-bold text-[#2D5A4A] mt-12 mb-6 scroll-mt-24" 
                  style={{ fontFamily: "'Playfair Display', serif" }} 
                  {...props} 
                />
              ),
              h3: ({node, ...props}) => (
                <h3 
                  className="text-2xl font-bold text-[#2D5A4A] mt-8 mb-4 scroll-mt-24" 
                  style={{ fontFamily: "'Playfair Display', serif" }} 
                  {...props} 
                />
              ),
              h4: ({node, ...props}) => (
                <h4 
                  className="text-xl font-bold text-[#2D5A4A] mt-6 mb-3 scroll-mt-24" 
                  {...props} 
                />
              ),
              p: ({node, children, ...props}) => {
                // Check if paragraph contains only an italic caption
                const text = children?.toString() || '';
                if (text.startsWith('*') && text.endsWith('*')) {
                  return (
                    <p className="text-center text-sm text-gray-600 italic -mt-8 mb-8" {...props}>
                      {children}
                    </p>
                  );
                }
                return (
                  <p className="text-gray-700 leading-relaxed mb-6 text-lg" {...props}>
                    {children}
                  </p>
                );
              },
              strong: ({node, ...props}) => (
                <strong className="font-bold text-[#2D5A4A]" {...props} />
              ),
              em: ({node, ...props}) => (
                <em className="italic" {...props} />
              ),
              blockquote: ({node, ...props}) => (
                <blockquote 
                  className="border-l-4 border-[#A85C32] pl-6 italic text-gray-600 my-8 bg-[#F8F5F2] py-4 rounded-r-lg" 
                  {...props} 
                />
              ),
              img: ({node, src, alt, ...props}) => (
                <figure className="my-10">
                  <img 
                    className="rounded-xl shadow-xl w-full" 
                    src={src} 
                    alt={alt || ''} 
                    loading="lazy"
                    width="1200" 
                    height="630"      
                    decoding="async"
                    {...props} 
                  />
                  {alt && (
                    <figcaption className="text-center text-sm text-gray-600 mt-3 italic">
                      {alt}
                    </figcaption>
                  )}
                </figure>
              ),
              a: ({node, href, children, ...props}) => {
                const isExternal = href?.startsWith('http');
                return (
                  <a 
                    className="text-[#A85C32] hover:text-[#8B4926] underline font-medium inline-flex items-center gap-1" 
                    href={href}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                    {...props}
                  >
                    {children}
                    {isExternal && <ExternalLink className="h-4 w-4" />}
                  </a>
                );
              },
              ul: ({node, ...props}) => (
                <ul className="space-y-3 my-6 ml-6" {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className="space-y-3 my-6 ml-6" {...props} />
              ),
              li: ({node, children, ...props}) => (
                <li className="text-gray-700 text-lg leading-relaxed pl-2" {...props}>
                  {children}
                </li>
              ),
              code: ({node, inline, className, children, ...props}) => {
                if (inline) {
                  return (
                    <code 
                      className="bg-gray-100 text-[#A85C32] px-2 py-1 rounded font-mono text-sm" 
                      {...props}
                    >
                      {children}
                    </code>
                  );
                }
                return (
                  <code 
                    className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 font-mono text-sm" 
                    {...props}
                  >
                    {children}
                  </code>
                );
              },
              pre: ({node, ...props}) => (
                <pre className="my-6" {...props} />
              ),
              hr: ({node, ...props}) => (
                <hr className="my-12 border-gray-300" {...props} />
              ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-8">
                  <table className="min-w-full divide-y divide-gray-300" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => (
                <thead className="bg-gray-50" {...props} />
              ),
              tbody: ({node, ...props}) => (
                <tbody className="divide-y divide-gray-200" {...props} />
              ),
              tr: ({node, ...props}) => (
                <tr {...props} />
              ),
              th: ({node, ...props}) => (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" {...props} />
              ),
              td: ({node, ...props}) => (
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700" {...props} />
              ),
            }}
          >
            {processedBody}
          </ReactMarkdown>
        </div>

        {/* External Links Section */}
        {post.externalLinks && post.externalLinks.length > 0 && (
          <div className="bg-[#F8F5F2] p-6 rounded-xl my-12">
            <h3 className="text-xl font-bold text-[#2D5A4A] mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5" />
              {language === 'en' ? 'Related Links' : 'Enlaces Relacionados'}
            </h3>
            <ul className="space-y-3">
              {post.externalLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-white rounded-lg hover:shadow-md transition-shadow group"
                  >
                    <ExternalLink className="h-5 w-5 text-[#A85C32] flex-shrink-0 mt-1 group-hover:scale-110 transition-transform" />
                    <div>
                      <div className="font-semibold text-[#2D5A4A] group-hover:text-[#A85C32] transition-colors">
                        {link.title}
                      </div>
                      {link.description && (
                        <div className="text-sm text-gray-600 mt-1">
                          {link.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-400 mt-1 break-all">
                        {link.url}
                      </div>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Keywords/Tags */}
        {keywords.length > 0 && (
          <div className="mb-12 pb-12 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-[#F8F5F2] text-[#2D5A4A] rounded-full text-sm font-medium"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {/* CTA Section */}
        <div className="bg-gradient-to-r from-[#2D5A4A] to-[#A85C32] p-8 rounded-xl text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            {language === 'en' 
              ? 'Ready to Experience La Casa de Teresita?' 
              : '¿Listo para Vivir La Casa de Teresita?'}
          </h3>
          <p className="mb-6">
            {language === 'en'
              ? 'Book your stay in our historic boutique hotel and live the stories you just read about.'
              : 'Reserva tu estadía en nuestro hotel boutique histórico y vive las historias que acabas de leer.'}
          </p>
          <Link
            to="/"
            className="inline-block bg-white text-[#2D5A4A] px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            {language === 'en' ? 'View Rooms & Availability' : 'Ver Habitaciones y Disponibilidad'}
          </Link>
        </div>
      </article>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#F8F5F2] py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2D5A4A] mb-12 text-center"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {t.blog.relatedPosts}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </div>
        </section>
      )}
      
      <WhatsAppButton />
    </div>
  );
};

export default BlogPostPage;