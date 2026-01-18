'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';
import { BarChart3, Save, Eye, EyeOff, Info, CheckCircle, ExternalLink, Loader2, Unlink } from 'lucide-react';

interface TrackingPixelsConfig {
  facebook: {
    enabled: boolean;
    pixelId: string | null;
    enableConversionsAPI: boolean;
  };
  tiktok: {
    enabled: boolean;
    pixelId: string | null;
    enableEventsAPI: boolean;
  };
  google_ads: {
    enabled: boolean;
    tagId: string | null;
    conversionLabel: string | null;
  };
  google_analytics: {
    enabled: boolean;
    measurementId: string | null;
  };
}

const defaultConfig: TrackingPixelsConfig = {
  facebook: {
    enabled: false,
    pixelId: null,
    enableConversionsAPI: false,
  },
  tiktok: {
    enabled: false,
    pixelId: null,
    enableEventsAPI: false,
  },
  google_ads: {
    enabled: false,
    tagId: null,
    conversionLabel: null,
  },
  google_analytics: {
    enabled: false,
    measurementId: null,
  },
};

// Inner component that uses useSearchParams
function TrackingPixelsContent() {
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<TrackingPixelsConfig>(defaultConfig);
  const [showFacebookPixel, setShowFacebookPixel] = useState(false);
  const [showTikTokPixel, setShowTikTokPixel] = useState(false);
  const [ga4Connected, setGa4Connected] = useState(false);
  const [ga4Connecting, setGa4Connecting] = useState(false);
  const [ga4PropertyId, setGa4PropertyId] = useState<string | null>(null);

  useEffect(() => {
    loadConfig();
    loadGa4Status();
  }, []);

  useEffect(() => {
    // Check for OAuth callback success/error
    const ga4ConnectedParam = searchParams.get('ga4_connected');
    const errorParam = searchParams.get('error');

    if (ga4ConnectedParam === 'true') {
      toast({
        title: 'Success',
        description: 'Google Analytics connected successfully!',
      });
      setGa4Connected(true);
      loadGa4Status();
    } else if (errorParam) {
      toast({
        title: 'Connection Failed',
        description: `Failed to connect Google Analytics: ${errorParam}`,
        variant: 'destructive',
      });
    }
  }, [searchParams, toast]);

  const loadConfig = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('tracking_pixels')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile?.tracking_pixels) {
        setConfig(profile.tracking_pixels as TrackingPixelsConfig);
      }
    } catch (error) {
      console.error('Error loading tracking pixels:', error);
      toast({
        title: 'Error',
        description: 'Failed to load tracking pixels configuration',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadGa4Status = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('ga4_connected, ga4_property_id')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setGa4Connected(profile?.ga4_connected || false);
      setGa4PropertyId(profile?.ga4_property_id || null);
    } catch (error) {
      console.error('Error loading GA4 status:', error);
    }
  };

  const connectGa4 = async () => {
    try {
      setGa4Connecting(true);
      const response = await fetch('/api/integrations/ga4/auth', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to initiate GA4 connection');
      }

      const { authUrl } = await response.json();
      window.location.href = authUrl;
    } catch (error) {
      console.error('Error connecting GA4:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate Google Analytics connection',
        variant: 'destructive',
      });
      setGa4Connecting(false);
    }
  };

  const disconnectGa4 = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({
          ga4_connected: false,
          ga4_property_id: null,
          ga4_access_token: null,
          ga4_refresh_token: null,
          ga4_token_expiry: null,
        })
        .eq('id', user.id);

      if (error) throw error;

      setGa4Connected(false);
      setGa4PropertyId(null);

      toast({
        title: 'Disconnected',
        description: 'Google Analytics has been disconnected',
      });
    } catch (error) {
      console.error('Error disconnecting GA4:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect Google Analytics',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('profiles')
        .update({ tracking_pixels: config })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Tracking pixels saved successfully',
      });
    } catch (error) {
      console.error('Error saving tracking pixels:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tracking pixels',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Tracking Pixels</h2>
            <p className="text-sm text-muted-foreground">
              Configure tracking pixels for ad campaigns and analytics
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save All'}
        </Button>
      </div>

      {/* Info Box */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Default Configuration</p>
          <p className="text-sm opacity-90 mt-1">
            These settings apply to all your sales pages by default. You can override them per project in the project editor.
          </p>
        </div>
      </div>

      {/* Facebook Pixel */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-2xl">
              📘
            </div>
            <div>
              <h3 className="text-lg font-semibold">Facebook Pixel</h3>
              <p className="text-sm text-muted-foreground">Track conversions and optimize Facebook ads</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.facebook.enabled}
              onChange={(e) => setConfig({
                ...config,
                facebook: { ...config.facebook, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-100 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-900"></div>
          </label>
        </div>

        {config.facebook.enabled && (
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="fb-pixel-id">Facebook Pixel ID *</Label>
              <div className="relative mt-1">
                <Input
                  id="fb-pixel-id"
                  type={showFacebookPixel ? 'text' : 'password'}
                  value={config.facebook.pixelId || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    facebook: { ...config.facebook, pixelId: e.target.value }
                  })}
                  placeholder="123456789012345"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowFacebookPixel(!showFacebookPixel)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showFacebookPixel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">15-16 digit number from your Facebook Business Manager</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.facebook.enableConversionsAPI}
                  onChange={(e) => setConfig({
                    ...config,
                    facebook: { ...config.facebook, enableConversionsAPI: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium">Enable Facebook Conversions API</span>
                  <p className="text-xs text-gray-500">Server-side tracking for better data accuracy</p>
                </div>
              </label>
            </div>
          </CardContent>
        )}
      </Card>

      {/* TikTok Pixel */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-black flex items-center justify-center text-2xl">
              🎵
            </div>
            <div>
              <h3 className="text-lg font-semibold">TikTok Pixel</h3>
              <p className="text-sm text-muted-foreground">Track TikTok ad campaigns and conversions</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.tiktok.enabled}
              onChange={(e) => setConfig({
                ...config,
                tiktok: { ...config.tiktok, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-gray-100 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-900"></div>
          </label>
        </div>

        {config.tiktok.enabled && (
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="tiktok-pixel-id">TikTok Pixel ID *</Label>
              <div className="relative mt-1">
                <Input
                  id="tiktok-pixel-id"
                  type={showTikTokPixel ? 'text' : 'password'}
                  value={config.tiktok.pixelId || ''}
                  onChange={(e) => setConfig({
                    ...config,
                    tiktok: { ...config.tiktok, pixelId: e.target.value }
                  })}
                  placeholder="C4XXXXXXXXXXXXXXXXXXX"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowTikTokPixel(!showTikTokPixel)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showTikTokPixel ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">Found in TikTok Events Manager</p>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.tiktok.enableEventsAPI}
                  onChange={(e) => setConfig({
                    ...config,
                    tiktok: { ...config.tiktok, enableEventsAPI: e.target.checked }
                  })}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium">Enable TikTok Events API</span>
                  <p className="text-xs text-gray-500">Server-side tracking for better data accuracy</p>
                </div>
              </label>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Google Ads */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-yellow-50 flex items-center justify-center text-2xl">
              🎯
            </div>
            <div>
              <h3 className="text-lg font-semibold">Google Ads</h3>
              <p className="text-sm text-muted-foreground">Track Google Ads conversion tracking</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.google_ads.enabled}
              onChange={(e) => setConfig({
                ...config,
                google_ads: { ...config.google_ads, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-100 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-900"></div>
          </label>
        </div>

        {config.google_ads.enabled && (
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="google-tag-id">Google Tag ID *</Label>
              <Input
                id="google-tag-id"
                type="text"
                value={config.google_ads.tagId || ''}
                onChange={(e) => setConfig({
                  ...config,
                  google_ads: { ...config.google_ads, tagId: e.target.value }
                })}
                placeholder="G-XXXXXXXXXX or AW-XXXXXXXXXX"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                G- for Analytics, AW- for Ads
              </p>
            </div>

            <div>
              <Label htmlFor="conversion-label">Conversion Label</Label>
              <Input
                id="conversion-label"
                type="text"
                value={config.google_ads.conversionLabel || ''}
                onChange={(e) => setConfig({
                  ...config,
                  google_ads: { ...config.google_ads, conversionLabel: e.target.value }
                })}
                placeholder="AW-XXXXXXXXXX/XXXXXXXXXXXXXXXX"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Extract from your conversion event snippet
              </p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Google Analytics 4 */}
      <Card>
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-green-50 flex items-center justify-center text-2xl">
              📊
            </div>
            <div>
              <h3 className="text-lg font-semibold">Google Analytics 4</h3>
              <p className="text-sm text-muted-foreground">Track website analytics and user behavior</p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.google_analytics.enabled}
              onChange={(e) => setConfig({
                ...config,
                google_analytics: { ...config.google_analytics, enabled: e.target.checked }
              })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-100 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-900"></div>
          </label>
        </div>

        {config.google_analytics.enabled && (
          <CardContent className="p-6 space-y-6">
            {/* Tracking Pixel Section */}
            <div>
              <Label htmlFor="ga4-measurement-id">Measurement ID *</Label>
              <Input
                id="ga4-measurement-id"
                type="text"
                value={config.google_analytics.measurementId || ''}
                onChange={(e) => setConfig({
                  ...config,
                  google_analytics: { ...config.google_analytics, measurementId: e.target.value }
                })}
                placeholder="G-XXXXXXXXXX"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Found in Google Analytics 4 property settings. This embeds tracking on your published pages.
              </p>
            </div>

            {/* Divider */}
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Analytics Dashboard Connection</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    Connect your Google account to view analytics data directly in your dashboard.
                  </p>
                </div>
                {ga4Connected ? (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Connected</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={disconnectGa4}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Unlink className="w-4 h-4 mr-1" />
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <Button
                    onClick={connectGa4}
                    disabled={ga4Connecting}
                    className="bg-[#4285F4] hover:bg-[#3367D6] text-white"
                  >
                    {ga4Connecting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Connect Google Account
                      </>
                    )}
                  </Button>
                )}
              </div>

              {ga4Connected && ga4PropertyId && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    <span className="font-medium">Property ID:</span> {ga4PropertyId}
                  </p>
                </div>
              )}

              {!ga4Connected && (
                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Connecting allows you to view traffic, conversions, and user behavior in the Analytics dashboard without leaving this app.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}

// Loading fallback component
function TrackingPixelsLoading() {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </CardContent>
    </Card>
  );
}

// Main exported component wrapped in Suspense
export function TrackingPixelsIntegration() {
  return (
    <Suspense fallback={<TrackingPixelsLoading />}>
      <TrackingPixelsContent />
    </Suspense>
  );
}
