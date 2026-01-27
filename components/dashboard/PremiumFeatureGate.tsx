'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface PremiumFeatureGateProps {
  children: React.ReactNode;
  featureName?: string;
}

export function PremiumFeatureGate({
  children,
  featureName = 'This feature',
}: PremiumFeatureGateProps) {
  const { profile, loading } = useAuth();
  const router = useRouter();

  const isPremiumOrHigher =
    profile?.subscription_plan === 'premium' ||
    profile?.subscription_plan === 'enterprise';

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Premium users see the content
  if (isPremiumOrHigher) {
    return <>{children}</>;
  }

  // Free users see blurred content with upgrade CTA
  return (
    <div className="relative min-h-screen">
      {/* Blurred content */}
      <div
        className="blur-sm pointer-events-none select-none"
        aria-hidden="true"
      >
        {children}
      </div>

      {/* Overlay with upgrade CTA */}
      <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
        <div className="max-w-md mx-auto text-center p-8 bg-card rounded-xl shadow-xl border">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8 text-primary" />
          </div>

          <h2 className="text-2xl font-bold text-foreground mb-3">
            Premium Feature
          </h2>

          <p className="text-muted-foreground mb-6">
            {featureName} is only available on the Premium plan. Upgrade now to
            unlock this feature and many more!
          </p>

          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
              onClick={() => router.push('/pricing')}
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>

            <Button
              variant="ghost"
              className="w-full"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>

          <p className="text-xs text-muted-foreground mt-4">
            Starting at $29/month. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}
