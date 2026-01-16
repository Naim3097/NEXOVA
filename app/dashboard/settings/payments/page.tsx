'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Save, Eye, EyeOff, CheckCircle, XCircle, CreditCard, PlayCircle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase/auth-client';
import { TestCheckoutModal } from '@/components/payment/TestCheckoutModal';

export default function PaymentSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showTestCheckout, setShowTestCheckout] = useState(false);

  const [formData, setFormData] = useState({
    leanx_api_key: '',
    leanx_collection_uuid: '',
    leanx_secret_key: '',
    leanx_merchant_id: '',
    leanx_enabled: false,
    leanx_environment: 'live' as 'test' | 'live',
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
          .select('leanx_api_key, leanx_collection_uuid, leanx_secret_key, leanx_merchant_id, leanx_enabled, leanx_environment')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFormData({
            leanx_api_key: profile.leanx_api_key || '',
            leanx_collection_uuid: profile.leanx_collection_uuid || '',
            leanx_secret_key: profile.leanx_secret_key || '',
            leanx_merchant_id: profile.leanx_merchant_id || '',
            leanx_enabled: profile.leanx_enabled || false,
            leanx_environment: (profile.leanx_environment as 'test' | 'live') || 'live',
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
          leanx_collection_uuid: formData.leanx_collection_uuid || null,
          leanx_secret_key: formData.leanx_secret_key || null,
          leanx_merchant_id: formData.leanx_merchant_id || null,
          leanx_enabled: formData.leanx_enabled,
          leanx_environment: formData.leanx_environment,
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

  const handleTestCheckout = () => {
    // Validate that we have the required credentials
    if (!formData.leanx_enabled || !formData.leanx_api_key || !formData.leanx_collection_uuid) {
      toast({
        title: 'Configuration Required',
        description: 'Please enable and configure LeanX payment settings first.',
        variant: 'destructive',
      });
      return;
    }

    // Open the test checkout modal
    setShowTestCheckout(true);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header with Actions */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Payment Settings</h1>
            <p className="text-muted-foreground mt-1">
              Configure your LeanX payment gateway integration
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              disabled={saving}
              variant="outline"
              className="min-w-[140px]"
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
            <Button
              onClick={handleTestCheckout}
              disabled={!formData.leanx_enabled || !formData.leanx_api_key || !formData.leanx_collection_uuid}
              className="min-w-[180px]"
            >
              <PlayCircle className="w-4 h-4 mr-2" />
              Launch Test Checkout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Settings Card */}
      <Card>
        {/* Gateway Header with Toggle */}
        <div className="p-6 border-b flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-indigo-50 flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">LeanX Gateway</h3>
              <p className="text-sm text-muted-foreground">Secure FPX & Bank processing.</p>
            </div>
          </div>

          {/* Toggle Switch */}
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={formData.leanx_enabled}
              onChange={(e) => setFormData({ ...formData, leanx_enabled: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gray-900"></div>
          </label>
        </div>

        {/* Configuration Form (shown when enabled) */}
        {formData.leanx_enabled && (
          <CardContent className="p-6 space-y-4">
            {/* Environment and Collection UUID Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* Environment */}
              <div>
                <Label htmlFor="environment">Environment</Label>
                <Select
                  value={formData.leanx_environment}
                  onValueChange={(value: 'test' | 'live') => setFormData({ ...formData, leanx_environment: value })}
                >
                  <SelectTrigger id="environment" className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="test">Test Mode (Sandbox)</SelectItem>
                    <SelectItem value="live">Live Production</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Collection UUID */}
              <div>
                <Label htmlFor="collection_uuid">Collection UUID</Label>
                <Input
                  id="collection_uuid"
                  type="text"
                  value={formData.leanx_collection_uuid}
                  onChange={(e) => setFormData({ ...formData, leanx_collection_uuid: e.target.value })}
                  placeholder="Dc-..."
                  className="mt-1"
                />
              </div>
            </div>

            {/* Auth Token */}
            <div>
              <Label htmlFor="api_key">Auth Token</Label>
              <div className="relative mt-1">
                <Input
                  id="api_key"
                  type={showApiKey ? 'text' : 'password'}
                  value={formData.leanx_api_key}
                  onChange={(e) => setFormData({ ...formData, leanx_api_key: e.target.value })}
                  placeholder="LP-..."
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Hash Key (Secret Key) */}
            <div>
              <Label htmlFor="secret_key">Hash Key</Label>
              <div className="relative mt-1">
                <Input
                  id="secret_key"
                  type={showSecretKey ? 'text' : 'password'}
                  value={formData.leanx_secret_key}
                  onChange={(e) => setFormData({ ...formData, leanx_secret_key: e.target.value })}
                  placeholder="c2d2..."
                  className="pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowSecretKey(!showSecretKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showSecretKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900">
              <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm">Ready to Transact</p>
                <p className="text-sm opacity-90 mt-1">
                  This configuration allows you to fetch bank lists directly and process payments via the LeanX API.
                </p>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Information Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <Info className="w-5 h-5" />
            How to get your LeanX credentials:
          </h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Log in to your LeanX merchant dashboard</li>
            <li>Navigate to Settings → API Credentials</li>
            <li>Copy your <strong>Auth Token</strong> (starts with LP-...)</li>
            <li>Create or find your <strong>Collection UUID</strong> (starts with Dc-... or CL-...)</li>
            <li>Copy your <strong>Hash Key</strong> for webhook verification</li>
            <li>Paste them here, select your environment, and click Save Settings</li>
          </ol>
          <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              <strong>Required:</strong> Auth Token and Collection UUID are required for payments to work. Hash Key is recommended for webhook security.
            </p>
          </div>
          <p className="text-xs text-blue-700 mt-3">
            Don't have a LeanX account? <a href="https://leanx.io" target="_blank" rel="noopener noreferrer" className="underline font-semibold hover:text-blue-900">Sign up here</a>
          </p>
        </CardContent>
      </Card>

      {/* Test Checkout Modal */}
      <TestCheckoutModal
        isOpen={showTestCheckout}
        onClose={() => setShowTestCheckout(false)}
        environment={formData.leanx_environment}
      />
    </div>
  );
}
