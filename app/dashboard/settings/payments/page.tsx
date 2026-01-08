'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';

export default function PaymentSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);

  const [formData, setFormData] = useState({
    leanx_api_key: '',
    leanx_secret_key: '',
    leanx_merchant_id: '',
    leanx_enabled: false,
  });

  // Fetch current settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('leanx_api_key, leanx_secret_key, leanx_merchant_id, leanx_enabled')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFormData({
            leanx_api_key: profile.leanx_api_key || '',
            leanx_secret_key: profile.leanx_secret_key || '',
            leanx_merchant_id: profile.leanx_merchant_id || '',
            leanx_enabled: profile.leanx_enabled || false,
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load payment settings',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [supabase, router, toast]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push('/login');
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          leanx_api_key: formData.leanx_api_key || null,
          leanx_secret_key: formData.leanx_secret_key || null,
          leanx_merchant_id: formData.leanx_merchant_id || null,
          leanx_enabled: formData.leanx_enabled,
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Payment settings saved successfully',
      });

    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save payment settings',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold">Payment Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure your LeanX payment gateway integration
        </p>
      </div>

      {/* Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Status
            {formData.leanx_enabled ? (
              <span className="flex items-center text-green-600 text-sm font-normal">
                <CheckCircle className="w-4 h-4 mr-1" />
                Active
              </span>
            ) : (
              <span className="flex items-center text-gray-500 text-sm font-normal">
                <XCircle className="w-4 h-4 mr-1" />
                Inactive
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="leanx_enabled"
              checked={formData.leanx_enabled}
              onChange={(e) => setFormData({ ...formData, leanx_enabled: e.target.checked })}
              className="w-4 h-4"
            />
            <Label htmlFor="leanx_enabled" className="cursor-pointer">
              Enable LeanX payment gateway
            </Label>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            When enabled, payment buttons on your published pages will process payments through LeanX.
          </p>
        </CardContent>
      </Card>

      {/* API Credentials Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>LeanX API Credentials</CardTitle>
          <CardDescription>
            Enter your LeanX API credentials. You can find these in your LeanX merchant dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Merchant ID */}
          <div>
            <Label htmlFor="merchant_id">Merchant ID</Label>
            <Input
              id="merchant_id"
              type="text"
              value={formData.leanx_merchant_id}
              onChange={(e) => setFormData({ ...formData, leanx_merchant_id: e.target.value })}
              placeholder="Enter your LeanX merchant ID"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Your unique merchant identifier from LeanX
            </p>
          </div>

          {/* API Key */}
          <div>
            <Label htmlFor="api_key">API Key</Label>
            <div className="relative mt-1">
              <Input
                id="api_key"
                type={showApiKey ? 'text' : 'password'}
                value={formData.leanx_api_key}
                onChange={(e) => setFormData({ ...formData, leanx_api_key: e.target.value })}
                placeholder="Enter your LeanX API key"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your public API key for creating payments
            </p>
          </div>

          {/* Secret Key */}
          <div>
            <Label htmlFor="secret_key">Secret Key</Label>
            <div className="relative mt-1">
              <Input
                id="secret_key"
                type={showSecretKey ? 'text' : 'password'}
                value={formData.leanx_secret_key}
                onChange={(e) => setFormData({ ...formData, leanx_secret_key: e.target.value })}
                placeholder="Enter your LeanX secret key"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSecretKey(!showSecretKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Your private secret key for webhook verification (keep this secure!)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Information Card */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">How to get your LeanX credentials:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Log in to your LeanX merchant dashboard</li>
            <li>Navigate to Settings → API Credentials</li>
            <li>Copy your Merchant ID, API Key, and Secret Key</li>
            <li>Paste them here and click Save</li>
          </ol>
          <p className="text-xs text-blue-700 mt-3">
            Don't have a LeanX account? <a href="https://leanx.com" target="_blank" rel="noopener noreferrer" className="underline font-semibold">Sign up here</a>
          </p>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="min-w-[120px]"
        >
          {saving ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
