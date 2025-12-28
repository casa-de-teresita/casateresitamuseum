import React, { useState, useEffect } from 'react';
import {
  BookOpen, Building2, TrendingUp, Users, Eye, Clock,
  Award, BarChart3, ArrowUpRight, ExternalLink, Music,
  Film, Globe, Calendar, Target, Sparkles
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar
} from 'recharts';

// ==============================================
// 🎨 THEME
// ==============================================

const COLORS = {
  primary: '#2D5A4A',
  secondary: '#A85C32',
  accent: '#C4A96A',
  blue: '#3b82f6',
  purple: '#8b5cf6',
  pink: '#ec4899',
  green: '#10b981',
  orange: '#f59e0b'
};

const CHART_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.accent,
  COLORS.blue, COLORS.purple, COLORS.pink
];

// ==============================================
// 🔧 UTILITIES
// ==============================================

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num?.toLocaleString() || '0';
}

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

// ==============================================
// 📊 OVERVIEW STATS CARD
// ==============================================

const OverviewCard = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
            <TrendingUp className="h-4 w-4" />
            {trend}%
          </div>
        )}
      </div>
      <h4 className="text-sm font-medium text-gray-600 mb-1">{title}</h4>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );
};

// ==============================================
// 📝 BLOG ANALYTICS
// ==============================================

const BlogAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topPosts = data?.topPerformers || [];
  const categories = data?.categories || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <OverviewCard
          title="Total Blog Views"
          value={formatNumber(data?.overview?.totalViews)}
          subtitle="All articles"
          icon={Eye}
          color="from-blue-500 to-blue-600"
        />
        <OverviewCard
          title="Unique Readers"
          value={formatNumber(data?.overview?.totalReaders)}
          subtitle="Individual visitors"
          icon={Users}
          color="from-purple-500 to-purple-600"
        />
        <OverviewCard
          title="Avg Engagement"
          value={`${data?.overview?.avgEngagement}%`}
          subtitle="Engagement rate"
          icon={Target}
          color="from-green-500 to-green-600"
        />
        <OverviewCard
          title="Total Articles"
          value={data?.overview?.totalArticles}
          subtitle={`EN: ${data?.languageBreakdown?.en} / ES: ${data?.languageBreakdown?.es}`}
          icon={BookOpen}
          color="from-orange-500 to-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Posts */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Award className="h-6 w-6 text-yellow-500" />
              Top Performing Articles
            </h3>
          </div>

          <div className="space-y-4">
            {topPosts.map((post, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-blue-600 font-semibold">
                      <Eye className="h-4 w-4" />
                      {formatNumber(post.views)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {formatDuration(post.avgReadTime)}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Target className="h-4 w-4" />
                      {post.engagementRate}%
                    </span>
                  </div>
                </div>

                <a
                  href={post.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-purple-600" />
            Performance by Category
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="slug" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="views" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Posts Table */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          All Blog Posts Performance
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Article
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Lang
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Views
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Readers
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Read Time
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Engagement
                </th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">
                  Bounce
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.posts?.map((post, index) => (
                <tr 
                  key={index}
                  className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {post.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      post.language === 'en' 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      {post.language.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-bold text-blue-600">
                      {formatNumber(post.views)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700">
                    {formatNumber(post.uniqueReaders)}
                  </td>
                  <td className="py-3 px-4 text-center text-sm text-gray-700">
                    {formatDuration(post.avgReadTime)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-sm font-medium ${
                      post.engagementRate > 70 ? 'text-green-600' :
                      post.engagementRate > 50 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {post.engagementRate}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-sm ${
                      post.bounceRate < 50 ? 'text-green-600' :
                      post.bounceRate < 70 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {post.bounceRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==============================================
// 🏛️ MUSEUM ANALYTICS
// ==============================================

const MuseumAnalytics = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const topArtworks = data?.topArtworks || [];
  const categories = data?.categories || [];

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <OverviewCard
          title="Museum Views"
          value={formatNumber(data?.overview?.totalViews)}
          subtitle="Total artwork views"
          icon={Eye}
          color="from-purple-500 to-purple-600"
        />
        <OverviewCard
          title="Unique Visitors"
          value={formatNumber(data?.overview?.totalVisitors)}
          subtitle="Individual visitors"
          icon={Users}
          color="from-blue-500 to-blue-600"
        />
        <OverviewCard
          title="Media Interactions"
          value={formatNumber(data?.overview?.mediaInteractions)}
          subtitle="YouTube + Spotify"
          icon={Music}
          color="from-pink-500 to-pink-600"
        />
        <OverviewCard
          title="Avg Engagement"
          value={`${data?.overview?.avgEngagement}%`}
          subtitle="Overall engagement"
          icon={Target}
          color="from-green-500 to-green-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Artworks */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-500" />
              Most Viewed Artworks
            </h3>
          </div>

          <div className="space-y-4">
            {topArtworks.map((artwork, index) => (
              <div 
                key={index}
                className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {artwork.title}
                  </h4>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-purple-600 font-semibold">
                      <Eye className="h-4 w-4" />
                      {formatNumber(artwork.views)}
                    </span>
                    <span className="flex items-center gap-1 text-gray-600">
                      <Clock className="h-4 w-4" />
                      {formatDuration(artwork.avgViewTime)}
                    </span>
                    <span className="flex items-center gap-1 text-green-600">
                      <Target className="h-4 w-4" />
                      {artwork.engagementRate}%
                    </span>
                  </div>
                </div>

                <a
                  href={artwork.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-purple-600 transition-colors"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PieChart className="h-6 w-6 text-blue-600" />
            Category Distribution
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categories}
                dataKey="views"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Media Interactions */}
      {data?.mediaInteractions && (
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Film className="h-6 w-6" />
            Media Engagement
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm opacity-90">Total Interactions</p>
              <p className="text-3xl font-bold">{formatNumber(data.mediaInteractions.total)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Unique Users</p>
              <p className="text-3xl font-bold">{formatNumber(data.mediaInteractions.uniqueUsers)}</p>
            </div>
            <div>
              <p className="text-sm opacity-90">Avg per User</p>
              <p className="text-3xl font-bold">{data.mediaInteractions.avgPerUser}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==============================================
// 🏨 MAIN CONTENT PERFORMANCE COMPONENT
// ==============================================

const ContentPerformance = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blog');
  const [dateRange, setDateRange] = useState('last30Days');

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/fetchContentPerformance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateRange })
      });

      if (response.ok) {
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error('Error fetching content performance:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Content Performance
            </h1>
            <p className="text-gray-600 mt-2">
              Analyze blog and museum engagement
            </p>
          </div>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium"
          >
            <option value="last7Days">Last 7 Days</option>
            <option value="last30Days">Last 30 Days</option>
            <option value="last90Days">Last 90 Days</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('blog')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'blog'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            Blog Analytics
          </button>
          <button
            onClick={() => setActiveTab('museum')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold transition-colors border-b-2 ${
              activeTab === 'museum'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            <Building2 className="h-5 w-5" />
            Museum Analytics
          </button>
        </div>

        {/* Content */}
        {activeTab === 'blog' && (
          <BlogAnalytics data={data?.blog} loading={loading} />
        )}
        {activeTab === 'museum' && (
          <MuseumAnalytics data={data?.museum} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default ContentPerformance;