'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, CreditCard, Building2, Wallet, Shield } from 'lucide-react';
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
  leanxApiKey: string;
  leanxCollectionUuid: string;
  environment: 'test' | 'live';
}

export const TestCheckoutModal: React.FC<TestCheckoutModalProps> = ({
  isOpen,
  onClose,
  leanxApiKey,
  leanxCollectionUuid,
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
      const apiUrl = 'https://api.leanx.io/api/v1/merchant/list-payment-services';

      // Query all combinations in parallel
      const combinations = [
        { type: 'WEB_PAYMENT', model: 1, label: 'FPX B2C' },
        { type: 'WEB_PAYMENT', model: 2, label: 'FPX B2B' },
        { type: 'DIGITAL_PAYMENT', model: 1, label: 'E-Wallet B2C' },
        { type: 'DIGITAL_PAYMENT', model: 2, label: 'E-Wallet B2B' },
      ];

      const results = await Promise.all(
        combinations.map((combo) => fetchPaymentServices(apiUrl, combo))
      );

      // Flatten and deduplicate
      const allBanks = results.flat();
      const uniqueBanks = Array.from(
        new Map(allBanks.map((bank) => [bank.payment_service_id, bank])).values()
      );

      if (uniqueBanks.length === 0) {
        throw new Error('No active payment methods found. Please check your LeanX Portal settings.');
      }

      setBanks(uniqueBanks);
    } catch (err: any) {
      console.error('Error fetching banks:', err);
      setError(err.message || 'Failed to load payment methods');
    } finally {
      setLoadingBanks(false);
    }
  };

  const fetchPaymentServices = async (apiUrl: string, combo: any): Promise<Bank[]> => {
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': leanxApiKey,
        },
        body: JSON.stringify({
          payment_type: combo.type,
          payment_status: 'active',
          payment_model_reference_id: combo.model,
        }),
      });

      const data = await response.json();

      // Parse response based on structure
      let banksList: any[] = [];

      if (Array.isArray(data.data)) {
        banksList = data.data;
      } else if (data.data?.payment_services) {
        banksList = data.data.payment_services;
      } else if (data.data?.list?.data?.[0]) {
        const firstItem = data.data.list.data[0];
        if (combo.type === 'WEB_PAYMENT' && firstItem.WEB_PAYMENT) {
          banksList = firstItem.WEB_PAYMENT;
        } else if (combo.type === 'DIGITAL_PAYMENT' && firstItem.DIGITAL_PAYMENT) {
          banksList = firstItem.DIGITAL_PAYMENT;
        }
      }

      // Normalize bank data
      return banksList.map((bank) => ({
        payment_service_id: bank.payment_service_id,
        payment_service_name: (bank.name || bank.payment_service_name)
          .replace(/ B2B$/i, '')
          .trim(),
        type: combo.type,
        icon: combo.type === 'WEB_PAYMENT' ? 'ri-bank-line' : 'ri-wallet-3-line',
      }));
    } catch (error) {
      console.warn(`Failed to fetch ${combo.label}:`, error);
      return [];
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
        collection_uuid: leanxCollectionUuid,
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

      // Create payment
      const response = await fetch('https://api.leanx.io/api/v1/merchant/create-bill-silent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': leanxApiKey,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      console.log('Payment creation response:', data);

      if (data.response_code === 2000 && data.data?.redirect_url) {
        // Success - redirect to bank
        window.location.href = data.data.redirect_url;
      } else {
        throw new Error(data.message || data.description || 'Payment creation failed');
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
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Test Checkout</h2>
            <p className="text-sm text-gray-600 mt-1">
              Test Amount: <strong className="text-gray-900">RM {TEST_AMOUNT}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={processing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Settings Preview */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600 font-medium">Environment:</span>
                <span className="ml-2 text-gray-900 font-semibold">
                  {environment === 'live' ? 'Live Production' : 'Test Mode'}
                </span>
              </div>
              <div>
                <span className="text-gray-600 font-medium">Collection UUID:</span>
                <span className="ml-2 text-gray-900 font-mono text-xs">
                  {leanxCollectionUuid.substring(0, 15)}...
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loadingBanks && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600">
              <Loader2 className="w-10 h-10 animate-spin text-blue-600 mb-4" />
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
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
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
                        selectedBank?.payment_service_id === bank.payment_service_id
                          ? 'border-blue-600 bg-blue-50 shadow-md'
                          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      } ${processing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selectedBank?.payment_service_id === bank.payment_service_id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-blue-600'
                        }`}
                      >
                        {bank.type === 'WEB_PAYMENT' ? (
                          <Building2 className="w-5 h-5" />
                        ) : (
                          <Wallet className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        {bank.payment_service_name}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {bank.type.replace('_', ' ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
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
          <div className="border-t p-6 space-y-4">
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
                className="flex-1 bg-blue-600 hover:bg-blue-700"
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
            <div className="flex items-center justify-center text-sm text-gray-500">
              <Shield className="w-4 h-4 mr-1" />
              Secured by LeanX Payment Gateway
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
