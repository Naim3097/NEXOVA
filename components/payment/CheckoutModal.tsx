'use client';

import React, { useState } from 'react';
import { X, Lock, CreditCard as LeanXIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CheckoutFormData } from '@/types';

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
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
  });

  const [addShipping, setAddShipping] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  const shippingCost = 10.00; // Fixed shipping cost
  const totalAmount = addShipping ? amount + shippingCost : amount;

  // Format currency
  const formatCurrency = (value: number, curr: string) => {
    if (curr === 'MYR') {
      return `RM ${value.toFixed(2)}`;
    }
    return `${curr} ${value.toFixed(2)}`;
  };

  // Format card number input (add spaces every 4 digits)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Format expiry date input (MM/YY)
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cardNumber: value });
      setErrors({ ...errors, cardNumber: undefined });
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      setFormData({ ...formData, expiryDate: value });
      setErrors({ ...errors, expiryDate: undefined });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 3 && /^\d*$/.test(value)) {
      setFormData({ ...formData, cvv: value });
      setErrors({ ...errors, cvv: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CheckoutFormData, string>> = {};

    if (formData.cardNumber.length !== 16) {
      newErrors.cardNumber = 'Invalid card number';
    }

    if (formData.expiryDate.length !== 4) {
      newErrors.expiryDate = 'Invalid expiry date';
    }

    if (formData.cvv.length !== 3) {
      newErrors.cvv = 'Invalid CVV';
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

          {/* Payment Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Payment Details</h3>

            <div className="space-y-4">
              {/* Card Number */}
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative mt-1">
                  <Input
                    id="cardNumber"
                    type="text"
                    value={formatCardNumber(formData.cardNumber)}
                    onChange={handleCardNumberChange}
                    placeholder="4242 4242 4242 4242"
                    disabled={isProcessing}
                    className={errors.cardNumber ? 'border-red-500' : ''}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <svg className="w-8 h-5" viewBox="0 0 32 20" fill="none">
                      <rect width="32" height="20" rx="3" fill="#E5E7EB" />
                    </svg>
                  </div>
                </div>
                {errors.cardNumber && (
                  <p className="text-xs text-red-500 mt-1">{errors.cardNumber}</p>
                )}
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    type="text"
                    value={formatExpiryDate(formData.expiryDate)}
                    onChange={handleExpiryChange}
                    placeholder="12/25"
                    disabled={isProcessing}
                    className={errors.expiryDate ? 'border-red-500 mt-1' : 'mt-1'}
                  />
                  {errors.expiryDate && (
                    <p className="text-xs text-red-500 mt-1">{errors.expiryDate}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    type="text"
                    value={formData.cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    disabled={isProcessing}
                    className={errors.cvv ? 'border-red-500 mt-1' : 'mt-1'}
                  />
                  {errors.cvv && (
                    <p className="text-xs text-red-500 mt-1">{errors.cvv}</p>
                  )}
                </div>
              </div>

              {/* Optional Customer Details */}
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
