// src/components/SEOHelmet.jsx - VERSION AVEC ROUTES MULTILINGUES COMPLÈTES
import { Helmet } from 'react-helmet-async';

const SEOHelmet = ({ 
  title, 
  description, 
  image, 
  type = 'website', 
  url,
  article = null,
  keywords = [],
  author = 'La Casa de Teresita',
  publishedTime,
  modifiedTime,
  currentLanguage = 'en',
  alternateLanguages = null
}) => {
  const siteUrl = 'https://lacasadeteresita.com/';
  const siteName = 'La Casa de Teresita';
  
  // 🔧 FIX: S'assurer que l'URL contient toujours le préfixe langue
  const normalizeUrl = (path) => {
    if (!path) return siteUrl;
    
    // Si l'URL contient déjà /en/ ou /es/, la retourner telle quelle
    if (path.match(/^\/(en|es)\//)) {
      return `${siteUrl}${path}`;
    }
    
    // Sinon, ajouter le préfixe de langue actuelle
    return `${siteUrl}/${currentLanguage}${path}`;
  };
  
  const fullUrl = normalizeUrl(url);
  const fullImage = image?.startsWith('http') ? image : `${siteUrl}${image || '/house1.jpg'}`;
  
  // Default keywords
  const defaultKeywords = [
    'La Paz hotel',
    'boutique hotel La Paz',
    'historic hotel Bolivia',
    'La Casa de Teresita',
    'museum hotel'
  ];
  
  const allKeywords = keywords.length > 0 ? keywords : defaultKeywords;
  
  // Titre optimisé sans répétition
  const formatTitle = () => {
    if (title.includes(siteName)) return title;
    if (url === '/' || url === `/${currentLanguage}`) return `${siteName} | Historic Boutique Hotel La Paz Bolivia`;
    if (title.length > 50) return `${title} | ${siteName}`;
    return `${title} | ${siteName}`;
  };

  // Description optimisée (155 caractères max)
  const formatDescription = () => {
    if (!description) return 'Historic 1916 mansion in La Paz. Boutique museum hotel with gardens, piano collections & authentic rooms. Rated 9.6/10. Book direct.';
    return description.length > 155 ? description.substring(0, 152) + '...' : description;
  };
  
  // 🔧 FIX: Hreflang tags avec URLs normalisées
  const getHreflangTags = () => {
    if (!alternateLanguages) return null;
    
    return Object.entries(alternateLanguages).map(([lang, path]) => {
      // S'assurer que le path contient le préfixe langue
      const normalizedPath = path.match(/^\/(en|es)\//) ? path : `/${lang}${path}`;
      
      return (
        <link 
          key={lang}
          rel="alternate" 
          hrefLang={lang === 'en' ? 'en' : 'es'} 
          href={`${siteUrl}${normalizedPath}`} 
        />
      );
    });
  };
  
  // Schema.org avec URLs complètes
  const getStructuredData = () => {
    const baseData = {
      "@context": "https://schema.org",
      "@type": type === 'article' ? 'BlogPosting' : 'WebPage',
      "headline": title,
      "description": formatDescription(),
      "image": {
        "@type": "ImageObject",
        "url": fullImage,
        "width": 1200,
        "height": 630
      },
      "url": fullUrl,
      "inLanguage": currentLanguage === 'en' ? 'en-US' : 'es-BO',
      "publisher": {
        "@type": "Organization",
        "name": siteName,
        "logo": {
          "@type": "ImageObject",
          "url": `${siteUrl}/house1.jpg`,
          "width": 600,
          "height": 60
        }
      }
    };

    if (type === 'article' && article) {
      return {
        ...baseData,
        "@type": "BlogPosting",
        "datePublished": publishedTime || article.publishedTime,
        "dateModified": modifiedTime || article.modifiedTime || publishedTime || article.publishedTime,
        "author": {
          "@type": "Organization",
          "name": author
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": fullUrl
        },
        ...(article.category && {
          "articleSection": article.category
        }),
        ...(keywords.length > 0 && {
          "keywords": keywords.join(', ')
        })
      };
    }

    return baseData;
  };

  // Breadcrumb avec URLs normalisées
  const getBreadcrumbData = () => {
    if (type === 'article') {
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": siteUrl
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Blog",
            "item": `${siteUrl}/${currentLanguage}/blog`
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": title,
            "item": fullUrl
          }
        ]
      };
    }
    return null;
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{formatTitle()}</title>
      <meta name="description" content={formatDescription()} />
      {allKeywords.length > 0 && (
        <meta name="keywords" content={allKeywords.join(', ')} />
      )}
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Hreflang tags */}
      {getHreflangTags()}
      
      {/* x-default */}
      {alternateLanguages && (
        <link 
          rel="alternate" 
          hrefLang="x-default" 
          href={`${siteUrl}${alternateLanguages.en || alternateLanguages.es}`} 
        />
      )}
      
      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={formatTitle()} />
      <meta property="og:description" content={formatDescription()} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={currentLanguage === 'en' ? 'en_US' : 'es_BO'} />
      <meta property="og:locale:alternate" content={currentLanguage === 'en' ? 'es_BO' : 'en_US'} />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={formatTitle()} />
      <meta name="twitter:description" content={formatDescription()} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:image:alt" content={title} />
      
      {/* Article specific */}
      {type === 'article' && article && (
        <>
          <meta property="article:published_time" content={publishedTime || article.publishedTime} />
          {(modifiedTime || article.modifiedTime) && (
            <meta property="article:modified_time" content={modifiedTime || article.modifiedTime} />
          )}
          <meta property="article:author" content={author} />
          {article.category && (
            <meta property="article:section" content={article.category} />
          )}
          {keywords.length > 0 && keywords.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
      
      {/* Breadcrumb */}
      {getBreadcrumbData() && (
        <script type="application/ld+json">
          {JSON.stringify(getBreadcrumbData())}
        </script>
      )}
    </Helmet>
  );
};

export default SEOHelmet;