'use client';

import React, { useState, useEffect } from 'react';
import { X, Lock, CreditCard as LeanXIcon, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CheckoutFormData } from '@/types';

interface Bank {
  id: string;
  name: string;
  logo?: string;
}

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productDescription?: string;
  amount: number;
  currency: string;
  onSubmit: (formData: CheckoutFormData, addShipping: boolean) => void;
  isProcessing?: boolean;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  productName,
  productDescription,
  amount,
  currency,
  onSubmit,
  isProcessing = false,
}) => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    bankId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingBanks, setLoadingBanks] = useState(false);
  const [bankError, setBankError] = useState<string | null>(null);
  const [addShipping, setAddShipping] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Fetch banks when modal opens
  useEffect(() => {
    if (isOpen && banks.length === 0) {
      fetchBanks();
    }
  }, [isOpen]);

  const fetchBanks = async () => {
    setLoadingBanks(true);
    setBankError(null);

    try {
      const response = await fetch('/api/payments/banks');
      const data = await response.json();

      if (data.success && data.banks) {
        setBanks(data.banks);
      } else {
        setBankError(data.error || 'Failed to load banks');
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error);
      setBankError('Failed to load banks');
    } finally {
      setLoadingBanks(false);
    }
  };

  const shippingCost = 10.00; // Fixed shipping cost
  const totalAmount = addShipping ? amount + shippingCost : amount;

  // Format currency
  const formatCurrency = (value: number, curr: string) => {
    if (curr === 'MYR') {
      return `RM ${value.toFixed(2)}`;
    }
    return `${curr} ${value.toFixed(2)}`;
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (!formData.bankId) {
      newErrors.bankId = 'Please select a bank';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData, addShipping);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Secure Checkout</h2>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Order Summary */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Order Summary</h3>

            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{productName}</p>
                {productDescription && (
                  <p className="text-sm text-gray-600 mt-1">{productDescription}</p>
                )}
              </div>
              <p className="font-semibold text-gray-900 ml-4">
                {formatCurrency(amount, currency)}
              </p>
            </div>

            {addShipping && (
              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-200">
                <p className="text-sm text-gray-700">Priority Shipping & Insurance</p>
                <p className="text-sm font-semibold text-gray-900">
                  {formatCurrency(shippingCost, currency)}
                </p>
              </div>
            )}

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-300">
              <p className="text-base font-bold text-gray-900">Total</p>
              <p className="text-base font-bold text-gray-900">
                {formatCurrency(totalAmount, currency)}
              </p>
            </div>
          </div>

          {/* Shipping Option */}
          <div className="border border-yellow-300 bg-yellow-50 rounded-lg p-4">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                checked={addShipping}
                onChange={(e) => setAddShipping(e.target.checked)}
                disabled={isProcessing}
                className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <div className="ml-3 flex-1">
                <p className="font-semibold text-gray-900">
                  Yes! Add Priority Shipping & Insurance
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Get your order faster and fully insured against damage.
                </p>
              </div>
            </label>
          </div>

          {/* Bank Selection */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Select Your Bank</h3>

            {loadingBanks ? (
              <div className="flex items-center justify-center py-8">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : bankError ? (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                <p className="text-red-600 text-sm">{bankError}</p>
                <Button
                  type="button"
                  onClick={fetchBanks}
                  className="mt-2 text-sm"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {banks.map((bank) => (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, bankId: bank.id });
                      setErrors({ ...errors, bankId: undefined });
                    }}
                    disabled={isProcessing}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      formData.bankId === bank.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center space-x-3">
                      {bank.logo ? (
                        <img
                          src={bank.logo}
                          alt={bank.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                      <span className="font-medium text-gray-900">{bank.name}</span>
                    </div>
                    {formData.bankId === bank.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
                {errors.bankId && (
                  <p className="text-xs text-red-500 mt-1">{errors.bankId}</p>
                )}
              </div>
            )}

            {/* Optional Customer Details */}
            {!loadingBanks && !bankError && (
              <div className="mt-4 space-y-3">
                <div>
                  <Label htmlFor="customerEmail">Email (Optional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail || ''}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                    placeholder="your@email.com"
                    disabled={isProcessing}
                    className="mt-1"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              `Complete Order - ${formatCurrency(totalAmount, currency)}`
            )}
          </Button>

          {/* Security Badge */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center text-sm text-gray-600">
              <Lock className="w-4 h-4 mr-1" />
              256-bit SSL Secure Payment
            </div>
            <div className="flex items-center justify-center text-xs text-gray-500">
              Powered by <LeanXIcon className="w-3 h-3 mx-1" /> <span className="font-semibold">LeanX</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
