'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Users, Copy, Check, Link, UserPlus, UserCheck } from 'lucide-react';

interface ReferralUser {
  display_name: string | null;
  email: string | null;
  subscription_plan: string;
  created_at: string;
}

interface Referral {
  id: string;
  status: string;
  created_at: string;
  referred: ReferralUser;
}

interface AffiliateData {
  affiliate_code: string | null;
  stats: {
    total: number;
    active: number;
    signed_up: number;
  };
  referrals: Referral[];
}

export default function AffiliatePage() {
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState<AffiliateData | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await fetch('/api/affiliate');
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error('Failed to fetch affiliate data:', err);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only fetch data when auth is ready and user exists
    if (!authLoading && user) {
      fetchData();
    }
  }, [user, authLoading, fetchData]);

  // Show loading while auth is loading OR data is being fetched
  const isLoading = authLoading || dataLoading;

  const generateCode = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/affiliate', { method: 'POST' });
      if (res.ok) {
        const json = await res.json();
        setData((prev) =>
          prev
            ? { ...prev, affiliate_code: json.affiliate_code }
            : {
                affiliate_code: json.affiliate_code,
                stats: { total: 0, active: 0, signed_up: 0 },
                referrals: [],
              }
        );
      }
    } catch (err) {
      console.error('Failed to generate code:', err);
    } finally {
      setGenerating(false);
    }
  };

  const copyLink = () => {
    if (!data?.affiliate_code) return;
    const link = `${appUrl}/signup?ref=${data.affiliate_code}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl" />
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#455263]">Affiliate Program</h1>
        <p className="text-[#969696] mt-1">
          Share your referral link and track sign-ups from your network.
        </p>
      </div>

      {/* Affiliate Link Card */}
      <Card className="mb-6 border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg text-[#455263] flex items-center gap-2">
            <Link className="h-5 w-5 text-[#5FC7CD]" />
            Your Referral Link
          </CardTitle>
          <CardDescription>
            Share this link with friends. When they sign up, they&apos;ll be
            tracked as your referral.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.affiliate_code ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-sm text-[#455263] font-mono truncate">
                {appUrl}/signup?ref={data.affiliate_code}
              </div>
              <Button
                onClick={copyLink}
                variant="outline"
                className="flex items-center gap-2 shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-sm text-[#969696] mb-4">
                Generate your unique affiliate code to start referring users.
              </p>
              <Button
                onClick={generateCode}
                disabled={generating}
                className="bg-[#5FC7CD] hover:bg-[#4bb5bb] text-white"
              >
                {generating ? 'Generating...' : 'Generate Affiliate Link'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="border-[#E2E8F0]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#969696]">Total Referrals</p>
                <p className="text-3xl font-bold text-[#455263]">
                  {data?.stats.total || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#5FC7CD]/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#5FC7CD]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#969696]">Signed Up</p>
                <p className="text-3xl font-bold text-[#455263]">
                  {data?.stats.signed_up || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-[#FFCE33]/10 flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-[#FFCE33]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#E2E8F0]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#969696]">Active Users</p>
                <p className="text-3xl font-bold text-[#455263]">
                  {data?.stats.active || 0}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Referrals Table */}
      <Card className="border-[#E2E8F0]">
        <CardHeader>
          <CardTitle className="text-lg text-[#455263]">
            Referral History
          </CardTitle>
          <CardDescription>
            People who signed up using your referral link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data?.referrals && data.referrals.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#E2E8F0]">
                    <th className="text-left py-3 px-2 text-[#969696] font-medium">
                      Name
                    </th>
                    <th className="text-left py-3 px-2 text-[#969696] font-medium">
                      Email
                    </th>
                    <th className="text-left py-3 px-2 text-[#969696] font-medium">
                      Plan
                    </th>
                    <th className="text-left py-3 px-2 text-[#969696] font-medium">
                      Status
                    </th>
                    <th className="text-left py-3 px-2 text-[#969696] font-medium">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.referrals.map((referral) => (
                    <tr
                      key={referral.id}
                      className="border-b border-[#E2E8F0] last:border-0"
                    >
                      <td className="py-3 px-2 text-[#455263]">
                        {referral.referred?.display_name || 'Unknown'}
                      </td>
                      <td className="py-3 px-2 text-[#455263]">
                        {referral.referred?.email || '-'}
                      </td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#F8FAFC] text-[#455263] capitalize">
                          {referral.referred?.subscription_plan || 'free'}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : referral.status === 'churned'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-[#FFCE33]/10 text-[#455263]'
                          }`}
                        >
                          {referral.status === 'signed_up'
                            ? 'Signed Up'
                            : referral.status.charAt(0).toUpperCase() +
                              referral.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-[#969696]">
                        {new Date(referral.created_at).toLocaleDateString(
                          'en-MY',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-[#969696]">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">No referrals yet</p>
              <p className="text-sm mt-1">
                Share your affiliate link to start tracking referrals.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
