'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';
import { BarChart3, CheckCircle, XCircle, ExternalLink, Info } from 'lucide-react';

interface GA4Connection {
  connected: boolean;
  propertyId: string | null;
  connectedAt: string | null;
}

export function GoogleAnalyticsIntegration() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [ga4Connection, setGA4Connection] = useState<GA4Connection>({
    connected: false,
    propertyId: null,
    connectedAt: null,
  });

  useEffect(() => {
    loadConnection();
  }, []);

  const loadConnection = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('ga4_connected, ga4_property_id, ga4_connected_at')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      if (profile) {
        setGA4Connection({
          connected: profile.ga4_connected || false,
          propertyId: profile.ga4_property_id,
          connectedAt: profile.ga4_connected_at,
        });
      }
    } catch (error) {
      console.error('Error loading GA4 connection:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);

      // Initiate OAuth flow
      const response = await fetch('/api/integrations/ga4/auth', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok && data.authUrl) {
        // Redirect to Google OAuth
        window.location.href = data.authUrl;
      } else {
        throw new Error(data.error || 'Failed to initiate OAuth');
      }
    } catch (error) {
      console.error('Error connecting GA4:', error);
      toast({
        title: 'Connection Failed',
        description: error instanceof Error ? error.message : 'Failed to connect Google Analytics',
        variant: 'destructive',
      });
    } finally {
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Analytics? Your analytics data will no longer be accessible.')) {
      return;
    }

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
          ga4_connected_at: null,
        })
        .eq('id', user.id);

      if (error) throw error;

      setGA4Connection({
        connected: false,
        propertyId: null,
        connectedAt: null,
      });

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

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <CardTitle>Google Analytics 4</CardTitle>
              <CardDescription>Loading...</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
              <BarChart3 className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <CardTitle>Google Analytics 4</CardTitle>
              <CardDescription>
                Connect your GA4 property to view analytics data in your dashboard
              </CardDescription>
            </div>
          </div>
          {ga4Connection.connected ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-400">
              <XCircle className="w-5 h-5" />
              <span className="text-sm font-medium">Not Connected</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Info Box */}
        <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
          <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold mb-1">Why connect Google Analytics?</p>
            <ul className="space-y-1 opacity-90">
              <li>• View real-time traffic data for your sales pages</li>
              <li>• Track conversion rates and revenue metrics</li>
              <li>• Analyze traffic sources and user behavior</li>
              <li>• Monitor performance across all your projects</li>
            </ul>
          </div>
        </div>

        {ga4Connection.connected ? (
          <div className="space-y-4">
            <div>
              <Label>GA4 Property ID</Label>
              <Input
                value={ga4Connection.propertyId || 'Not set'}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label>Connected On</Label>
              <Input
                value={ga4Connection.connectedAt ? new Date(ga4Connection.connectedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }) : 'Unknown'}
                disabled
                className="mt-1"
              />
            </div>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                variant="outline"
                onClick={handleDisconnect}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Disconnect
              </Button>
              <a
                href="https://analytics.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2"
              >
                <Button variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Google Analytics
                </Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2">Prerequisites:</h4>
              <ol className="space-y-2 text-sm text-gray-700">
                <li>1. You must have a Google Analytics 4 property set up</li>
                <li>2. You must have Admin access to the GA4 property</li>
                <li>3. Your GA4 Measurement ID should be configured in tracking pixels</li>
              </ol>
            </div>

            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full"
            >
              {connecting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Connecting...
                </>
              ) : (
                <>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Connect Google Analytics
                </>
              )}
            </Button>

            <p className="text-xs text-gray-500 text-center">
              By connecting, you'll be redirected to Google to authorize access
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
