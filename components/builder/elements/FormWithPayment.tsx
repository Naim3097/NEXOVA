import React, { useState } from 'react';
import { Shield, Minus, Plus, CreditCard } from 'lucide-react';
import { Product } from '@/types';

interface FormWithPaymentElementProps {
  props: {
    title?: string;
    description?: string;
    nameLabel?: string;
    mobileLabel?: string;
    emailLabel?: string;
    showName?: boolean;
    showMobile?: boolean;
    showEmail?: boolean;
    nameRequired?: boolean;
    mobileRequired?: boolean;
    emailRequired?: boolean;
    defaultCountryCode?: string;
    products?: Product[];
    currency?: string;
    submitButtonText?: string;
    submitButtonColor?: string;
    bgColor?: string;
    termsUrl?: string;
    policyUrl?: string;
    contactUrl?: string;
    companyName?: string;
    companyRegistration?: string;
  };
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
}

// Country codes for mobile number
const countryCodes = [
  { code: 'MY', dial: '+60', flag: '🇲🇾' },
  { code: 'SG', dial: '+65', flag: '🇸🇬' },
  { code: 'ID', dial: '+62', flag: '🇮🇩' },
  { code: 'TH', dial: '+66', flag: '🇹🇭' },
  { code: 'PH', dial: '+63', flag: '🇵🇭' },
  { code: 'VN', dial: '+84', flag: '🇻🇳' },
  { code: 'US', dial: '+1', flag: '🇺🇸' },
  { code: 'GB', dial: '+44', flag: '🇬🇧' },
];

export const FormWithPaymentElement = React.memo(
  ({ props, isSelected, isHovered, onSelect, onHover }: FormWithPaymentElementProps) => {
    const {
      title = 'Order Form',
      description,
      nameLabel = 'Name',
      mobileLabel = 'Mobile Number',
      emailLabel = 'Email',
      showName = true,
      showMobile = true,
      showEmail = true,
      nameRequired = true,
      mobileRequired = true,
      emailRequired = true,
      defaultCountryCode = 'MY',
      products = [],
      currency = 'MYR',
      submitButtonText = 'Complete Payment',
      submitButtonColor = '#ef4444',
      bgColor = '#ffffff',
      termsUrl = '#',
      policyUrl = '#',
      contactUrl = '#',
      companyName = 'Your Company Name',
      companyRegistration = 'Company Registration Number',
    } = props;

    // Preview state for quantities (builder preview only)
    const [quantities, setQuantities] = useState<Record<string, number>>({});

    const selectedCountry = countryCodes.find(c => c.code === defaultCountryCode) || countryCodes[0];

    const baseClasses = `relative transition-all ${
      isSelected ? 'ring-4 ring-blue-500' : ''
    } ${isHovered ? 'ring-2 ring-blue-300' : ''}`;

    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect?.();
    };

    const handleMouseEnter = () => onHover?.(true);
    const handleMouseLeave = () => onHover?.(false);

    // Format currency
    const formatCurrency = (value: number) => {
      if (currency === 'MYR') {
        return `RM ${value.toFixed(2)}`;
      }
      return `${currency} ${value.toFixed(2)}`;
    };

    // Calculate total from quantities
    const total = products.reduce((sum, product) => {
      const qty = quantities[product.id] || 0;
      return sum + (product.price * qty);
    }, 0);

    const handleQuantityChange = (productId: string, delta: number, stock?: number) => {
      setQuantities(prev => {
        const current = prev[productId] || 0;
        let newQty = Math.max(0, current + delta);
        // Respect stock limit if defined
        if (stock !== undefined && newQty > stock) {
          newQty = stock;
        }
        return { ...prev, [productId]: newQty };
      });
    };

    const renderStockStatus = (product: Product) => {
      // Check if out of stock
      if (product.stock !== undefined && product.stock <= 0) {
        return (
          <span className="text-red-500 font-medium text-sm">Out of Stock</span>
        );
      }

      // In stock - show quantity selector
      return (
        <div className="flex items-center gap-2 border border-gray-300 rounded-md">
          <button
            type="button"
            className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(product.id, -1);
            }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium">
            {quantities[product.id] || 0}
          </span>
          <button
            type="button"
            className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(product.id, 1, product.stock);
            }}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      );
    };

    const renderProductAmount = (product: Product) => {
      // Out of stock
      if (product.stock !== undefined && product.stock <= 0) {
        return <span className="text-gray-400">-</span>;
      }
      const qty = quantities[product.id] || 0;
      return formatCurrency(product.price * qty);
    };

    const hasNoProducts = products.length === 0;

    return (
      <section
        className={`${baseClasses} py-8 px-4 cursor-pointer`}
        style={{ backgroundColor: bgColor }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          {(title || description) && (
            <div className="text-center mb-6">
              {title && <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>}
              {description && <p className="text-gray-600">{description}</p>}
            </div>
          )}

          {/* Customer Info Fields */}
          <div className="space-y-4 mb-6">
            {/* Name Field */}
            {showName && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  {nameLabel}
                  {nameRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your name"
                  disabled
                />
              </div>
            )}

            {/* Mobile Number Field */}
            {showMobile && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  {mobileLabel}
                  {mobileRequired && <span className="text-red-500">*</span>}
                </label>
                <div className="flex">
                  <div className="flex items-center gap-2 px-3 py-3 border border-r-0 border-gray-300 rounded-l-lg bg-gray-50">
                    <span className="text-lg">{selectedCountry.flag}</span>
                    <span className="text-gray-600 text-sm">&#9660;</span>
                  </div>
                  <input
                    type="tel"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="012-345 6789"
                    disabled
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            {showEmail && (
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-1.5">
                  {emailLabel}
                  {emailRequired && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="your@email.com"
                  disabled
                />
              </div>
            )}
          </div>

          {/* Products Table */}
          {!hasNoProducts && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-6">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200">
                <div className="col-span-5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Item
                </div>
                <div className="col-span-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                  Qty
                </div>
                <div className="col-span-3 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Amount
                </div>
              </div>

              {/* Table Body */}
              {products.map((product) => (
                <div
                  key={product.id}
                  className="grid grid-cols-12 gap-4 px-4 py-4 border-b border-gray-100 last:border-b-0 items-center"
                >
                  <div className="col-span-5">
                    <div className="font-medium text-gray-900">{product.name}</div>
                    <div className="text-blue-600 text-sm font-medium">
                      {formatCurrency(product.price)}
                    </div>
                  </div>
                  <div className="col-span-4 flex justify-center">
                    {renderStockStatus(product)}
                  </div>
                  <div className="col-span-3 text-right text-gray-900 font-medium">
                    {renderProductAmount(product)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State for Products */}
          {hasNoProducts && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Products Added</h3>
              <p className="text-gray-500">Add products from your inventory using the properties panel on the right</p>
            </div>
          )}

          {/* Total Amount */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total Amount:</span>
              <span>{formatCurrency(total)}</span>
            </div>
            {total === 0 && (
              <p className="text-gray-500 text-sm mt-2">
                Please select your items above.
              </p>
            )}
          </div>

          {/* Security Badge */}
          <div className="flex items-center justify-center gap-2 text-gray-500 text-sm mb-6">
            <Shield className="w-5 h-5 text-green-500" />
            <span>Your payment is secured & encrypted</span>
          </div>

          {/* Submit Button */}
          <button
            type="button"
            className="w-full py-4 rounded-lg font-semibold text-white shadow-lg transition-transform hover:scale-[1.02] text-lg"
            style={{ backgroundColor: submitButtonColor }}
            onClick={(e) => e.stopPropagation()}
            disabled
          >
            {submitButtonText}
          </button>

          {/* Footer Links */}
          <div className="flex items-center justify-center gap-4 mt-6 text-sm">
            <a href={termsUrl} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
              Terms & Conditions
            </a>
            <span className="text-gray-300">|</span>
            <a href={policyUrl} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
              Policy
            </a>
            <span className="text-gray-300">|</span>
            <a href={contactUrl} className="text-blue-600 hover:underline" onClick={(e) => e.stopPropagation()}>
              Contact Us
            </a>
          </div>

          {/* Company Info */}
          <div className="text-center text-gray-500 text-sm mt-4">
            <p>&copy; {new Date().getFullYear()} {companyName}.</p>
            <p>{companyRegistration}</p>
          </div>
        </div>
      </section>
    );
  }
);

FormWithPaymentElement.displayName = 'FormWithPaymentElement';
