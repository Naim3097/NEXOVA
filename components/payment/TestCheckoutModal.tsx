'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Loader2,
  AlertCircle,
  CreditCard,
  Building2,
  Wallet,
  Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Bank {
  payment_service_id: number;
  payment_service_name: string;
  type: 'WEB_PAYMENT' | 'DIGITAL_PAYMENT';
  icon: string;
}

interface TestCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  environment: 'test' | 'live';
}

export const TestCheckoutModal: React.FC<TestCheckoutModalProps> = ({
  isOpen,
  onClose,
  environment,
}) => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [loadingBanks, setLoadingBanks] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  // Customer details (prefilled for testing)
  const [customerName, setCustomerName] = useState('Test User');
  const [customerEmail, setCustomerEmail] = useState('test@example.com');
  const [customerPhone, setCustomerPhone] = useState('0123456789');

  const TEST_AMOUNT = '10.00';

  // Fetch banks when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchBanks();
    } else {
      // Reset state when modal closes
      setBanks([]);
      setSelectedBank(null);
      setLoadingBanks(true);
      setError(null);
      setProcessing(false);
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    setError(null);

    try {
      // Use backend API to fetch banks (avoids CORS issues)
      const response = await fetch('/api/payments/test-banks');
      const data = await response.json();

      console.log('Test banks API response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to load payment methods');
      }

      if (!data.banks || data.banks.length === 0) {
        throw new Error(
          'No active payment methods found. Please check your LeanX Portal settings.'
        );
      }

      // Transform banks to match the expected format
      const transformedBanks: Bank[] = data.banks.map((bank: any) => ({
        payment_service_id: bank.id
          ? parseInt(bank.id)
          : bank.payment_service_id,
        payment_service_name: bank.name || bank.payment_service_name,
        type: bank.type || 'WEB_PAYMENT',
        icon:
          bank.icon ||
          (bank.type === 'DIGITAL_PAYMENT'
            ? 'ri-wallet-3-line'
            : 'ri-bank-line'),
      }));

      console.log('Transformed banks:', transformedBanks);

      setBanks(transformedBanks);
    } catch (err: any) {
      console.error('Error fetching banks:', err);
      setError(err.message || 'Failed to load payment methods');
    } finally {
      setLoadingBanks(false);
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedBank) {
      setError('Please select a payment method');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Generate invoice reference
      const invoiceRef = `TEST-${Date.now()}`;

      // Store invoice for later verification
      if (typeof window !== 'undefined') {
        localStorage.setItem('last_invoice_ref', invoiceRef);
      }

      // Prepare payload
      const payload = {
        payment_service_id: selectedBank.payment_service_id,
        amount: TEST_AMOUNT,
        invoice_ref: invoiceRef,
        full_name: customerName.trim() || 'Test User',
        email: customerEmail.trim() || 'test@example.com',
        phone_number: customerPhone.trim() || '0123456789',
        redirect_url: `${window.location.origin}/payment/success?test=true`,
        callback_url: `${window.location.origin}/api/payments/webhook`,
      };

      console.log('Creating test payment with payload:', payload);

      // Use backend API to create payment (avoids CORS issues)
      const response = await fetch('/api/payments/test-create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log('Payment creation response:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Payment creation failed');
      }

      if (data.redirect_url) {
        // Success - redirect to bank
        window.location.href = data.redirect_url;
      } else {
        throw new Error('No redirect URL received');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setError(err.message || 'Failed to create payment');
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E2E8F0]">
          <div>
            <h2 className="text-2xl font-bold text-[#455263]">Test Checkout</h2>
            <p className="text-sm text-[#969696] mt-1">
              Test Amount:{' '}
              <strong className="text-[#455263]">RM {TEST_AMOUNT}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-[#969696] hover:text-[#455263] disabled:opacity-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Settings Preview */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4">
            <div className="text-sm">
              <span className="text-[#455263] font-medium">Environment:</span>
              <span className="ml-2 text-[#455263] font-semibold">
                {environment === 'live' ? 'Live Production' : 'Test Mode'}
              </span>
            </div>
          </div>

          {/* Loading State */}
          {loadingBanks && (
            <div className="flex flex-col items-center justify-center py-12 text-[#969696]">
              <Loader2 className="w-10 h-10 animate-spin text-[#5FC7CD] mb-4" />
              <p>Fetching payment methods...</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-900 font-medium">Error</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {/* Bank Selection & Customer Info */}
          {!loadingBanks && !error && banks.length > 0 && (
            <>
              {/* Bank Selection */}
              <div>
                <Label className="text-base font-semibold text-[#455263] mb-3 block">
                  Select Payment Method
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {banks.map((bank) => (
                    <button
                      key={bank.payment_service_id}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      disabled={processing}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center ${
                        selectedBank?.payment_service_id ===
                        bank.payment_service_id
                          ? 'border-[#5FC7CD] bg-[#5FC7CD]/10 shadow-md'
                          : 'border-[#E2E8F0] hover:border-[#5FC7CD]/50 hover:shadow-sm'
                      } ${processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedBank?.payment_service_id ===
                          bank.payment_service_id
                            ? 'bg-[#5FC7CD] text-white'
                            : 'bg-[#F8FAFC] text-[#5FC7CD]'
                        }`}
                      >
                        {bank.type === 'WEB_PAYMENT' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <Wallet className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-sm font-semibold text-[#455263]">
                        {bank.payment_service_name}
                      </div>
                      <div className="text-xs text-[#969696] uppercase">
                        {bank.type.replace('_', ' ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <Label className="text-base font-semibold text-[#455263] mb-3 block">
                  Customer Details (Test)
                </Label>
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="customerName" className="text-sm">
                      Full Name
                    </Label>
                    <Input
                      id="customerName"
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      disabled={processing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail" className="text-sm">
                      Email
                    </Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      disabled={processing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone" className="text-sm">
                      Phone
                    </Label>
                    <Input
                      id="customerPhone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      disabled={processing}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!loadingBanks && !error && banks.length > 0 && (
          <div className="border-t border-[#E2E8F0] p-6 space-y-4">
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                disabled={processing}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleProcessPayment}
                disabled={!selectedBank || processing}
                variant="teal"
                className="flex-1"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4 mr-2" />
                    Pay RM {TEST_AMOUNT}
                  </>
                )}
              </Button>
            </div>
            <div className="flex items-center justify-center text-sm text-[#969696]">
              <Shield className="w-4 h-4 mr-1" />
              Secured by LeanX Payment Gateway
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
