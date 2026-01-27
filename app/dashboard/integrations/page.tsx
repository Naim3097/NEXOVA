'use client';

import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { GoogleSheetsIntegration } from '@/components/integrations/GoogleSheetsIntegration';
import { TrackingPixelsIntegration } from '@/components/integrations/TrackingPixelsIntegration';
import { PremiumFeatureGate } from '@/components/dashboard/PremiumFeatureGate';

function IntegrationsContent() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="mb-4 text-[#5FC7CD]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div>
          <h1 className="text-3xl font-bold text-[#455263] tracking-tight">
            Integrations
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect your favorite tools and services
          </p>
        </div>
      </div>

      {/* Tracking Pixels (includes GA4) */}
      <div className="mb-8">
        <TrackingPixelsIntegration />
      </div>

      {/* Google Sheets Integration */}
      <div className="mb-8">
        <GoogleSheetsIntegration />
      </div>

      {/* Coming Soon Card */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">
            More Integrations Coming Soon
          </CardTitle>
          <CardDescription>
            We're working on adding more integrations to help you streamline
            your workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-50">
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">📧</div>
              <p className="font-medium">Email Marketing</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">📊</div>
              <p className="font-medium">Analytics</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
            <div className="p-4 border rounded-lg text-center">
              <div className="text-2xl mb-2">💬</div>
              <p className="font-medium">Messaging</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <PremiumFeatureGate featureName="Integrations">
      <IntegrationsContent />
    </PremiumFeatureGate>
  );
}
