'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Globe, CheckCircle, XCircle, Loader2, ExternalLink, Info } from 'lucide-react';

export default function SubdomainSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [currentSubdomain, setCurrentSubdomain] = useState<string | null>(null);
  const [newSubdomain, setNewSubdomain] = useState('');
  const [availability, setAvailability] = useState<{ available: boolean; error: string | null } | null>(null);

  const appDomain = process.env.NEXT_PUBLIC_APP_URL?.replace('https://', '').replace('http://', '') || 'ide-page-builder.vercel.app';

  useEffect(() => {
    loadSubdomain();
  }, []);

  const loadSubdomain = async () => {
    try {
      const response = await fetch('/api/subdomain');
      const data = await response.json();

      if (data.success) {
        setCurrentSubdomain(data.subdomain);
        setNewSubdomain(data.subdomain || '');
      }
    } catch (error) {
      console.error('Error loading subdomain:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!newSubdomain.trim()) {
      setAvailability(null);
      return;
    }

    // If same as current, it's available
    if (newSubdomain === currentSubdomain) {
      setAvailability({ available: true, error: null });
      return;
    }

    try {
      setChecking(true);
      const response = await fetch('/api/subdomain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: newSubdomain.toLowerCase() }),
      });

      const data = await response.json();
      setAvailability({ available: data.available, error: data.error });
    } catch (error) {
      console.error('Error checking availability:', error);
      setAvailability({ available: false, error: 'Failed to check availability' });
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/subdomain', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: newSubdomain.toLowerCase() || null }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save subdomain');
      }

      setCurrentSubdomain(data.subdomain);
      toast({
        title: 'Subdomain Updated',
        description: data.subdomain
          ? `Your pages will be available at ${data.subdomain}.${appDomain}`
          : 'Subdomain has been removed',
      });
    } catch (error) {
      console.error('Error saving subdomain:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save subdomain',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Are you sure you want to remove your subdomain? Your pages will only be accessible via path-based URLs.')) {
      return;
    }

    setNewSubdomain('');
    try {
      setSaving(true);
      const response = await fetch('/api/subdomain', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdomain: null }),
      });

      if (!response.ok) {
        throw new Error('Failed to remove subdomain');
      }

      setCurrentSubdomain(null);
      setAvailability(null);
      toast({
        title: 'Subdomain Removed',
        description: 'Your pages will now use path-based URLs',
      });
    } catch (error) {
      console.error('Error removing subdomain:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove subdomain',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-2xl">
      {/* Header */}
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

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
            <Globe className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Subdomain Settings</h1>
            <p className="text-muted-foreground mt-1">
              Customize your published page URL
            </p>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 mb-6">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">How subdomains work</p>
          <p className="opacity-90">
            With a subdomain, your published pages will be accessible at:<br />
            <code className="bg-blue-100 px-1 rounded">yourname.{appDomain}</code>
          </p>
          <p className="opacity-90 mt-2">
            Without a subdomain, pages use path-based URLs:<br />
            <code className="bg-blue-100 px-1 rounded">{appDomain}/p/your-page-slug</code>
          </p>
        </div>
      </div>

      {/* Current Status */}
      {currentSubdomain && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Active Subdomain</p>
                  <a
                    href={`https://${currentSubdomain}.${appDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-green-700 hover:underline flex items-center gap-1"
                  >
                    {currentSubdomain}.{appDomain}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={saving}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subdomain Input */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSubdomain ? 'Change Subdomain' : 'Claim Your Subdomain'}</CardTitle>
          <CardDescription>
            Choose a unique subdomain for your published pages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="subdomain">Subdomain</Label>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="subdomain"
                value={newSubdomain}
                onChange={(e) => {
                  setNewSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''));
                  setAvailability(null);
                }}
                onBlur={checkAvailability}
                placeholder="yourname"
                className="flex-1"
              />
              <span className="text-sm text-gray-500 whitespace-nowrap">.{appDomain}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Use lowercase letters, numbers, and hyphens (3-63 characters)
            </p>
          </div>

          {/* Availability Status */}
          {checking && (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">Checking availability...</span>
            </div>
          )}

          {!checking && availability && (
            <div className={`flex items-center gap-2 ${availability.available ? 'text-green-600' : 'text-red-600'}`}>
              {availability.available ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">This subdomain is available!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm">{availability.error}</span>
                </>
              )}
            </div>
          )}

          {/* Preview */}
          {newSubdomain && newSubdomain.length >= 3 && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-500 mb-1">Preview URL</p>
              <p className="text-sm font-mono text-gray-700">
                https://{newSubdomain}.{appDomain}
              </p>
            </div>
          )}

          <Button
            onClick={handleSave}
            disabled={saving || checking || !newSubdomain || newSubdomain.length < 3 || (availability && !availability.available)}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              currentSubdomain ? 'Update Subdomain' : 'Claim Subdomain'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Note about republishing */}
      <p className="text-sm text-gray-500 text-center mt-4">
        After setting your subdomain, you may need to republish your pages to update their URLs.
      </p>
    </div>
  );
}
