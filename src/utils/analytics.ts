// src/utils/analytics.ts - ENHANCED VERSION WITH ALL TRACKING

interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debug: boolean;
}

interface PageViewParams {
  page_title: string;
  page_location: string;
  page_path: string;
  language?: string;
}

interface EventParams {
  [key: string]: string | number | boolean | undefined | any[] | object;
}

const GA_CONFIG: AnalyticsConfig = {
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-PEPZTL0NRS',
  enabled: true,
  debug: import.meta.env.DEV,
};

// ==========================================
// 🚀 Initialization
// ==========================================

export function initGA(): void {
  const consent = localStorage.getItem('cookie_consent');
  if (consent !== 'accepted') {
    console.log('📊 GA: Waiting for cookie consent');
    GA_CONFIG.enabled = false;
    return;
  }

  if (!GA_CONFIG.measurementId || GA_CONFIG.measurementId === 'G-XXXXXXXXXX') {
    console.error('❌ GA: Invalid measurement ID');
    return;
  }

  if (window.gtag) {
    console.log('⚠️ GA: Already initialized');
    return;
  }

  try {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_CONFIG.measurementId}`;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() {
      window.dataLayer.push(arguments);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', GA_CONFIG.measurementId, {
      send_page_view: false,
      cookie_flags: 'SameSite=None;Secure',
      anonymize_ip: true,
    });

    GA_CONFIG.enabled = true;
    console.log('✅ GA Initialized:', GA_CONFIG.measurementId);
  } catch (error) {
    console.error('❌ GA Initialization failed:', error);
    GA_CONFIG.enabled = false;
  }
}

// ==========================================
// 📄 Page Tracking
// ==========================================

export function trackPageView(params: Partial<PageViewParams> = {}): void {
  if (!GA_CONFIG.enabled || !window.gtag) {
    if (GA_CONFIG.debug) {
      console.log('📊 GA disabled or not loaded');
    }
    return;
  }

  const pageParams: PageViewParams = {
    page_title: document.title,
    page_location: window.location.href,
    page_path: window.location.pathname,
    language: document.documentElement.lang || 'en',
    ...params,
  };

  window.gtag('event', 'page_view', pageParams);

  if (GA_CONFIG.debug) {
    console.log('📊 GA Page View:', pageParams);
  }
}

// ==========================================
// 🎯 Event Tracking
// ==========================================

export function trackEvent(eventName: string, params: EventParams = {}): void {
  if (!GA_CONFIG.enabled || !window.gtag) {
    if (GA_CONFIG.debug) {
      console.log(`📊 GA Event (disabled): ${eventName}`, params);
    }
    return;
  }

  window.gtag('event', eventName, params);

  if (GA_CONFIG.debug) {
    console.log(`📊 GA Event: ${eventName}`, params);
  }
}

// ==========================================
// 🏨 HOTEL-SPECIFIC EVENTS - ENHANCED
// ==========================================

/**
 * Track room view (when user clicks or views room detail page)
 */
export function trackRoomView(roomId: string, roomName: string, price: number, source: string = 'unknown'): void {
  trackEvent('view_item', {
    item_id: roomId,
    item_name: roomName,
    item_category: 'Room',
    price: price,
    currency: 'USD',
    source: source, // 'homepage', 'rooms_section', 'detail_page', etc.
  });
}

/**
 * Track room click (when user clicks "See details" or similar)
 */
export function trackRoomClick(roomId: string, roomName: string, price: number, location: string): void {
  trackEvent('select_item', {
    item_id: roomId,
    item_name: roomName,
    item_category: 'Room',
    price: price,
    currency: 'USD',
    click_location: location, // 'carousel', 'grid', 'featured', etc.
  });
}

/**
 * Track WhatsApp booking - ENHANCED
 */
export function trackWhatsAppClick(
  source: string,
  roomId?: string,
  roomName?: string,
  totalPrice?: number,
  nights?: number,
  hasDateRange?: boolean
): void {
  trackEvent('whatsapp_click', {
    source: source, // 'room_detail', 'homepage', 'footer', 'floating_button', etc.
    room_id: roomId || 'none',
    room_name: roomName || 'general_inquiry',
    value: totalPrice || 0,
    nights: nights || 0,
    has_date_range: hasDateRange || false,
    currency: 'USD',
  });
  
  // Also track as conversion event
  if (roomId && totalPrice) {
    trackEvent('begin_checkout', {
      method: 'WhatsApp',
      room_id: roomId,
      room_name: roomName,
      value: totalPrice,
      nights: nights || 1,
      currency: 'USD',
    });
  }
}

/**
 * Track date selection
 */
export function trackDateSelection(
  checkIn: Date,
  checkOut: Date,
  nights: number,
  roomId?: string
): void {
  trackEvent('select_dates', {
    check_in: checkIn.toISOString().split('T')[0],
    check_out: checkOut.toISOString().split('T')[0],
    nights: nights,
    room_id: roomId || 'unknown',
  });
}

/**
 * Track price check
 */
export function trackPriceCheck(
  roomId: string,
  totalPrice: number,
  nights: number,
  avgPricePerNight: number
): void {
  trackEvent('view_price', {
    room_id: roomId,
    total_price: totalPrice,
    nights: nights,
    avg_price_per_night: avgPricePerNight,
    currency: 'USD',
  });
}

// ==========================================
// 📰 BLOG TRACKING - ENHANCED
// ==========================================

/**
 * Track blog post click (from blog list page)
 */
export function trackBlogClick(
  slug: string,
  title: string,
  category: string,
  location: string
): void {
  trackEvent('blog_click', {
    content_id: slug,
    content_name: title,
    content_category: category,
    click_location: location, // 'featured', 'grid', 'related', 'category_filter', etc.
  });
}

/**
 * Track blog post view (when viewing full article)
 */
export function trackBlogView(
  slug: string,
  title: string,
  category: string,
  readingTime: number
): void {
  trackEvent('view_blog_post', {
    content_id: slug,
    content_name: title,
    content_category: category,
    reading_time: readingTime,
  });
}

/**
 * Track blog share
 */
export function trackBlogShare(slug: string, title: string, method: string): void {
  trackEvent('share', {
    content_type: 'blog_post',
    content_id: slug,
    content_name: title,
    method: method,
  });
}

// ==========================================
// 🏛️ MUSEUM TRACKING - ENHANCED
// ==========================================

/**
 * Track museum artwork click (from museum list page)
 */
export function trackArtworkClick(
  slug: string,
  title: string,
  category: string,
  location: string
): void {
  trackEvent('artwork_click', {
    content_id: slug,
    content_name: title,
    content_category: category,
    click_location: location, // 'featured', 'grid', 'category_filter', etc.
  });
}

/**
 * Track museum artwork view (when viewing full detail page)
 */
export function trackArtworkView(slug: string, title: string, category: string): void {
  trackEvent('view_museum_item', {
    content_id: slug,
    content_name: title,
    content_category: category,
  });
}

/**
 * Track museum tour request
 */
export function trackMuseumTourRequest(): void {
  trackEvent('request_tour', {
    tour_type: 'museum',
  });
}

/**
 * Track media interaction in museum (YouTube, Spotify)
 */
export function trackMediaInteraction(
  artworkSlug: string,
  mediaType: 'youtube' | 'spotify',
  action: 'view' | 'play'
): void {
  trackEvent('media_interaction', {
    artwork_id: artworkSlug,
    media_type: mediaType,
    action: action,
  });
}

// ==========================================
// 🔍 Search & Filter
// ==========================================

export function trackSearch(searchTerm: string, resultCount: number): void {
  trackEvent('search', {
    search_term: searchTerm,
    result_count: resultCount,
  });
}

export function trackFilter(filterType: string, filterValue: string, contentType: string): void {
  trackEvent('filter', {
    filter_type: filterType,
    filter_value: filterValue,
    content_type: contentType, // 'blog', 'museum', 'rooms'
  });
}

// ==========================================
// 📱 Contact & Social
// ==========================================

export function trackContact(method: 'whatsapp' | 'email' | 'phone', source: string): void {
  trackEvent('contact', {
    method: method,
    source: source,
  });
}

export function trackSocialClick(platform: string, location: string): void {
  trackEvent('social_click', {
    platform: platform,
    location: location,
  });
}

// ==========================================
// 🎯 Navigation Tracking
// ==========================================

export function trackNavigation(destination: string, source: string): void {
  trackEvent('navigation', {
    destination: destination,
    source: source,
  });
}

export function trackScrollDepth(depth: number): void {
  trackEvent('scroll', {
    percent_scrolled: depth,
  });
}

// ==========================================
// 🔧 Control Functions
// ==========================================

export function setGAEnabled(enabled: boolean): void {
  GA_CONFIG.enabled = enabled;
  console.log(`📊 GA ${enabled ? 'enabled' : 'disabled'}`);
  
  if (enabled && !window.gtag) {
    initGA();
  }
}

export function isGALoaded(): boolean {
  return !!window.gtag && GA_CONFIG.enabled;
}

export function getGAConfig(): AnalyticsConfig {
  return { ...GA_CONFIG };
}

// ==========================================
// 🌐 Type Declarations
// ==========================================

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export default {
  init: initGA,
  trackPageView,
  trackEvent,
  trackRoomView,
  trackRoomClick,
  trackWhatsAppClick,
  trackDateSelection,
  trackPriceCheck,
  trackBlogClick,
  trackBlogView,
  trackBlogShare,
  trackArtworkClick,
  trackArtworkView,
  trackMuseumTourRequest,
  trackMediaInteraction,
  trackSearch,
  trackFilter,
  trackContact,
  trackSocialClick,
  trackNavigation,
  trackScrollDepth,
  setGAEnabled,
  isGALoaded,
  getGAConfig,
};