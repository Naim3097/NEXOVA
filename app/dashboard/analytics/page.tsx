'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Eye,
  ShoppingCart,
  Calendar,
  RefreshCw,
  ArrowLeft,
  ExternalLink,
  AlertCircle,
} from 'lucide-react';

interface GA4Stats {
  overview: {
    totalUsers: number;
    totalSessions: number;
    totalPageViews: number;
    avgBounceRate: number;
    conversions: number;
  };
  dailyStats: Array<{
    date: string;
    users: number;
    sessions: number;
    pageViews: number;
    bounceRate: number;
  }>;
  trafficSources: Array<{
    source: string;
    users: number;
    sessions: number;
  }>;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsOverviewPage() {
  const router = useRouter();
  const [stats, setStats] = useState<GA4Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('7d');
  const [ga4Connected, setGa4Connected] = useState<boolean | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/analytics/ga4?dateRange=${dateRange}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const ga4Data = await response.json();
      setStats(ga4Data.data);
      setGa4Connected(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);

      // Check if GA4 is not connected
      if (errorMessage.includes('not connected')) {
        setGa4Connected(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [dateRange]);

  // Not connected state
  if (ga4Connected === false) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard')}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <Card className="p-12 text-center max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Connect Google Analytics First
            </h2>
            <p className="text-gray-600 mb-8">
              To view analytics data, you need to connect your Google Analytics 4 property.
              This will allow you to track traffic, conversions, and user behavior across all your sales pages.
            </p>
            <Button onClick={() => router.push('/dashboard/integrations')}>
              <ExternalLink className="w-4 h-4 mr-2" />
              Go to Integrations
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Loading state
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && ga4Connected !== false) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <Card className="p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={fetchStats}>Try Again</Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  // Prepare traffic over time data
  const trafficData = stats.dailyStats.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    Users: item.users,
    Sessions: item.sessions,
    'Page Views': item.pageViews,
  }));

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Overview</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={fetchStats}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.overview.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.overview.totalSessions.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.overview.totalPageViews.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Eye className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.overview.conversions.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Bounce Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.overview.avgBounceRate.toFixed(1)}%
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Traffic Over Time Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Traffic Over Time</h2>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Users"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Sessions"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Page Views"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Top Traffic Sources */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Traffic Sources</h2>
          {stats.trafficSources.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats.trafficSources}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="users" fill="#3b82f6" name="Users" />
                <Bar dataKey="sessions" fill="#10b981" name="Sessions" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No traffic sources available</p>
          )}
        </Card>

        {/* Empty State */}
        {stats.overview.totalUsers === 0 && (
          <Card className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
            <p className="text-gray-600 mb-6">
              Publish your pages and share them to start collecting analytics data from Google Analytics.
            </p>
            <Button onClick={() => router.push('/dashboard')}>
              Go to Dashboard
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
