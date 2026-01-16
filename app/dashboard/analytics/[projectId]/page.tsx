'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
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
  MousePointer,
  FileText,
  Download,
  RefreshCw,
  ArrowLeft,
  Calendar,
} from 'lucide-react';

interface AnalyticsStats {
  pageViews: number;
  uniqueVisitors: number;
  formSubmissions: number;
  buttonClicks: number;
  conversionRate: number;
  trafficOverTime: Array<{ date: string; page_views: number; unique_visitors: number }>;
  deviceBreakdown: Record<string, number>;
  topSources: Array<{ source: string; count: number }>;
  dateRange: {
    start: string;
    end: string;
    days: number;
  };
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AnalyticsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState('30');
  const [exporting, setExporting] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from GA4 API with date range mapping
      const dateRangeParam = dateRange === '7' ? '7d' : dateRange === '30' ? '30d' : '90d';
      const response = await fetch(`/api/analytics/ga4?projectId=${projectId}&dateRange=${dateRangeParam}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch analytics');
      }

      const ga4Data = await response.json();

      // Transform GA4 data to match existing interface
      const transformedStats: AnalyticsStats = {
        pageViews: ga4Data.data.overview.totalPageViews,
        uniqueVisitors: ga4Data.data.overview.totalUsers,
        formSubmissions: ga4Data.data.overview.conversions || 0,
        buttonClicks: 0, // Not tracked in GA4 by default
        conversionRate: ga4Data.data.overview.totalUsers > 0
          ? ((ga4Data.data.overview.conversions || 0) / ga4Data.data.overview.totalUsers) * 100
          : 0,
        trafficOverTime: ga4Data.data.dailyStats.map((day: any) => ({
          date: day.date,
          page_views: day.pageViews,
          unique_visitors: day.users,
        })),
        deviceBreakdown: {}, // GA4 doesn't return device data in our current setup
        topSources: ga4Data.data.trafficSources.map((source: any) => ({
          source: source.source,
          count: source.sessions,
        })),
        dateRange: {
          start: new Date(Date.now() - parseInt(dateRange) * 24 * 60 * 60 * 1000).toISOString(),
          end: new Date().toISOString(),
          days: parseInt(dateRange),
        },
      };

      setStats(transformedStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [projectId, dateRange]);

  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await fetch(`/api/analytics/export?projectId=${projectId}&days=${dateRange}`);

      if (!response.ok) {
        throw new Error('Failed to export analytics');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export analytics data');
    } finally {
      setExporting(false);
    }
  };

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

  if (error) {
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

  // Prepare device breakdown data for pie chart
  const deviceData = Object.entries(stats.deviceBreakdown || {}).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
  }));

  // Prepare traffic over time data for line chart
  const trafficData = stats.trafficOverTime.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    'Page Views': item.page_views,
    'Unique Visitors': item.unique_visitors,
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
            <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
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

            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="w-4 h-4 mr-2" />
              {exporting ? 'Exporting...' : 'Export CSV'}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Page Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.pageViews.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unique Visitors</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.uniqueVisitors.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Button Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.buttonClicks.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Form Submissions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.formSubmissions.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.conversionRate}% conversion rate
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Traffic Over Time Chart */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Traffic Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="Page Views"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="Unique Visitors"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Device & Traffic Sources */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Device Breakdown */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Device Breakdown</h2>
            {deviceData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {deviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {deviceData.map((device, index) => (
                    <div key={device.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span className="text-gray-700">{device.name}</span>
                      </div>
                      <span className="font-medium text-gray-900">{device.value}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-8">No device data available</p>
            )}
          </Card>

          {/* Top Traffic Sources */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Top Traffic Sources</h2>
            {stats.topSources.length > 0 ? (
              <div className="space-y-4">
                {stats.topSources.map((source, index) => (
                  <div key={source.source} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 font-medium">{source.source}</span>
                      <span className="text-gray-900 font-semibold">{source.count} visits</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${(source.count / stats.topSources[0].count) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No traffic sources available</p>
            )}
          </Card>
        </div>

        {/* Empty State */}
        {stats.pageViews === 0 && (
          <Card className="p-12 text-center">
            <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data Yet</h3>
            <p className="text-gray-600 mb-6">
              Publish your page and share it to start collecting analytics data.
            </p>
            <Button onClick={() => router.push(`/projects/${projectId}/edit`)}>
              Go to Editor
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}
