'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const [verifying, setVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState<'success' | 'pending' | 'failed' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  // Verify payment status on page load using 2-step verification per LeanX guide
  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // STEP 1: Check URL params for explicit status indicators (per LeanX Integration Guide section 4.2)
        const status = searchParams.get('status');
        const billStatus = searchParams.get('bill_status');
        const responseCode = searchParams.get('response_code');

        // Get order ID from URL or localStorage (from test checkout)
        let invoiceRef = searchParams.get('order') || searchParams.get('invoice_ref');

        if (!invoiceRef && typeof window !== 'undefined') {
          invoiceRef = localStorage.getItem('last_invoice_ref');
        }

        setOrderId(invoiceRef);

        // Check for explicit success indicators in URL
        const successIndicators = ['1', '00', 'success', 'SUCCESS', '2000'];
        const hasSuccessParam = successIndicators.some(indicator =>
          status?.includes(indicator) ||
          billStatus?.includes(indicator) ||
          responseCode?.includes(indicator)
        );

        // Check for explicit failure indicators in URL
        const failureIndicators = ['failed', 'FAILED', 'cancelled', 'CANCELLED', 'declined', 'DECLINED'];
        const hasFailureParam = failureIndicators.some(indicator =>
          status?.toLowerCase().includes(indicator.toLowerCase()) ||
          billStatus?.toLowerCase().includes(indicator.toLowerCase())
        );

        // If we have explicit URL status, trust it initially
        if (hasSuccessParam) {
          setVerificationStatus('success');
          setVerifying(false);
          return;
        } else if (hasFailureParam) {
          setVerificationStatus('failed');
          setErrorMessage('Payment was cancelled or declined');
          setVerifying(false);
          return;
        }

        // STEP 2: Manual API verification (fallback when URL params are missing/unreliable)
        if (!invoiceRef) {
          setVerificationStatus('failed');
          setErrorMessage('No invoice reference found. Unable to verify payment.');
          setVerifying(false);
          return;
        }

        // Get CSRF token from meta tag
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-Token': csrfToken,
          },
          body: JSON.stringify({ orderId: invoiceRef }),
        });

        const data = await response.json();

        console.log('Payment verification response:', data);
        setDebugInfo(data);

        if (response.ok && data.success) {
          // Use actual status from LeanX API response
          const actualStatus = data.transaction.currentStatus;
          setVerificationStatus(actualStatus);

          if (actualStatus === 'failed') {
            setErrorMessage(data.message || 'Payment verification failed');
          }
        } else {
          // Verification API call failed - show failed status, NOT success
          setVerificationStatus('failed');
          setErrorMessage(data.error || 'Unable to verify payment status with LeanX API');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        // If verification fails, show FAILED status, NOT success
        setVerificationStatus('failed');
        setErrorMessage(error instanceof Error ? error.message : 'Payment verification error');
        setDebugInfo({ error: error instanceof Error ? error.message : String(error) });
      } finally {
        setVerifying(false);
      }
    };

    // Wait a moment before verifying to allow webhook to process
    const timer = setTimeout(verifyPayment, 1000);
    return () => clearTimeout(timer);
  }, [searchParams]);

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

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800">{errorMessage}</p>
            </div>
          )}

          {/* Debug Info (per LeanX Integration Guide section 4.3) */}
          {debugInfo && (
            <details className="mb-6">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700 hover:text-gray-900">
                Show Debug Info
              </summary>
              <div className="mt-3 bg-gray-50 border border-gray-200 rounded-lg p-3 overflow-auto max-h-48">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </div>
            </details>
          )}

          {/* Order Reference */}
          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="text-sm text-gray-500 mb-1">Order Reference</div>
              <div className="font-mono text-gray-900 font-semibold text-sm">{orderId}</div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard/settings/payments"
              className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Try Again
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-all"
            >
              Back to Dashboard
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
