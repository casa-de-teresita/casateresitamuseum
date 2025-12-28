// netlify/functions/fetchContentPerformance.js - AVEC DÉCODAGE BASE64
const { BetaAnalyticsDataClient } = require('@google-analytics/data');

const PROPERTY_ID = process.env.GA4_PROPERTY_ID;
const SERVICE_ACCOUNT_KEY = process.env.GA4_SERVICE_ACCOUNT_KEY;

// ==============================================
// 🔧 HELPER: DECODE BASE64 SERVICE ACCOUNT KEY
// ==============================================

function decodeServiceAccountKey(base64Key) {
  try {
    console.log('🔄 Decoding base64 service account key...');
    const decodedString = Buffer.from(base64Key, 'base64').toString('utf-8');
    const credentials = JSON.parse(decodedString);
    
    if (!credentials.client_email || !credentials.private_key) {
      throw new Error('Missing required fields in service account key');
    }
    
    console.log('✅ Service account parsed:', credentials.client_email);
    return credentials;
  } catch (error) {
    console.error('❌ Error decoding service account key:', error.message);
    throw new Error('Invalid service account key format: ' + error.message);
  }
}

// ==============================================
// 🎯 CACHE CONFIGURATION
// ==============================================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cache = null;
let cacheTimestamp = 0;

function isCacheValid() {
  return cache && (Date.now() - cacheTimestamp) < CACHE_DURATION;
}

// ==============================================
// 📝 BLOG ANALYTICS
// ==============================================

async function fetchBlogAnalytics(client, startDateStr, endDateStr) {
  console.log('📝 Fetching blog analytics...');
  
  const [blogPostsResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' }
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' },
      { name: 'averageSessionDuration' },
      { name: 'engagementRate' },
      { name: 'bounceRate' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'CONTAINS',
          value: '/blog/'
        }
      }
    },
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20
  });

  const [blogCategoriesResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' },
      { name: 'engagementRate' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'CONTAINS',
          value: '/blog/'
        }
      }
    }
  });

  const categoryStats = {};
  (blogCategoriesResponse.rows || []).forEach(row => {
    const path = row.dimensionValues[0].value;
    const parts = path.split('/');
    const slug = parts[parts.length - 1] || 'uncategorized';
    
    if (!categoryStats[slug]) {
      categoryStats[slug] = {
        views: 0,
        users: 0,
        engagement: 0,
        count: 0
      };
    }
    
    categoryStats[slug].views += parseInt(row.metricValues[0].value || 0);
    categoryStats[slug].users += parseInt(row.metricValues[1].value || 0);
    categoryStats[slug].engagement += parseFloat(row.metricValues[2].value || 0);
    categoryStats[slug].count += 1;
  });

  const categories = Object.entries(categoryStats).map(([slug, stats]) => ({
    slug,
    views: stats.views,
    users: stats.users,
    avgEngagement: stats.count > 0 ? (stats.engagement / stats.count) * 100 : 0,
    articleCount: stats.count
  })).sort((a, b) => b.views - a.views).slice(0, 5);

  const posts = (blogPostsResponse.rows || []).map(row => {
    const path = row.dimensionValues[0].value;
    const title = row.dimensionValues[1].value;
    const slug = path.split('/').pop() || 'unknown';
    const language = path.includes('/es/') ? 'es' : 'en';
    
    return {
      path,
      title: title !== '(not set)' ? title : slug,
      slug,
      language,
      views: parseInt(row.metricValues[0].value || 0),
      uniqueReaders: parseInt(row.metricValues[1].value || 0),
      avgReadTime: Math.round(parseFloat(row.metricValues[2].value || 0)),
      engagementRate: Math.round(parseFloat(row.metricValues[3].value || 0) * 100),
      bounceRate: Math.round(parseFloat(row.metricValues[4].value || 0) * 100),
      readCompletionRate: Math.round(parseFloat(row.metricValues[3].value || 0) * 100)
    };
  });

  const totalBlogViews = posts.reduce((sum, post) => sum + post.views, 0);
  const totalBlogReaders = posts.reduce((sum, post) => sum + post.uniqueReaders, 0);
  const avgEngagement = posts.length > 0 
    ? posts.reduce((sum, post) => sum + post.engagementRate, 0) / posts.length 
    : 0;

  return {
    overview: {
      totalViews: totalBlogViews,
      totalReaders: totalBlogReaders,
      avgEngagement: Math.round(avgEngagement),
      totalArticles: posts.length
    },
    posts,
    categories,
    topPerformers: posts.slice(0, 5),
    languageBreakdown: {
      en: posts.filter(p => p.language === 'en').length,
      es: posts.filter(p => p.language === 'es').length
    }
  };
}

// ==============================================
// 🏛️ MUSEUM ANALYTICS
// ==============================================

async function fetchMuseumAnalytics(client, startDateStr, endDateStr) {
  console.log('🏛️ Fetching museum analytics...');
  
  const [artworksResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'pageTitle' }
    ],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' },
      { name: 'averageSessionDuration' },
      { name: 'engagementRate' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'CONTAINS',
          value: '/museum/'
        }
      }
    },
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20
  });

  const [mediaResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'eventName' }],
    metrics: [
      { name: 'eventCount' },
      { name: 'totalUsers' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'eventName',
        inListFilter: {
          values: ['media_interaction', 'video_play', 'audio_play']
        }
      }
    }
  });

  const [categoriesResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'totalUsers' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'CONTAINS',
          value: '/museum/'
        }
      }
    }
  });

  const artworks = (artworksResponse.rows || []).map(row => {
    const path = row.dimensionValues[0].value;
    const title = row.dimensionValues[1].value;
    const slug = path.split('/').pop() || 'unknown';
    const language = path.includes('/es/') ? 'es' : 'en';
    
    return {
      path,
      title: title !== '(not set)' ? title : slug,
      slug,
      language,
      views: parseInt(row.metricValues[0].value || 0),
      uniqueVisitors: parseInt(row.metricValues[1].value || 0),
      avgViewTime: Math.round(parseFloat(row.metricValues[2].value || 0)),
      engagementRate: Math.round(parseFloat(row.metricValues[3].value || 0) * 100)
    };
  });

  let totalMediaInteractions = 0;
  let uniqueMediaUsers = 0;
  (mediaResponse.rows || []).forEach(row => {
    totalMediaInteractions += parseInt(row.metricValues[0].value || 0);
    uniqueMediaUsers += parseInt(row.metricValues[1].value || 0);
  });

  const categoryMap = {};
  (categoriesResponse.rows || []).forEach(row => {
    const path = row.dimensionValues[0].value;
    const slug = path.split('/').pop() || 'unknown';
    
    if (!categoryMap[slug]) {
      categoryMap[slug] = {
        views: 0,
        users: 0
      };
    }
    
    categoryMap[slug].views += parseInt(row.metricValues[0].value || 0);
    categoryMap[slug].users += parseInt(row.metricValues[1].value || 0);
  });

  const categories = Object.entries(categoryMap)
    .map(([slug, stats]) => ({
      name: slug,
      views: stats.views,
      visitors: stats.users
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 8);

  const totalMuseumViews = artworks.reduce((sum, art) => sum + art.views, 0);
  const totalVisitors = artworks.reduce((sum, art) => sum + art.uniqueVisitors, 0);
  const avgEngagement = artworks.length > 0
    ? artworks.reduce((sum, art) => sum + art.engagementRate, 0) / artworks.length
    : 0;

  return {
    overview: {
      totalViews: totalMuseumViews,
      totalVisitors,
      avgEngagement: Math.round(avgEngagement),
      totalArtworks: artworks.length,
      mediaInteractions: totalMediaInteractions,
      uniqueMediaUsers
    },
    artworks,
    categories,
    topArtworks: artworks.slice(0, 5),
    mediaInteractions: {
      total: totalMediaInteractions,
      uniqueUsers: uniqueMediaUsers,
      avgPerUser: uniqueMediaUsers > 0 ? (totalMediaInteractions / uniqueMediaUsers).toFixed(1) : 0
    }
  };
}

// ==============================================
// 🔗 CONTENT CORRELATION
// ==============================================

async function fetchContentCorrelation(client, startDateStr, endDateStr) {
  console.log('🔗 Fetching content correlation...');
  
  const [blogToBookingResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'eventName' }
    ],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'pagePath',
              stringFilter: {
                matchType: 'CONTAINS',
                value: '/blog/'
              }
            }
          },
          {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: ['whatsapp_click', 'view_item', 'begin_checkout']
              }
            }
          }
        ]
      }
    }
  });

  const [museumToRoomResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [
      { name: 'pagePath' },
      { name: 'eventName' }
    ],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      andGroup: {
        expressions: [
          {
            filter: {
              fieldName: 'pagePath',
              stringFilter: {
                matchType: 'CONTAINS',
                value: '/museum/'
              }
            }
          },
          {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: ['view_item', 'whatsapp_click']
              }
            }
          }
        ]
      }
    }
  });

  let blogConversions = 0;
  (blogToBookingResponse.rows || []).forEach(row => {
    blogConversions += parseInt(row.metricValues[0].value || 0);
  });

  let museumToRoomViews = 0;
  (museumToRoomResponse.rows || []).forEach(row => {
    museumToRoomViews += parseInt(row.metricValues[0].value || 0);
  });

  return {
    blogToBooking: {
      conversions: blogConversions,
      conversionRate: 0
    },
    museumToRooms: {
      roomViews: museumToRoomViews,
      clickThroughRate: 0
    }
  };
}

// ==============================================
// 🚀 MAIN HANDLER
// ==============================================

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (!PROPERTY_ID || !SERVICE_ACCOUNT_KEY) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Configuration error',
        message: 'GA4_PROPERTY_ID or GA4_SERVICE_ACCOUNT_KEY not set'
      })
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const dateRangeType = body.dateRange || 'last30Days';
    const useCache = body.useCache !== false;

    if (useCache && isCacheValid()) {
      console.log('✅ Returning cached data');
      return {
        statusCode: 200,
        headers: { ...headers, 'X-Cache': 'HIT' },
        body: JSON.stringify(cache)
      };
    }

    console.log('🔄 Fetching fresh content performance data...');
    
    // ✅ DÉCODER LA CLÉ BASE64
    const credentials = decodeServiceAccountKey(SERVICE_ACCOUNT_KEY);
    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

    const today = new Date();
    const startDate = new Date();
    
    switch(dateRangeType) {
      case 'last7Days':
        startDate.setDate(today.getDate() - 7);
        break;
      case 'last30Days':
        startDate.setDate(today.getDate() - 30);
        break;
      case 'last90Days':
        startDate.setDate(today.getDate() - 90);
        break;
      default:
        startDate.setDate(today.getDate() - 30);
    }
    
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = today.toISOString().split('T')[0];

    console.log(`📅 Analyzing content from ${startDateStr} to ${endDateStr}`);

    const [blog, museum, correlation] = await Promise.all([
      fetchBlogAnalytics(analyticsDataClient, startDateStr, endDateStr),
      fetchMuseumAnalytics(analyticsDataClient, startDateStr, endDateStr),
      fetchContentCorrelation(analyticsDataClient, startDateStr, endDateStr)
    ]);

    const contentPerformance = {
      blog,
      museum,
      correlation,
      metadata: {
        dateRange: dateRangeType,
        startDate: startDateStr,
        endDate: endDateStr,
        generatedAt: new Date().toISOString()
      }
    };

    cache = contentPerformance;
    cacheTimestamp = Date.now();

    console.log('✅ Content performance data fetched successfully');
    console.log(`📝 Blog posts: ${blog.posts.length}`);
    console.log(`🏛️ Museum artworks: ${museum.artworks.length}`);

    return {
      statusCode: 200,
      headers: { ...headers, 'X-Cache': 'MISS' },
      body: JSON.stringify(contentPerformance)
    };

  } catch (error) {
    console.error('❌ Content Performance API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch content performance',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
