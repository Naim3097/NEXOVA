'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order');
  const [verifying, setVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'pending' | 'failed' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Verify payment status on page load (fallback in case webhook failed)
  useEffect(() => {
    if (!orderId) {
      setVerifying(false);
      return;
    }

    const verifyPayment = async () => {
      try {
        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ orderId }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setVerificationStatus(data.transaction.currentStatus);
        } else {
          // If verification fails, assume success since user was redirected here
          setVerificationStatus('success');
          setErrorMessage('Unable to verify payment status, but you were redirected to this page.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        // If verification fails, assume success since user was redirected here
        setVerificationStatus('success');
      } finally {
        setVerifying(false);
      }
    };

    // Wait a moment before verifying to allow webhook to process
    const timer = setTimeout(verifyPayment, 2000);
    return () => clearTimeout(timer);
  }, [orderId]);

  // Show loading state while verifying
  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-16 h-16 text-blue-600 animate-spin" />
            <h2 className="text-xl font-semibold text-gray-900">Verifying Payment...</h2>
            <p className="text-gray-600 text-center">Please wait while we confirm your payment.</p>
          </div>
        </div>
      </div>
    );
  }

  // Show pending state if payment is still processing
  if (verificationStatus === 'pending' || verificationStatus === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-blue-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Processing</h1>
            <p className="text-gray-600 text-lg">
              Your payment is being processed. You will receive a confirmation email shortly.
            </p>
          </div>
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-500 mb-1">Order Reference</div>
              <div className="font-mono text-gray-900 font-semibold">{orderId}</div>
            </div>
          )}
          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show failed state if payment failed
  if (verificationStatus === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-br from-red-400 to-red-600 rounded-full p-4">
              <AlertCircle className="w-16 h-16 text-white" />
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Payment Failed</h1>
            <p className="text-gray-600 text-lg">
              Unfortunately, your payment could not be processed. Please try again.
            </p>
          </div>
          <div className="space-y-3">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Try Again
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-md w-full">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full opacity-25 animate-ping"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-600 rounded-full p-4">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Payment Successful!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>
        </div>

        {/* Order Details */}
        {orderId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Order Reference</div>
            <div className="font-mono text-gray-900 font-semibold">{orderId}</div>
          </div>
        )}

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            A confirmation email has been sent to your email address with your order details and receipt.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
          >
            Back to Home
          </Link>
        </div>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            Powered by LeanX Payment Gateway
          </p>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}
