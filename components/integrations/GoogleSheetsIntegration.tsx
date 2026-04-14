'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, ExternalLink, FileSpreadsheet, AlertCircle } from 'lucide-react';
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

export function GoogleSheetsIntegration() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [integration, setIntegration] = useState<GoogleIntegration | null>(null);
  const [oauthError, setOauthError] = useState<string | null>(null);
  const [oauthSuccess, setOauthSuccess] = useState(false);

  // Check for OAuth callback results in URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get('oauth_error');
    const success = params.get('oauth_success');

    if (error) {
      setOauthError(error);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (success === 'true') {
      setOauthSuccess(true);
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname);
      // Reload integration status
      fetchIntegration();
    }
  }, []);

  const fetchIntegration = async () => {
    try {
      const { data, error } = await supabase
        .from('user_integrations')
        .select('is_active, metadata, last_used_at')
        .eq('integration_type', 'google_sheets')
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
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

  const handleConnect = async () => {
    setConnecting(true);
    try {
      // Get current session token
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        toast({
          title: 'Error',
          description: 'Please log in again',
          variant: 'destructive',
        });
        return;
      }

      // Redirect to OAuth flow with auth token in header
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

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect Google Sheets? Your lead forms will no longer sync to Google Sheets.')) {
      return;
    }

    setDisconnecting(true);
    try {
      const response = await fetch('/api/oauth/google/disconnect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to disconnect');
      }

      setIntegration(null);
      toast({
        title: 'Disconnected',
        description: 'Google Sheets integration has been disconnected',
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      toast({
        title: 'Error',
        description: 'Failed to disconnect',
        variant: 'destructive',
      });
    } finally {
      setDisconnecting(false);
    }
  };

  const isConnected = integration?.is_active;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileSpreadsheet className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="flex items-center gap-2">
                Google Sheets
                {isConnected && (
                  <span className="flex items-center gap-1 text-sm font-normal text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Connected
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                Automatically sync lead form submissions to your Google Sheets
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth Success Message */}
        {oauthSuccess && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Successfully connected to Google Sheets! You can now enable Google Sheets in your lead form elements.
            </AlertDescription>
          </Alert>
        )}

        {/* OAuth Error Message */}
        {oauthError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to connect: {oauthError}. Please try again.
            </AlertDescription>
          </Alert>
        )}

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
                      Connected on {new Date(integration.metadata.connected_at).toLocaleDateString()}
                    </p>
                  )}
                  {integration.last_used_at && (
                    <p className="text-xs text-gray-500">
                      Last used: {new Date(integration.last_used_at).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">How to use:</h4>
              <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                <li>Add a Lead Form element to your page</li>
                <li>In the properties panel, enable "Google Sheets Integration"</li>
                <li>Enter your Google Sheet URL or ID</li>
                <li>Lead submissions will automatically sync to your sheet</li>
              </ol>
            </div>

            {/* Disconnect Button */}
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-600">
                Need to connect a different Google account?
              </p>
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={disconnecting}
              >
                {disconnecting ? 'Disconnecting...' : 'Disconnect'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Not Connected State */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Benefits:</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Automatically sync lead form submissions to your Google Sheets</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Keep all your data in one place for easy analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>No need to share sheets with service accounts</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Full control over your data with your own Google account</span>
                </li>
              </ul>
            </div>

            {/* Connect Button */}
            <Button
              onClick={handleConnect}
              disabled={connecting}
              className="w-full"
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              {connecting ? 'Connecting...' : 'Connect Google Sheets'}
            </Button>

            {/* Documentation Link */}
            <p className="text-xs text-center text-gray-500">
              <a
                href="https://support.google.com/docs/answer/6000292"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                Learn more about Google Sheets
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
