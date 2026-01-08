'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import type { BumpOfferData } from '@/types';

interface BumpOfferModalProps {
  isOpen: boolean;
  bumpOffer: BumpOfferData;
  currency: string;
  onAccept: () => void;
  onDecline: () => void;
  isProcessing?: boolean;
}

export const BumpOfferModal: React.FC<BumpOfferModalProps> = ({
  isOpen,
  bumpOffer,
  currency,
  onAccept,
  onDecline,
  isProcessing = false,
}) => {
  // Format currency
  const formatCurrency = (value: number, curr: string) => {
    if (curr === 'MYR') {
      return `RM ${value.toFixed(2)}`;
    }
    return `${curr} ${value.toFixed(2)}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Red Banner */}
        <div className="bg-red-600 text-white text-center py-3 px-6">
          <p className="font-bold text-sm sm:text-base">
            WAIT! YOUR ORDER IS NOT COMPLETE YET...
          </p>
        </div>

        <div className="p-6 sm:p-8">
          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-4">
            Add This Special Offer?
          </h2>

          {/* Description */}
          <p className="text-center text-gray-700 text-base sm:text-lg mb-6">
            {bumpOffer.description}
          </p>

          {/* Product Card */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-6 mb-6">
            {/* Image Placeholder */}
            <div className="bg-gray-200 rounded-lg h-48 sm:h-64 flex items-center justify-center mb-4">
              <div className="text-center">
                <svg
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-400 mb-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <p className="text-sm text-gray-500">Product Image</p>
              </div>
            </div>

            {/* Product Name */}
            <h3 className="text-xl font-bold text-gray-900 text-center mb-4">
              {bumpOffer.name}
            </h3>

            {/* Pricing */}
            <div className="text-center mb-6">
              <p className="text-gray-600 line-through text-lg mb-1">
                {formatCurrency(bumpOffer.originalPrice, currency)}
              </p>
              <div className="flex items-center justify-center gap-3">
                <p className="text-4xl font-bold text-red-600">
                  {formatCurrency(bumpOffer.discountedPrice, currency)}
                </p>
                {bumpOffer.discount > 0 && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
                    {bumpOffer.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Accept Button */}
            <Button
              onClick={onAccept}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Adding...
                </span>
              ) : (
                'Yes! Add To My Order'
              )}
            </Button>
          </div>

          {/* Decline Link */}
          <div className="text-center">
            <button
              onClick={onDecline}
              disabled={isProcessing}
              className="text-gray-600 hover:text-gray-800 text-sm underline disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No thanks, I'll pass on this discount
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-center text-gray-500 mt-6">
            This is a one-time offer only available on this page.
          </p>
        </div>
      </div>
    </div>
  );
};
