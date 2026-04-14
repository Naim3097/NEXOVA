'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Calendar, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GoogleIntegration {
  is_active: boolean;
  metadata: {
    email?: string;
    name?: string;
    picture?: string;
    connected_at?: string;
  };
  last_used_at?: string;
}

export function GoogleCalendarIntegration() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [integration, setIntegration] = useState<GoogleIntegration | null>(
    null
  );

  const fetchIntegration = async () => {
    try {
      // Check Google Sheets integration since they share the same OAuth connection
      const { data, error } = await supabase
        .from('user_integrations')
        .select('is_active, metadata, last_used_at')
        .eq('integration_type', 'google_sheets')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setIntegration(data);
    } catch (error) {
      console.error('Error fetching integration:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegration();
  }, []);

  // Check for OAuth callback results
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('oauth_success') === 'true') {
      fetchIntegration();
    }
  }, []);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: 'Error',
          description: 'Please log in again',
          variant: 'destructive',
        });
        return;
      }

      // Uses the same OAuth flow as Google Sheets (calendar scope is included)
      window.location.href = `/api/oauth/google/connect`;
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: 'Error',
        description: 'Failed to initiate connection',
        variant: 'destructive',
      });
      setConnecting(false);
    }
  };

  const isConnected = integration?.is_active;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Google Calendar
                {isConnected && (
                  <span className="flex items-center gap-1 text-sm font-normal text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Automatically add booking form submissions to your Google
                Calendar
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : isConnected ? (
          <div className="space-y-4">
            {/* Connected Account Info */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start gap-3">
                {integration.metadata?.picture && (
                  <img
                    src={integration.metadata.picture}
                    alt={integration.metadata.name || 'Google Account'}
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div className="flex-1">
                  <p className="font-medium text-gray-900">
                    {integration.metadata?.name || 'Google Account'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {integration.metadata?.email}
                  </p>
                  {integration.metadata?.connected_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      Connected on{' '}
                      {new Date(
                        integration.metadata.connected_at
                      ).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Add a Booking Form element to your page</li>
                <li>In the properties panel, enable "Google Calendar"</li>
                <li>
                  New bookings will automatically appear in your Google Calendar
                </li>
              </ol>
            </div>

            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                Google Calendar uses the same connection as Google Sheets. To
                disconnect, use the Google Sheets disconnect button above.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Not Connected State */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Automatically create calendar events for new bookings
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>See all your appointments at a glance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Get reminders 30 minutes before each booking</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>
                    Events include customer details, service info, and booking
                    reference
                  </span>
                </li>
              </ul>
            </div>

            {/* Connect Button */}
            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full"
            >
              <Calendar className="w-4 h-4 mr-2" />
              {connecting ? 'Connecting...' : 'Connect Google Calendar'}
            </Button>

            <p className="text-xs text-center text-gray-500">
              This uses the same Google account connection as Google Sheets.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
