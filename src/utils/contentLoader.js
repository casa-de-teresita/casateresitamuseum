// src/utils/contentLoader.js - VERSION AVEC CACHE OPTIMISÉ
import matter from 'gray-matter';

// ==========================================
// 🎯 SYSTÈME DE CACHE
// ==========================================

const CACHE = {
  blog: {
    en: null,
    es: null
  },
  museum: {
    en: null,
    es: null
  },
  manifests: {
    blog_en: null,
    blog_es: null,
    museum_en: null,
    museum_es: null
  },
  singlePosts: {}, // { 'blog_en_slug': {...}, 'museum_es_slug': {...} }
  timestamps: {}
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MANIFEST_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes (manifests changent rarement)

/**
 * Vérifier si le cache est valide
 */
function isCacheValid(cacheKey, customDuration = CACHE_DURATION) {
  const timestamp = CACHE.timestamps[cacheKey];
  if (!timestamp) return false;
  
  const now = Date.now();
  const isValid = (now - timestamp) < customDuration;
  
  if (!isValid) {
    console.log(`⏰ Cache expired for: ${cacheKey}`);
  }
  
  return isValid;
}

/**
 * Récupérer depuis le cache
 */
function getFromCache(type, language, slug = null) {
  if (slug) {
    // Cache pour un article spécifique
    const cacheKey = `${type}_${language}_${slug}`;
    if (CACHE.singlePosts[cacheKey] && isCacheValid(cacheKey)) {
      console.log(`✅ Cache HIT: ${cacheKey}`);
      return CACHE.singlePosts[cacheKey];
    }
  } else {
    // Cache pour la liste complète
    const cacheKey = `${type}_${language}`;
    if (CACHE[type][language] && isCacheValid(cacheKey)) {
      console.log(`✅ Cache HIT: ${type} (${language}) - ${CACHE[type][language].length} items`);
      return CACHE[type][language];
    }
  }
  
  console.log(`❌ Cache MISS: ${type}_${language}${slug ? '_' + slug : ''}`);
  return null;
}

/**
 * Sauvegarder dans le cache
 */
function saveToCache(type, language, data, slug = null) {
  const now = Date.now();
  
  if (slug) {
    // Cache d'un article spécifique
    const cacheKey = `${type}_${language}_${slug}`;
    CACHE.singlePosts[cacheKey] = data;
    CACHE.timestamps[cacheKey] = now;
    console.log(`💾 Cached: ${cacheKey}`);
  } else {
    // Cache de la liste complète
    const cacheKey = `${type}_${language}`;
    CACHE[type][language] = data;
    CACHE.timestamps[cacheKey] = now;
    console.log(`💾 Cached: ${cacheKey} - ${data.length} items`);
  }
}

/**
 * Récupérer manifest depuis le cache
 */
function getManifestFromCache(type, language) {
  const cacheKey = `${type}_${language}`;
  
  if (CACHE.manifests[cacheKey] && isCacheValid(cacheKey, MANIFEST_CACHE_DURATION)) {
    console.log(`✅ Manifest Cache HIT: ${cacheKey}`);
    return CACHE.manifests[cacheKey];
  }
  
  return null;
}

/**
 * Sauvegarder manifest dans le cache
 */
function saveManifestToCache(type, language, manifest) {
  const cacheKey = `${type}_${language}`;
  CACHE.manifests[cacheKey] = manifest;
  CACHE.timestamps[cacheKey] = Date.now();
  console.log(`💾 Manifest cached: ${cacheKey}`);
}

/**
 * Vider le cache (utile pour debug ou refresh)
 */
export function clearCache(type = null, language = null) {
  if (type && language) {
    // Vider cache spécifique
    const cacheKey = `${type}_${language}`;
    CACHE[type][language] = null;
    CACHE.manifests[cacheKey] = null;
    delete CACHE.timestamps[cacheKey];
    
    // Vider aussi les posts individuels de ce type/langue
    Object.keys(CACHE.singlePosts).forEach(key => {
      if (key.startsWith(`${type}_${language}_`)) {
        delete CACHE.singlePosts[key];
        delete CACHE.timestamps[key];
      }
    });
    
    console.log(`🗑️ Cache cleared for: ${type} (${language})`);
  } else {
    // Vider tout le cache
    CACHE.blog = { en: null, es: null };
    CACHE.museum = { en: null, es: null };
    CACHE.manifests = { blog_en: null, blog_es: null, museum_en: null, museum_es: null };
    CACHE.singlePosts = {};
    CACHE.timestamps = {};
    console.log('🗑️ All cache cleared');
  }
}

/**
 * Obtenir statistiques du cache
 */
export function getCacheStats() {
  const stats = {
    blog: {
      en: CACHE.blog.en ? `${CACHE.blog.en.length} posts` : 'empty',
      es: CACHE.blog.es ? `${CACHE.blog.es.length} posts` : 'empty'
    },
    museum: {
      en: CACHE.museum.en ? `${CACHE.museum.en.length} artworks` : 'empty',
      es: CACHE.museum.es ? `${CACHE.museum.es.length} artworks` : 'empty'
    },
    singlePosts: Object.keys(CACHE.singlePosts).length,
    timestamps: Object.keys(CACHE.timestamps).length
  };
  
  console.table(stats);
  return stats;
}

// ==========================================
// 📁 FETCH FUNCTIONS
// ==========================================

/**
 * Fetch a markdown file from public directory
 */
async function fetchMarkdownFile(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}`);
    }
    return await response.text();
  } catch (error) {
    console.error(`Error fetching ${path}:`, error);
    return null;
  }
}

/**
 * Fetch manifest with cache
 */
async function fetchManifest(type, language) {
  // Vérifier le cache d'abord
  const cached = getManifestFromCache(type, language);
  if (cached) return cached;
  
  // Charger depuis le serveur
  const manifestPath = `/content/${type}/${language}/manifest.json`;
  
  try {
    const manifestResponse = await fetch(manifestPath);
    
    if (!manifestResponse.ok) {
      console.warn(`No ${type} manifest found for ${language}`);
      return null;
    }
    
    const manifest = await manifestResponse.json();
    
    // Sauvegarder dans le cache
    saveManifestToCache(type, language, manifest);
    
    return manifest;
  } catch (error) {
    console.error(`Error loading ${type} manifest:`, error);
    return null;
  }
}

// ==========================================
// 📝 BLOG FUNCTIONS
// ==========================================

/**
 * Load all blog posts for a specific language (AVEC CACHE)
 */
export async function getBlogPosts(language = 'en') {
  // 1. Vérifier le cache d'abord
  const cached = getFromCache('blog', language);
  if (cached) return cached;
  
  // 2. Charger depuis le serveur
  console.log(`🔄 Loading blog posts (${language}) from server...`);
  
  try {
    const manifest = await fetchManifest('blog', language);
    
    if (!manifest || !manifest.files || manifest.files.length === 0) {
      console.warn('No blog posts found, returning empty array');
      return [];
    }
    
    const posts = [];
    
    // Charger tous les posts en parallèle (plus rapide)
    const postPromises = manifest.files.map(async (filename) => {
      const filePath = `/content/blog/${language}/${filename}`;
      const content = await fetchMarkdownFile(filePath);
      
      if (content) {
        const { data, content: body } = matter(content);
        
        // Only include published posts
        if (data.published !== false) {
          const slug = filename.replace('.md', '');
          return { 
            ...data, 
            body, 
            slug,
            language,
            filename 
          };
        }
      }
      
      return null;
    });
    
    const loadedPosts = (await Promise.all(postPromises)).filter(Boolean);
    
    // Trier par date (plus récent en premier)
    const sortedPosts = loadedPosts.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB - dateA;
    });
    
    // 3. Sauvegarder dans le cache
    saveToCache('blog', language, sortedPosts);
    
    // 4. Aussi mettre en cache chaque post individuellement
    sortedPosts.forEach(post => {
      saveToCache('blog', language, post, post.slug);
    });
    
    return sortedPosts;
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

/**
 * Load a single blog post by slug (AVEC CACHE)
 */
export async function getBlogPost(slug, language = 'en') {
  // 1. Vérifier le cache d'abord
  const cached = getFromCache('blog', language, slug);
  if (cached) return cached;
  
  // 2. Essayer de trouver dans la liste complète (si elle est en cache)
  const allPosts = getFromCache('blog', language);
  if (allPosts) {
    const post = allPosts.find(p => p.slug === slug);
    if (post) {
      // Mettre en cache individuellement pour la prochaine fois
      saveToCache('blog', language, post, slug);
      return post;
    }
  }
  
  // 3. Charger directement depuis le serveur
  console.log(`🔄 Loading single blog post: ${slug} (${language})`);
  
  try {
    const filePath = `/content/blog/${language}/${slug}.md`;
    const content = await fetchMarkdownFile(filePath);
    
    if (!content) return null;
    
    const { data, content: body } = matter(content);
    
    // Parse articleImages if they exist
    let articleImages = null;
    if (data.articleImages && Array.isArray(data.articleImages)) {
      articleImages = {};
      data.articleImages.forEach((img, index) => {
        if (img && img.src) {
          articleImages[`image${index + 1}`] = {
            src: img.src,
            alt: img.alt || '',
            caption: img.caption || ''
          };
        }
      });
    }
    
    const post = {
      ...data,
      body,
      slug,
      language,
      articleImages,
      filename: `${slug}.md`
    };
    
    // Sauvegarder dans le cache
    saveToCache('blog', language, post, slug);
    
    return post;
  } catch (error) {
    console.error('Error loading blog post:', error);
    return null;
  }
}

/**
 * Get alternate language version of a blog post
 */
export async function getAlternateBlogPost(slug, currentLanguage) {
  const alternateLanguage = currentLanguage === 'en' ? 'es' : 'en';
  return await getBlogPost(slug, alternateLanguage);
}

// ==========================================
// 🏛️ MUSEUM FUNCTIONS
// ==========================================

/**
 * Load all museum artworks for a specific language (AVEC CACHE)
 */
export async function getMuseumArtworks(language = 'en') {
  // 1. Vérifier le cache d'abord
  const cached = getFromCache('museum', language);
  if (cached) return cached;
  
  // 2. Charger depuis le serveur
  console.log(`🔄 Loading museum artworks (${language}) from server...`);
  
  try {
    const manifest = await fetchManifest('museum', language);
    
    if (!manifest || !manifest.files || manifest.files.length === 0) {
      console.warn('No museum artworks found, returning empty array');
      return [];
    }
    
    // Charger tous les artworks en parallèle
    const artworkPromises = manifest.files.map(async (filename) => {
      const filePath = `/content/museum/${language}/${filename}`;
      const content = await fetchMarkdownFile(filePath);
      
      if (content) {
        const { data, content: body } = matter(content);
        const slug = filename.replace('.md', '');
        
        return { 
          ...data, 
          body, 
          slug,
          language,
          filename 
        };
      }
      
      return null;
    });
    
    const loadedArtworks = (await Promise.all(artworkPromises)).filter(Boolean);
    
    // Trier par ordre d'affichage
    const sortedArtworks = loadedArtworks.sort((a, b) => (a.order || 0) - (b.order || 0));
    
    // 3. Sauvegarder dans le cache
    saveToCache('museum', language, sortedArtworks);
    
    // 4. Aussi mettre en cache chaque artwork individuellement
    sortedArtworks.forEach(artwork => {
      saveToCache('museum', language, artwork, artwork.slug);
    });
    
    return sortedArtworks;
  } catch (error) {
    console.error('Error loading artworks:', error);
    return [];
  }
}

/**
 * Load a single artwork by slug (AVEC CACHE)
 */
export async function getMuseumArtwork(slug, language = 'en') {
  // 1. Vérifier le cache d'abord
  const cached = getFromCache('museum', language, slug);
  if (cached) return cached;
  
  // 2. Essayer de trouver dans la liste complète (si elle est en cache)
  const allArtworks = getFromCache('museum', language);
  if (allArtworks) {
    const artwork = allArtworks.find(a => a.slug === slug);
    if (artwork) {
      saveToCache('museum', language, artwork, slug);
      return artwork;
    }
  }
  
  // 3. Charger directement depuis le serveur
  console.log(`🔄 Loading single artwork: ${slug} (${language})`);
  
  try {
    const filePath = `/content/museum/${language}/${slug}.md`;
    const content = await fetchMarkdownFile(filePath);
    
    if (!content) return null;
    
    const { data, content: body } = matter(content);
    
    const artwork = {
      ...data,
      body,
      slug,
      language,
      filename: `${slug}.md`
    };
    
    // Sauvegarder dans le cache
    saveToCache('museum', language, artwork, slug);
    
    return artwork;
  } catch (error) {
    console.error('Error loading artwork:', error);
    return null;
  }
}

/**
 * Get alternate language version of a museum artwork
 */
export async function getAlternateMuseumArtwork(slug, currentLanguage) {
  const alternateLanguage = currentLanguage === 'en' ? 'es' : 'en';
  return await getMuseumArtwork(slug, alternateLanguage);
}
/**
 * 🆕 Load PUBLIC museum artworks only (excluant QR-only)
 */
export async function getPublicMuseumArtworks(language = 'en') {
  const allArtworks = await getMuseumArtworks(language);
  
  // Filtrer uniquement les artworks publics
  const publicArtworks = allArtworks.filter(artwork => {
    // Si pas de champ accessibility, considérer comme public par défaut
    const accessibility = artwork.accessibility || 'public';
    return accessibility === 'public';
  });
  
  // Trier avec gestion de "auto"
  const sortedArtworks = sortArtworksByOrder(publicArtworks);
  
  console.log(`📋 Public artworks (${language}): ${sortedArtworks.length}/${allArtworks.length}`);
  
  return sortedArtworks;
}

/**
 * 🔧 Fonction de tri qui gère "auto" et les valeurs numériques
 */
function sortArtworksByOrder(artworks) {
  return artworks.sort((a, b) => {
    // Récupérer les valeurs d'order
    const orderA = a.order;
    const orderB = b.order;
    
    // Convertir "auto" en nombre très élevé (9999) pour le placer à la fin
    const numA = orderA === 'auto' ? 9999 : (typeof orderA === 'number' ? orderA : parseInt(orderA) || 0);
    const numB = orderB === 'auto' ? 9999 : (typeof orderB === 'number' ? orderB : parseInt(orderB) || 0);
    
    return numA - numB;
  });
}

/**
 * 🆕 Load QR-only museum artworks (pour statistiques/admin)
 */
export async function getQROnlyArtworks(language = 'en') {
  const allArtworks = await getMuseumArtworks(language);
  
  const qrOnlyArtworks = allArtworks.filter(artwork => {
    return artwork.accessibility === 'qr-only';
  });
  
  console.log(`🔐 QR-only artworks (${language}): ${qrOnlyArtworks.length}`);
  
  return qrOnlyArtworks;
}

/**
 * ℹ️ Vérifier si un artwork est accessible
 */
export function isArtworkAccessible(artwork) {
  if (!artwork) return false;
  
  // Vérifier si publié
  if (artwork.published === false) return false;
  
  // Les artworks QR-only sont toujours accessibles via URL directe
  return true;
}

/**
 * 📊 Obtenir les statistiques de visibilité
 */
export async function getArtworkVisibilityStats(language = 'en') {
  const allArtworks = await getMuseumArtworks(language);
  
  const stats = {
    total: allArtworks.length,
    public: allArtworks.filter(a => (a.accessibility || 'public') === 'public').length,
    qrOnly: allArtworks.filter(a => a.accessibility === 'qr-only').length,
    published: allArtworks.filter(a => a.published !== false).length,
    draft: allArtworks.filter(a => a.published === false).length,
    featured: allArtworks.filter(a => a.featured === true).length
  };
  
  console.table(stats);
  return stats;
}

// ==========================================
// 🔍 FILTER FUNCTIONS
// ==========================================

/**
 * Get blog posts filtered by category (AVEC CACHE)
 */
export async function getBlogPostsByCategory(category, language = 'en') {
  const posts = await getBlogPosts(language);
  if (!category || category === 'All') return posts;
  return posts.filter(post => post.category === category);
}

/**
 * Get artworks filtered by category (AVEC CACHE)
 */
export async function getArtworksByCategory(category, language = 'en', includeQROnly = false) {
  // Utiliser getPublicMuseumArtworks au lieu de getMuseumArtworks
  const artworks = includeQROnly 
    ? await getMuseumArtworks(language)  // Tous
    : await getPublicMuseumArtworks(language); // Publics uniquement
  
  if (!category || category === 'All') return artworks;
  return artworks.filter(artwork => artwork.category === category);
}

// ==========================================
// 📊 UTILITY FUNCTIONS
// ==========================================

/**
 * Calculate reading time for blog post
 */
export function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Get related blog posts
 */
export async function getRelatedPosts(currentPost, language = 'en', limit = 3) {
  const allPosts = await getBlogPosts(language);
  
  // Filter out current post and get posts from same category
  const related = allPosts
    .filter(post => post.slug !== currentPost.slug && post.category === currentPost.category)
    .slice(0, limit);
  
  // If not enough posts in same category, add random posts
  if (related.length < limit) {
    const remaining = allPosts
      .filter(post => post.slug !== currentPost.slug && !related.includes(post))
      .slice(0, limit - related.length);
    related.push(...remaining);
  }
  
  return related;
}

// ==========================================
// 🚀 PRELOAD FUNCTIONS
// ==========================================

/**
 * Précharger les données critiques (à appeler au démarrage de l'app)
 */
export async function preloadCriticalData() {
  console.log('🚀 Preloading critical data...');
  
  try {
    // Charger en parallèle les données des deux langues
    await Promise.all([
      // Museum (prioritaire)
      getMuseumArtworks('en'),
      getMuseumArtworks('es'),
      // Blog
      getBlogPosts('en'),
      getBlogPosts('es')
    ]);
    
    console.log('✅ Critical data preloaded');
    getCacheStats(); // Afficher les stats
  } catch (error) {
    console.error('⚠️ Error preloading data:', error);
  }
}

// ==========================================
// 🧪 DEBUG HELPERS
// ==========================================

// Exposer les fonctions debug en développement
if (import.meta.env.DEV) {
  window.__contentLoader = {
    clearCache,
    getCacheStats,
    preloadCriticalData,
    CACHE // Pour inspection
  };
  
  console.log('🔧 Debug helpers available: window.__contentLoader');
}