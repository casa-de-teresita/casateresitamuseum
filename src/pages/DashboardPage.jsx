import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Eye, Home, BookOpen, Building2, 
  MessageCircle, Filter, RefreshCw, Award, Sparkles, 
  ChevronDown, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// ==========================================
// 🎨 THEME & COLORS
// ==========================================

const COLORS = {
  primary: '#2D5A4A',
  secondary: '#A85C32',
  accent: '#C4A96A',
  success: '#10b981',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899'
};

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.accent,
  COLORS.blue, COLORS.purple, COLORS.pink
];

// ==========================================
// 🔧 UTILITY FUNCTIONS
// ==========================================

function formatNumber(num) {
  if (!num || isNaN(num)) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

// ==========================================
// 📊 KPI CARD - RESPONSIVE
// ==========================================

const KPICard = ({ title, value, trend, icon: Icon, color = 'blue', subtitle, loading = false }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-blue-600',
    green: 'from-green-500 to-green-600',
    purple: 'from-purple-500 to-purple-600',
    orange: 'from-orange-500 to-orange-600'
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-gray-200 rounded-lg"></div>
          <div className="h-6 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-6 md:h-8 w-20 md:w-24 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-24 md:w-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const getTrendColor = () => {
    if (trend > 0) return 'text-green-600 bg-green-100';
    if (trend < 0) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-lg`}>
          <Icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
        </div>
        {trend !== undefined && !isNaN(trend) && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${getTrendColor()}`}>
            {trend > 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            <span>{Math.abs(trend).toFixed(1)}%</span>
          </div>
        )}
      </div>
      
      <h3 className="text-xs md:text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  );
};

// ==========================================
// 👥 USER ANALYTICS - RESPONSIVE
// ==========================================

const UserAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-lg p-4 md:p-6 animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 w-20 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="text-center py-12 text-gray-500">No data available</div>
      </div>
    );
  }

  const devices = data.devices || [];
  const geographic = data.geographic || [];
  const trafficSources = data.trafficSources || [];
  const overview = data.overview || {};

  const totalDeviceSessions = devices.reduce((sum, d) => sum + (d.sessions || 0), 0);
  const deviceData = devices.map(d => ({
    ...d,
    percentage: totalDeviceSessions > 0 ? ((d.sessions / totalDeviceSessions) * 100).toFixed(1) : 0
  }));

  const topCountries = geographic.slice(0, 10);

  const deviceIcons = {
    mobile: '📱',
    desktop: '💻',
    tablet: '📲'
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📱</span>
          Device Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {deviceData.map((device, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{deviceIcons[device.device.toLowerCase()] || '📱'}</span>
                  <span className="font-semibold text-gray-900 capitalize">{device.device}</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{device.percentage}%</span>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Sessions: <span className="font-semibold">{formatNumber(device.sessions)}</span></div>
                <div>Users: <span className="font-semibold">{formatNumber(device.users)}</span></div>
                <div>Bounce: <span className={`font-semibold ${device.bounceRate > 70 ? 'text-red-600' : 'text-green-600'}`}>{device.bounceRate}%</span></div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden flex">
          {deviceData.map((device, index) => (
            <div
              key={index}
              className="h-8 flex items-center justify-center text-white text-xs font-bold transition-all duration-500"
              style={{
                width: `${device.percentage}%`,
                backgroundColor: index === 0 ? COLORS.blue : index === 1 ? COLORS.purple : COLORS.pink
              }}
            >
              {device.percentage > 10 && `${device.percentage}%`}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🌍</span>
            Top Countries
          </h3>

          <div className="space-y-3">
            {topCountries.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-gray-900 truncate">
                      {location.country}
                    </div>
                    {location.city !== '(not set)' && (
                      <div className="text-xs text-gray-500 truncate">{location.city}</div>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-bold text-blue-600">{formatNumber(location.users)}</div>
                  <div className="text-xs text-gray-500">{formatNumber(location.sessions)} sessions</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            Traffic Sources
          </h3>

          <div className="space-y-3">
            {trafficSources.slice(0, 8).map((source, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-semibold text-gray-900 truncate">
                    {source.source}
                  </div>
                  <div className="text-xs text-gray-500">
                    {source.medium}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="text-sm font-bold text-purple-600">{formatNumber(source.sessions)}</div>
                  <div className="text-xs text-gray-500">{formatNumber(source.users)} users</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Avg Session</div>
          <div className="text-2xl font-bold">{Math.round(overview.avgSessionDuration || 0)}s</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Bounce Rate</div>
          <div className="text-2xl font-bold">{Math.round(overview.bounceRate || 0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">Engagement</div>
          <div className="text-2xl font-bold">{Math.round(overview.engagementRate || 0)}%</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90 mb-1">New Users</div>
          <div className="text-2xl font-bold">{formatNumber(overview.newUsers || 0)}</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🏨 ROOM PERFORMANCE - RESPONSIVE
// ==========================================

const RoomPerformance = ({ data, loading }) => {
  const [sortBy, setSortBy] = useState('views');
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const rooms = data?.rooms || [];
  
  const enrichedRooms = rooms.map(room => {
    const views = room.views || 0;
    const avgDuration = room.avgDuration || 0;
    const bounceRate = room.bounceRate || 0;
    const whatsappClicks = 0;
    const conversionRate = views > 0 ? (whatsappClicks / views) * 100 : 0;
    const avgTimeMinutes = Math.round(avgDuration / 60);
    
    return {
      ...room,
      conversionRate: isNaN(conversionRate) ? 0 : conversionRate,
      avgTimeMinutes: isNaN(avgTimeMinutes) ? 0 : avgTimeMinutes,
      whatsappClicks
    };
  });

  const sortedRooms = [...enrichedRooms].sort((a, b) => {
    switch(sortBy) {
      case 'views': return b.views - a.views;
      case 'conversion': return b.conversionRate - a.conversionRate;
      default: return 0;
    }
  });

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
          <Home className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
          Room Performance
        </h3>
        
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm w-full sm:w-auto"
        >
          <option value="views">Sort by Views</option>
          <option value="conversion">Sort by Conversion</option>
        </select>
      </div>

      <div className="overflow-x-auto -mx-4 md:mx-0">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase">Room</th>
                <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase">Views</th>
                <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Time</th>
                <th className="text-center py-3 px-2 md:px-4 text-xs font-semibold text-gray-600 uppercase">Bounce</th>
              </tr>
            </thead>
            <tbody>
              {sortedRooms.map((room, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-2 md:px-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-8 rounded ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-amber-600' : 'bg-gray-300'}`}></div>
                      <span className="text-xs md:text-sm font-medium text-gray-900 truncate max-w-[120px] md:max-w-none">{room.roomSlug || room.path}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center">
                    <span className="text-xs md:text-sm font-bold text-blue-600">{formatNumber(room.views)}</span>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center hidden sm:table-cell">
                    <span className="text-xs md:text-sm text-gray-700">{room.avgTimeMinutes}m</span>
                  </td>
                  <td className="py-3 px-2 md:px-4 text-center">
                    <span className={`text-xs md:text-sm font-medium ${
                      room.bounceRate > 70 ? 'text-red-600' : 
                      room.bounceRate > 50 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {room.bounceRate.toFixed(0)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 pt-6 border-t">
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-gray-900">
            {formatNumber(enrichedRooms.reduce((sum, r) => sum + r.views, 0))}
          </div>
          <div className="text-xs text-gray-600">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-xl md:text-2xl font-bold text-purple-600">
            {enrichedRooms.length}
          </div>
          <div className="text-xs text-gray-600">Rooms Tracked</div>
        </div>
        <div className="text-center col-span-2 md:col-span-1">
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {(enrichedRooms.reduce((sum, r) => sum + (r.bounceRate || 0), 0) / enrichedRooms.length).toFixed(1)}%
          </div>
          <div className="text-xs text-gray-600">Avg Bounce</div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 📰 CONTENT PERFORMANCE - RESPONSIVE
// ==========================================

const ContentPerformance = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="h-64 md:h-96 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || (!data.blog && !data.museum)) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
        <div className="text-center py-12 text-gray-500">
          No content data available
        </div>
      </div>
    );
  }

  const blogData = data.blog || {};
  const museumData = data.museum || {};

  return (
    <div className="space-y-6">
      {/* Blog Section */}
      {blogData.posts && blogData.posts.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              Blog Performance
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-blue-600">
                {formatNumber(blogData.overview?.totalViews)}
              </div>
              <div className="text-xs text-gray-600">Total Views</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-purple-600">
                {formatNumber(blogData.overview?.totalReaders)}
              </div>
              <div className="text-xs text-gray-600">Readers</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-green-600">
                {blogData.overview?.avgEngagement || 0}%
              </div>
              <div className="text-xs text-gray-600">Engagement</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-orange-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-orange-600">
                {blogData.overview?.totalArticles || 0}
              </div>
              <div className="text-xs text-gray-600">Articles</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm md:text-base text-gray-900">Top Posts</h4>
            {blogData.topPerformers?.slice(0, 5).map((post, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{post.title}</div>
                    <div className="text-xs text-gray-500">{formatNumber(post.views)} views</div>
                  </div>
                </div>
                <span className="text-xs md:text-sm text-green-600 font-semibold flex-shrink-0">{post.engagementRate}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Museum Section */}
      {museumData.artworks && museumData.artworks.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              Museum Performance
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
            <div className="text-center p-3 md:p-4 bg-purple-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-purple-600">
                {formatNumber(museumData.overview?.totalViews)}
              </div>
              <div className="text-xs text-gray-600">Total Views</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-blue-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-blue-600">
                {formatNumber(museumData.overview?.totalVisitors)}
              </div>
              <div className="text-xs text-gray-600">Visitors</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-pink-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-pink-600">
                {formatNumber(museumData.overview?.mediaInteractions)}
              </div>
              <div className="text-xs text-gray-600">Media</div>
            </div>
            <div className="text-center p-3 md:p-4 bg-green-50 rounded-lg">
              <div className="text-xl md:text-2xl font-bold text-green-600">
                {museumData.overview?.avgEngagement || 0}%
              </div>
              <div className="text-xs text-gray-600">Engagement</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-sm md:text-base text-gray-900">Most Viewed Artworks</h4>
            {museumData.topArtworks?.slice(0, 5).map((artwork, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg gap-2">
                <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
                  <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs md:text-sm font-medium text-gray-900 truncate">{artwork.title}</div>
                    <div className="text-xs text-gray-500">{formatNumber(artwork.views)} views</div>
                  </div>
                </div>
                <span className="text-xs md:text-sm text-green-600 font-semibold flex-shrink-0">{artwork.engagementRate}%</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 📈 MAIN DASHBOARD - RESPONSIVE
// ==========================================

const CompleteDashboard = () => {
  const [data, setData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last7Days');
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    fetchData();
    if (activeTab === 'content') {
      fetchContentData();
    }
  }, [dateRange, activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchGA4AnalyticsEnhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, useCache: false })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📊 Analytics data received:', result);
        setData(result);
      } else {
        console.error('Failed to fetch analytics:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentData = async () => {
    setContentLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchContentPerformance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange, useCache: false })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('📰 Content data received:', result);
        setContentData(result);
      } else {
        console.error('Failed to fetch content data:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching content data:', error);
    } finally {
      setContentLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
    if (activeTab === 'content') fetchContentData();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-24 pb-8 px-3 sm:px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header - RESPONSIVE */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600 mt-1 md:mt-2">La Casa de Teresita</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-xs md:text-sm font-medium w-full sm:w-auto"
            >
              <option value="last7Days">Last 7 Days</option>
              <option value="last30Days">Last 30 Days</option>
              <option value="last90Days">Last 90 Days</option>
            </select>
            
            <button
              onClick={handleRefresh}
              className="flex items-center justify-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs md:text-sm font-medium w-full sm:w-auto"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* KPIs - RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <KPICard
            title="Total Visits"
            value={formatNumber(data?.overview?.totalVisits)}
            trend={data?.overview?.trends?.totalVisits}
            icon={Users}
            color="blue"
            loading={loading}
          />
          <KPICard
            title="Room Views"
            value={formatNumber(data?.conversions?.roomViews)}
            icon={Home}
            color="purple"
            loading={loading}
          />
          <KPICard
            title="WhatsApp Clicks"
            value={formatNumber(data?.conversions?.whatsappClicks)}
            icon={MessageCircle}
            color="green"
            subtitle="From all sources"
            loading={loading}
          />
          <KPICard
            title="Conversion Rate"
            value={`${data?.overview?.conversionRate || 0}%`}
            icon={TrendingUp}
            color="orange"
            subtitle="To WhatsApp"
            loading={loading}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          {['users', 'rooms', 'content'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 md:px-6 py-3 font-semibold capitalize transition-colors border-b-2 text-xs md:text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content based on active tab */}
        {activeTab === 'users' && (
          <UserAnalytics data={data} loading={loading} />
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6">
            <RoomPerformance data={data} loading={loading} />
          </div>
        )}

        {activeTab === 'content' && (
          <ContentPerformance data={contentData} loading={contentLoading} />
        )}
      </div>
    </div>
  );
};

export default CompleteDashboard;