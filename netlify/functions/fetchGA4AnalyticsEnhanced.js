// netlify/functions/fetchGA4AnalyticsEnhanced.js - VERSION CORRIGÉE
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
// 🎯 CONFIGURATION & HELPERS
// ==============================================

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
let cache = null;
let cacheTimestamp = 0;

function isoCacheValid() {
  return cache && (Date.now() - cacheTimestamp) < CACHE_DURATION;
}

function calculateDateRange(dateRangeType) {
  const today = new Date();
  const startDate = new Date();
  
  switch(dateRangeType) {
    case 'today':
      return { startDate: today, endDate: today };
    case 'yesterday':
      startDate.setDate(today.getDate() - 1);
      return { startDate, endDate: new Date(startDate) };
    case 'last7Days':
      startDate.setDate(today.getDate() - 7);
      break;
    case 'last30Days':
      startDate.setDate(today.getDate() - 30);
      break;
    case 'last90Days':
      startDate.setDate(today.getDate() - 90);
      break;
    case 'thisMonth':
      startDate.setDate(1);
      break;
    case 'lastMonth':
      startDate.setMonth(today.getMonth() - 1, 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth(), 0);
      return { startDate, endDate: lastDay };
    default:
      startDate.setDate(today.getDate() - 7);
  }
  
  return { startDate, endDate: today };
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function safeParseInt(value, defaultValue = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

function safeParseFloat(value, defaultValue = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// ==============================================
// 📊 DATA FETCHING FUNCTIONS
// ==============================================

async function fetchOverviewMetrics(client, startDateStr, endDateStr, previousStartStr, previousEndStr) {
  console.log('📊 Fetching overview metrics...');
  
  const [currentResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [
      { startDate: startDateStr, endDate: endDateStr }
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'engagementRate' },
      { name: 'newUsers' },
      { name: 'sessionsPerUser' }
    ]
  });

  const [previousResponse] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [
      { startDate: previousStartStr, endDate: previousEndStr }
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'bounceRate' }
    ]
  });

  const current = currentResponse.rows?.[0]?.metricValues || [];
  const previous = previousResponse.rows?.[0]?.metricValues || [];

  const currentMetrics = {
    totalVisits: safeParseInt(current[0]?.value),
    uniqueVisitors: safeParseInt(current[1]?.value),
    pageViews: safeParseInt(current[2]?.value),
    avgSessionDuration: safeParseFloat(current[3]?.value),
    bounceRate: safeParseFloat(current[4]?.value) * 100,
    engagementRate: safeParseFloat(current[5]?.value) * 100,
    newUsers: safeParseInt(current[6]?.value),
    sessionsPerUser: safeParseFloat(current[7]?.value)
  };

  const previousMetrics = {
    totalVisits: safeParseInt(previous[0]?.value),
    uniqueVisitors: safeParseInt(previous[1]?.value),
    pageViews: safeParseInt(previous[2]?.value),
    bounceRate: safeParseFloat(previous[3]?.value) * 100
  };

  const calculateTrend = (current, previous) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  return {
    ...currentMetrics,
    trends: {
      totalVisits: calculateTrend(currentMetrics.totalVisits, previousMetrics.totalVisits),
      uniqueVisitors: calculateTrend(currentMetrics.uniqueVisitors, previousMetrics.uniqueVisitors),
      pageViews: calculateTrend(currentMetrics.pageViews, previousMetrics.pageViews),
      bounceRate: calculateTrend(currentMetrics.bounceRate, previousMetrics.bounceRate)
    }
  };
}

async function fetchTimelineData(client, startDateStr, endDateStr) {
  console.log('📈 Fetching timeline data...');
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'date' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' }
    ],
    orderBys: [{ dimension: { dimensionName: 'date' } }]
  });

  return (response.rows || []).map(row => ({
    date: row.dimensionValues[0].value,
    sessions: safeParseInt(row.metricValues[0].value),
    users: safeParseInt(row.metricValues[1].value),
    pageViews: safeParseInt(row.metricValues[2].value),
    avgDuration: safeParseFloat(row.metricValues[3].value),
    bounceRate: safeParseFloat(row.metricValues[4].value) * 100
  }));
}

async function fetchTopPages(client, startDateStr, endDateStr) {
  console.log('📄 Fetching top pages...');
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'pagePath' }, { name: 'pageTitle' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' },
      { name: 'engagementRate' }
    ],
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 20
  });

  return (response.rows || []).map(row => ({
    path: row.dimensionValues[0].value,
    title: row.dimensionValues[1].value,
    views: safeParseInt(row.metricValues[0].value),
    avgDuration: Math.round(safeParseFloat(row.metricValues[1].value)),
    bounceRate: Math.round(safeParseFloat(row.metricValues[2].value) * 100),
    engagementRate: Math.round(safeParseFloat(row.metricValues[3].value) * 100)
  }));
}

async function fetchDeviceBreakdown(client, startDateStr, endDateStr) {
  console.log('📱 Fetching device breakdown...');
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'deviceCategory' }],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'bounceRate' }
    ]
  });

  return (response.rows || []).map(row => ({
    device: row.dimensionValues[0].value,
    sessions: safeParseInt(row.metricValues[0].value),
    users: safeParseInt(row.metricValues[1].value),
    bounceRate: Math.round(safeParseFloat(row.metricValues[2].value) * 100)
  }));
}

async function fetchTrafficSources(client, startDateStr, endDateStr) {
  console.log('🌐 Fetching traffic sources...');
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [
      { name: 'sessionSource' },
      { name: 'sessionMedium' }
    ],
    metrics: [
      { name: 'sessions' },
      { name: 'totalUsers' },
      { name: 'bounceRate' },
      { name: 'averageSessionDuration' }
    ],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: 10
  });

  return (response.rows || []).map(row => ({
    source: row.dimensionValues[0].value,
    medium: row.dimensionValues[1].value,
    sessions: safeParseInt(row.metricValues[0].value),
    users: safeParseInt(row.metricValues[1].value),
    bounceRate: Math.round(safeParseFloat(row.metricValues[2].value) * 100),
    avgDuration: Math.round(safeParseFloat(row.metricValues[3].value))
  }));
}

async function fetchConversionEvents(client, startDateStr, endDateStr) {
  console.log('🎯 Fetching conversion events...');
  
  const [response] = await client.runReport({
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
          values: [
            'view_item',
            'select_dates',
            'view_price',
            'whatsapp_click',
            'contact',
            'begin_checkout'
          ]
        }
      }
    }
  });

  const conversions = {};
  (response.rows || []).forEach(row => {
    const eventName = row.dimensionValues[0].value;
    conversions[eventName] = {
      count: safeParseInt(row.metricValues[0].value),
      uniqueUsers: safeParseInt(row.metricValues[1].value)
    };
  });

  return {
    roomViews: conversions['view_item']?.count || 0,
    dateSelections: conversions['select_dates']?.count || 0,
    priceChecks: conversions['view_price']?.count || 0,
    whatsappClicks: conversions['whatsapp_click']?.count || 0,
    contactEvents: conversions['contact']?.count || 0,
    bookingIntents: conversions['begin_checkout']?.count || 0
  };
}

async function fetchGeographicData(client, startDateStr, endDateStr) {
  console.log('🗺️ Fetching geographic data...');
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [
      { name: 'country' },
      { name: 'city' }
    ],
    metrics: [
      { name: 'totalUsers' },
      { name: 'sessions' }
    ],
    orderBys: [{ metric: { metricName: 'totalUsers' }, desc: true }],
    limit: 20
  });

  return (response.rows || []).map(row => ({
    country: row.dimensionValues[0].value,
    city: row.dimensionValues[1].value,
    users: safeParseInt(row.metricValues[0].value),
    sessions: safeParseInt(row.metricValues[1].value)
  }));
}

async function fetchBlogPerformance(client, startDateStr, endDateStr) {
  console.log('📝 Fetching blog performance...');
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
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
    },
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
    limit: 10
  });

  return (response.rows || []).map(row => ({
    path: row.dimensionValues[0].value,
    title: row.dimensionValues[0].value.split('/').pop() || 'Unknown',
    views: safeParseInt(row.metricValues[0].value),
    avgDuration: Math.round(safeParseFloat(row.metricValues[1].value)),
    engagementRate: Math.round(safeParseFloat(row.metricValues[2].value) * 100)
  }));
}

async function fetchMuseumPerformance(client, startDateStr, endDateStr) {
  console.log('🏛️ Fetching museum performance...');
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: endDateStr }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
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
    limit: 10
  });

  return (response.rows || []).map(row => ({
    path: row.dimensionValues[0].value,
    title: row.dimensionValues[0].value.split('/').pop() || 'Unknown',
    views: safeParseInt(row.metricValues[0].value),
    avgDuration: Math.round(safeParseFloat(row.metricValues[1].value)),
    engagementRate: Math.round(safeParseFloat(row.metricValues[2].value) * 100)
  }));
}

// 🔧 FIX: Ajouter la fonction fetchRoomPerformance avec todayStr défini
async function fetchRoomPerformance(client, startDateStr, endDateStr) {
  console.log('🏨 Fetching room performance...');
  
  // 🔧 FIX: Définir todayStr ici
  const todayStr = endDateStr; // Utiliser endDateStr comme todayStr
  
  const [response] = await client.runReport({
    property: `properties/${PROPERTY_ID}`,
    dateRanges: [{ startDate: startDateStr, endDate: todayStr }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [
      { name: 'screenPageViews' },
      { name: 'averageSessionDuration' },
      { name: 'bounceRate' }
    ],
    dimensionFilter: {
      filter: {
        fieldName: 'pagePath',
        stringFilter: {
          matchType: 'CONTAINS',
          value: '/rooms/'
        }
      }
    },
    orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }]
  });

  return (response.rows || []).map(row => ({
    path: row.dimensionValues[0].value,
    roomSlug: row.dimensionValues[0].value.split('/').pop() || 'Unknown',
    views: safeParseInt(row.metricValues[0].value),
    avgDuration: Math.round(safeParseFloat(row.metricValues[1].value)),
    bounceRate: Math.round(safeParseFloat(row.metricValues[2].value) * 100)
  }));
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
    const dateRangeType = body.dateRange || 'last7Days';
    const useCache = body.useCache !== false;

    if (useCache && isoCacheValid()) {
      console.log('✅ Returning cached data');
      return {
        statusCode: 200,
        headers: { ...headers, 'X-Cache': 'HIT' },
        body: JSON.stringify(cache)
      };
    }

    console.log('🔄 Fetching fresh data from GA4...');
    
    // ✅ DÉCODER LA CLÉ BASE64
    const credentials = decodeServiceAccountKey(SERVICE_ACCOUNT_KEY);
    const analyticsDataClient = new BetaAnalyticsDataClient({ credentials });

    const { startDate, endDate } = calculateDateRange(dateRangeType);
    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    const previousEndDate = new Date(startDate);
    previousEndDate.setDate(previousEndDate.getDate() - 1);
    const previousStartDate = new Date(previousEndDate);
    previousStartDate.setDate(previousStartDate.getDate() - daysDiff);
    
    const previousStartStr = formatDate(previousStartDate);
    const previousEndStr = formatDate(previousEndDate);

    console.log(`📅 Date range: ${startDateStr} to ${endDateStr}`);
    console.log(`📅 Previous period: ${previousStartStr} to ${previousEndStr}`);

    const [
      overview,
      timeline,
      topPages,
      devices,
      trafficSources,
      conversions,
      geographic,
      blog,
      museum,
      rooms
    ] = await Promise.all([
      fetchOverviewMetrics(analyticsDataClient, startDateStr, endDateStr, previousStartStr, previousEndStr),
      fetchTimelineData(analyticsDataClient, startDateStr, endDateStr),
      fetchTopPages(analyticsDataClient, startDateStr, endDateStr),
      fetchDeviceBreakdown(analyticsDataClient, startDateStr, endDateStr),
      fetchTrafficSources(analyticsDataClient, startDateStr, endDateStr),
      fetchConversionEvents(analyticsDataClient, startDateStr, endDateStr),
      fetchGeographicData(analyticsDataClient, startDateStr, endDateStr),
      fetchBlogPerformance(analyticsDataClient, startDateStr, endDateStr),
      fetchMuseumPerformance(analyticsDataClient, startDateStr, endDateStr),
      fetchRoomPerformance(analyticsDataClient, startDateStr, endDateStr)
    ]);

    const conversionRate = overview.totalVisits > 0 
      ? ((conversions.whatsappClicks / overview.totalVisits) * 100).toFixed(2)
      : 0;

    const analytics = {
      overview: {
        ...overview,
        conversionRate: parseFloat(conversionRate)
      },
      timeline,
      topPages,
      devices,
      trafficSources,
      conversions,
      geographic,
      content: {
        blog,
        museum
      },
      rooms,
      metadata: {
        dateRange: dateRangeType,
        startDate: startDateStr,
        endDate: endDateStr,
        generatedAt: new Date().toISOString()
      }
    };

    cache = analytics;
    cacheTimestamp = Date.now();

    console.log('✅ Analytics data fetched successfully');

    return {
      statusCode: 200,
      headers: { ...headers, 'X-Cache': 'MISS' },
      body: JSON.stringify(analytics)
    };

  } catch (error) {
    console.error('❌ GA4 API Error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch analytics',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
};
