'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Globe,
  CheckCircle,
  XCircle,
  Loader2,
  ExternalLink,
  Info,
  AlertTriangle,
  Copy,
  RefreshCw,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { HelpButton } from '@/components/dashboard/HelpButton';
import { PremiumFeatureGate } from '@/components/dashboard/PremiumFeatureGate';

interface DnsRecord {
  type: string;
  name: string;
  value: string;
}

function SubdomainSettingsContent() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [checking, setChecking] = useState(false);
  const [currentSubdomain, setCurrentSubdomain] = useState<string | null>(null);
  const [newSubdomain, setNewSubdomain] = useState('');
  const [availability, setAvailability] = useState<{
    available: boolean;
    error: string | null;
  } | null>(null);

  // Custom domain state
  const [showCustomDomainDialog, setShowCustomDomainDialog] = useState(false);
  const [customDomain, setCustomDomain] = useState('');
  const [currentCustomDomain, setCurrentCustomDomain] = useState<string | null>(
    null
  );
  const [customDomainVerified, setCustomDomainVerified] = useState(false);
  const [customDomainAvailability, setCustomDomainAvailability] = useState<{
    available: boolean;
    error: string | null;
  } | null>(null);
  const [checkingCustomDomain, setCheckingCustomDomain] = useState(false);
  const [savingCustomDomain, setSavingCustomDomain] = useState(false);
  const [ownsDomain, setOwnsDomain] = useState(false);
  const [hasDnsAccess, setHasDnsAccess] = useState(false);
  const [understoodWarning, setUnderstoodWarning] = useState(false);
  const [dnsRecords, setDnsRecords] = useState<DnsRecord[]>([]);
  const [verifyingDns, setVerifyingDns] = useState(false);

  // Subdomain format: subdomain.nexova.my
  const domainSuffix = 'nexova.my';

  // Helper to get full subdomain URL
  const getFullSubdomainUrl = (subdomain: string) =>
    `${subdomain}.${domainSuffix}`;

  // Default DNS records to show before domain is added to Vercel
  const defaultDnsRecords: DnsRecord[] = [
    { type: 'A', name: '@', value: '76.76.21.21' },
    { type: 'CNAME', name: 'www', value: 'cname.vercel-dns.com' },
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load both subdomain and custom domain settings
      const [subdomainRes, customDomainRes] = await Promise.all([
        fetch('/api/subdomain'),
        fetch('/api/custom-domain'),
      ]);

      const subdomainData = await subdomainRes.json();
      const customDomainData = await customDomainRes.json();

      if (subdomainData.success) {
        setCurrentSubdomain(subdomainData.subdomain);
        setNewSubdomain(subdomainData.subdomain || '');
      }

      if (customDomainData.success) {
        setCurrentCustomDomain(customDomainData.customDomain);
        setCustomDomainVerified(customDomainData.verified);
        if (customDomainData.dnsRecords) {
          setDnsRecords(customDomainData.dnsRecords);
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const verifyDns = async () => {
    if (!currentCustomDomain) return;

    try {
      setVerifyingDns(true);
      const response = await fetch('/api/custom-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: currentCustomDomain, action: 'verify' }),
      });

      const data = await response.json();

      if (data.verified) {
        setCustomDomainVerified(true);
        toast({
          title: 'Domain Verified!',
          description: 'Your custom domain is now active and ready to use.',
        });
      } else {
        toast({
          title: 'DNS Not Ready',
          description:
            data.error ||
            'Please ensure your DNS records are configured correctly. It may take up to 48 hours for DNS changes to propagate.',
          variant: 'destructive',
        });
      }

      // Reload to get updated DNS records
      await loadSettings();
    } catch (error) {
      console.error('Error verifying DNS:', error);
      toast({
        title: 'Verification Failed',
        description: 'Unable to verify DNS configuration. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setVerifyingDns(false);
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
      setAvailability({
        available: false,
        error: 'Failed to check availability',
      });
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
          ? `Your pages will be available at ${getFullSubdomainUrl(data.subdomain)}`
          : 'Subdomain has been removed',
      });
    } catch (error) {
      console.error('Error saving subdomain:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to save subdomain',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    if (
      !confirm(
        'Are you sure you want to remove your subdomain? Your pages will only be accessible via path-based URLs.'
      )
    ) {
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

  // Custom domain functions
  const checkCustomDomainAvailability = async () => {
    if (!customDomain.trim()) {
      setCustomDomainAvailability(null);
      return;
    }

    try {
      setCheckingCustomDomain(true);
      const response = await fetch('/api/custom-domain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: customDomain.toLowerCase() }),
      });

      const data = await response.json();
      setCustomDomainAvailability({
        available: data.available,
        error: data.error,
      });
    } catch (error) {
      console.error('Error checking custom domain:', error);
      setCustomDomainAvailability({
        available: false,
        error: 'Failed to check domain',
      });
    } finally {
      setCheckingCustomDomain(false);
    }
  };

  const handleSaveCustomDomain = async () => {
    if (!ownsDomain || !hasDnsAccess || !understoodWarning) {
      toast({
        title: 'Please confirm all requirements',
        description: 'You must check all checkboxes to proceed',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSavingCustomDomain(true);
      const response = await fetch('/api/custom-domain', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: customDomain.toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save custom domain');
      }

      setCurrentCustomDomain(data.customDomain);
      setCustomDomainVerified(false);
      setShowCustomDomainDialog(false);
      resetCustomDomainForm();

      toast({
        title: 'Custom Domain Saved',
        description:
          'Please configure your DNS settings to point to our server.',
      });
    } catch (error) {
      console.error('Error saving custom domain:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to save custom domain',
        variant: 'destructive',
      });
    } finally {
      setSavingCustomDomain(false);
    }
  };

  const handleRemoveCustomDomain = async () => {
    if (
      !confirm(
        'Are you sure you want to remove your custom domain? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      setSavingCustomDomain(true);
      const response = await fetch('/api/custom-domain', {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove custom domain');
      }

      setCurrentCustomDomain(null);
      setCustomDomainVerified(false);
      toast({
        title: 'Custom Domain Removed',
        description: 'Your pages will now use the subdomain or path-based URLs',
      });
    } catch (error) {
      console.error('Error removing custom domain:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove custom domain',
        variant: 'destructive',
      });
    } finally {
      setSavingCustomDomain(false);
    }
  };

  const resetCustomDomainForm = () => {
    setCustomDomain('');
    setCustomDomainAvailability(null);
    setOwnsDomain(false);
    setHasDnsAccess(false);
    setUnderstoodWarning(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: 'Value copied to clipboard',
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-2xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#969696]" />
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

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#5FC7CD]/10 flex items-center justify-center">
              <Globe className="w-7 h-7 text-[#5FC7CD]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#455263]">
                Domain Settings
              </h1>
              <p className="text-[#969696] mt-1">
                Customize your published page URL
              </p>
            </div>
          </div>
          <HelpButton pageSource="subdomain_settings" />
        </div>
      </div>

      {/* Info Box */}
      <div className="flex gap-3 p-4 bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-2xl text-[#455263] mb-6">
        <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold mb-1">How domains work</p>
          <p className="opacity-90">
            With a subdomain, your published pages will be accessible at:
            <br />
            <code className="bg-[#5FC7CD]/10 px-1 rounded">
              yourname.{domainSuffix}
            </code>
          </p>
          <p className="opacity-90 mt-2">
            With a custom domain, your pages will be accessible at:
            <br />
            <code className="bg-[#5FC7CD]/10 px-1 rounded">
              www.yourdomain.com
            </code>
          </p>
        </div>
      </div>

      {/* Current Custom Domain Status */}
      {currentCustomDomain && (
        <Card className="mb-6 border-[#5FC7CD]/20 bg-[#5FC7CD]/5">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {customDomainVerified ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <div>
                  <p className="font-medium text-[#455263]">Custom Domain</p>
                  <a
                    href={`https://${currentCustomDomain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#5FC7CD] hover:underline flex items-center gap-1"
                  >
                    {currentCustomDomain}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  {customDomainVerified ? (
                    <p className="text-xs text-green-600 mt-1">
                      Domain verified and active
                    </p>
                  ) : (
                    <p className="text-xs text-amber-600 mt-1">
                      DNS verification pending
                    </p>
                  )}
                </div>
              </div>
              <div className="flex gap-2">
                {!customDomainVerified && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={verifyDns}
                    disabled={verifyingDns}
                    className="text-[#5FC7CD] hover:text-[#4bb5bb] hover:bg-[#F8FAFC]"
                  >
                    {verifyingDns ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-1" />
                    )}
                    Verify DNS
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveCustomDomain}
                  disabled={savingCustomDomain}
                  className="text-[#EF4444] hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            </div>

            {/* DNS Records for existing domain */}
            {!customDomainVerified && dnsRecords.length > 0 && (
              <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden bg-white">
                <div className="px-4 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <p className="text-sm font-medium text-[#455263]">
                    Required DNS Records
                  </p>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-[#969696]">
                        Type
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-[#969696]">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-[#969696]">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {dnsRecords.map((record, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-3 font-medium">{record.type}</td>
                        <td className="px-4 py-3 font-mono text-sm">
                          {record.name}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm truncate max-w-[200px]">
                              {record.value}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 shrink-0"
                              onClick={() => copyToClipboard(record.value)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Current Subdomain Status */}
      {currentSubdomain && !currentCustomDomain && (
        <Card className="mb-6 border-green-200 bg-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-700" />
                <div>
                  <p className="font-medium text-[#455263]">Active Subdomain</p>
                  <a
                    href={`https://${getFullSubdomainUrl(currentSubdomain)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#5FC7CD] hover:underline flex items-center gap-1"
                  >
                    {getFullSubdomainUrl(currentSubdomain)}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRemove}
                disabled={saving}
                className="text-[#EF4444] hover:text-red-700 hover:bg-red-50"
              >
                Remove
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Use Custom Domain Button */}
      {!currentCustomDomain && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Use Your Own Domain</CardTitle>
            <CardDescription>
              Point your own domain to your published pages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowCustomDomainDialog(true)}
              variant="outline"
              className="w-full"
            >
              <Globe className="w-4 h-4 mr-2" />
              Configure Custom Domain
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Subdomain Input */}
      {!currentCustomDomain && (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentSubdomain ? 'Change Subdomain' : 'Claim Your Subdomain'}
            </CardTitle>
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
                    setNewSubdomain(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                    );
                    setAvailability(null);
                  }}
                  onBlur={checkAvailability}
                  placeholder="yourname"
                  className="flex-1"
                />
                <span className="text-sm text-[#969696] whitespace-nowrap">
                  .{domainSuffix}
                </span>
              </div>
              <p className="text-xs text-[#969696] mt-1">
                Use lowercase letters, numbers, and hyphens (3-63 characters)
              </p>
            </div>

            {/* Availability Status */}
            {checking && (
              <div className="flex items-center gap-2 text-[#969696]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Checking availability...</span>
              </div>
            )}

            {!checking && availability && (
              <div
                className={`flex items-center gap-2 ${availability.available ? 'text-green-600' : 'text-red-600'}`}
              >
                {availability.available ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">
                      This subdomain is available!
                    </span>
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
              <div className="p-3 bg-[#F8FAFC] rounded-2xl">
                <p className="text-xs text-[#969696] mb-1">Preview URL</p>
                <p className="text-sm font-mono text-[#455263]">
                  https://{getFullSubdomainUrl(newSubdomain)}
                </p>
              </div>
            )}

            <Button
              onClick={handleSave}
              disabled={
                saving ||
                checking ||
                !newSubdomain ||
                newSubdomain.length < 3 ||
                (availability !== null && !availability.available)
              }
              className="w-full"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : currentSubdomain ? (
                'Update Subdomain'
              ) : (
                'Claim Subdomain'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Note about republishing */}
      <p className="text-sm text-[#969696] text-center mt-4">
        After setting your domain, you may need to republish your pages to
        update their URLs.
      </p>

      {/* Custom Domain Dialog */}
      <Dialog
        open={showCustomDomainDialog}
        onOpenChange={(open) => {
          setShowCustomDomainDialog(open);
          if (!open) resetCustomDomainForm();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>How to use my own domain?</DialogTitle>
            <DialogDescription>
              In order to point your page to your own domain, you&apos;ll need
              to update your zone record in your hosting control panel.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Warning boxes */}
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
              <p>
                Unfortunately we can&apos;t help you with this settings as it is
                outside of our control. Please get help from your hosting
                provider
              </p>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-amber-800 text-sm">
              <p>
                If you changed to a new subdomain or domain, the old record will
                be deleted and be free up after 24hours before you can use it
                again.
              </p>
            </div>

            {/* DNS Record Table */}
            <div className="border border-[#E2E8F0] rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-[#F8FAFC]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-[#969696]">
                      TYPE
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-[#969696]">
                      NAME
                    </th>
                    <th className="px-4 py-2 text-left font-medium text-[#969696]">
                      VALUE
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {defaultDnsRecords.map((record, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3 font-medium">{record.type}</td>
                      <td className="px-4 py-3 font-mono text-sm">
                        {record.name}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm">
                            {record.value}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyToClipboard(record.value)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="text-sm text-[#969696] space-y-2">
              <p>
                <strong>For root domains</strong> (e.g., example.com): Create an{' '}
                <code className="bg-[#F8FAFC] px-1 rounded">A</code> record
                pointing to{' '}
                <code className="bg-[#F8FAFC] px-1 rounded">76.76.21.21</code>
              </p>
              <p>
                <strong>For subdomains</strong> (e.g., www.example.com): Create
                a <code className="bg-[#F8FAFC] px-1 rounded">CNAME</code>{' '}
                record pointing to{' '}
                <code className="bg-[#F8FAFC] px-1 rounded">
                  cname.vercel-dns.com
                </code>
              </p>
              <p>
                After configuring DNS, click OK to save. You can verify your
                domain configuration on the settings page.
              </p>
            </div>

            {/* Domain Input */}
            <div>
              <Label htmlFor="customDomain">
                Full Domain Name (https://www.example.com)
              </Label>
              <Input
                id="customDomain"
                value={customDomain}
                onChange={(e) => {
                  // Remove protocol if user pastes full URL
                  let value = e.target.value
                    .toLowerCase()
                    .replace('https://', '')
                    .replace('http://', '');
                  setCustomDomain(value);
                  setCustomDomainAvailability(null);
                }}
                onBlur={checkCustomDomainAvailability}
                placeholder="URL"
                className="mt-1"
              />
              {!customDomain && (
                <p className="text-xs text-[#EF4444] mt-1">Value is required</p>
              )}
            </div>

            {/* Domain availability status */}
            {checkingCustomDomain && (
              <div className="flex items-center gap-2 text-[#969696]">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Checking domain...</span>
              </div>
            )}

            {!checkingCustomDomain &&
              customDomainAvailability &&
              !customDomainAvailability.available && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="w-4 h-4" />
                  <span className="text-sm">
                    {customDomainAvailability.error}
                  </span>
                </div>
              )}

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="ownsDomain"
                  checked={ownsDomain}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setOwnsDomain(checked === true)
                  }
                />
                <Label htmlFor="ownsDomain" className="text-sm cursor-pointer">
                  I possess this domain name
                </Label>
              </div>

              <div className="flex items-start gap-2">
                <Checkbox
                  id="hasDnsAccess"
                  checked={hasDnsAccess}
                  onCheckedChange={(checked: boolean | 'indeterminate') =>
                    setHasDnsAccess(checked === true)
                  }
                />
                <Label
                  htmlFor="hasDnsAccess"
                  className="text-sm cursor-pointer"
                >
                  I have an access to the DNS Manager to this domain name
                </Label>
              </div>

              <div className="p-3 bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-2xl">
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="understoodWarning"
                    checked={understoodWarning}
                    onCheckedChange={(checked: boolean | 'indeterminate') =>
                      setUnderstoodWarning(checked === true)
                    }
                  />
                  <Label
                    htmlFor="understoodWarning"
                    className="text-sm cursor-pointer text-[#455263]"
                  >
                    By choosing to use your own domain name, you can&apos;t
                    revert back to our {domainSuffix} subdomain.
                    <br />
                    <span className="font-medium">I understood and agree</span>
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowCustomDomainDialog(false);
                resetCustomDomainForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomDomain}
              disabled={
                savingCustomDomain ||
                checkingCustomDomain ||
                !customDomain ||
                !ownsDomain ||
                !hasDnsAccess ||
                !understoodWarning ||
                (customDomainAvailability !== null &&
                  !customDomainAvailability.available)
              }
            >
              {savingCustomDomain ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'OK'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function SubdomainSettingsPage() {
  return (
    <PremiumFeatureGate featureName="Custom Domain Settings">
      <SubdomainSettingsContent />
    </PremiumFeatureGate>
  );
}
