'use client';

import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function SubscriptionSuccessPage() {
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-chart-2/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10 text-chart-2" />
            </div>
            <CardTitle className="text-2xl">Welcome to Pro!</CardTitle>
            <CardDescription className="text-base">
              Your subscription has been activated successfully
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#5FC7CD]" />
                <h3 className="font-semibold text-[#455263]">What's next?</h3>
              </div>
              <ul className="space-y-3 text-sm text-[#969696]">
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[20px] text-[#455263]">
                    1.
                  </span>
                  <span>Create unlimited projects without restrictions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[20px] text-[#455263]">
                    2.
                  </span>
                  <span>Connect your custom domain from project settings</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[20px] text-[#455263]">
                    3.
                  </span>
                  <span>Access advanced analytics for deeper insights</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold min-w-[20px] text-[#455263]">
                    4.
                  </span>
                  <span>
                    Reach out to priority support anytime you need help
                  </span>
                </li>
              </ul>
            </div>

            <div className="text-center text-sm text-[#969696]">
              <p>A confirmation email has been sent to your inbox.</p>
              <p className="mt-1">
                You can manage your subscription anytime from your dashboard.
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push('/dashboard/subscription')}
            >
              View Subscription
            </Button>
            <Button
              className="flex-1"
              onClick={() => router.push('/dashboard')}
            >
              Go to Dashboard
            </Button>
          </CardFooter>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
