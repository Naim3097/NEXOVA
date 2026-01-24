import React, { useState, useMemo } from 'react';
import {
  Shield,
  Minus,
  Plus,
  CreditCard,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Product, ProductVariation, BundlePricingTier } from '@/types';

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
  ({
    props,
    isSelected,
    isHovered,
    onSelect,
    onHover,
  }: FormWithPaymentElementProps) => {
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
    // For products with variations: key is "productId-variationValue"
    // For products without variations: key is just "productId"
    const [quantities, setQuantities] = useState<Record<string, number>>({});
    // Track expanded products (to show variant grid)
    const [expandedProducts, setExpandedProducts] = useState<
      Record<string, boolean>
    >({});

    const selectedCountry =
      countryCodes.find((c) => c.code === defaultCountryCode) ||
      countryCodes[0];

    // Get price adjustment for a specific variation option
    const getVariationPriceAdjustment = (
      product: Product,
      variationValue?: string
    ): number => {
      if (
        !product.variations ||
        product.variations.length === 0 ||
        !variationValue
      )
        return 0;

      for (const variation of product.variations) {
        const option = variation.options.find(
          (opt) => opt.value === variationValue
        );
        if (option && option.priceAdjustment) {
          return option.priceAdjustment;
        }
      }
      return 0;
    };

    // Get effective price for product with optional variation
    const getEffectivePrice = (
      product: Product,
      variationValue?: string
    ): number => {
      return (
        product.price + getVariationPriceAdjustment(product, variationValue)
      );
    };

    // Toggle product expansion
    const toggleProductExpand = (productId: string) => {
      setExpandedProducts((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
    };

    // Get total quantity for a product (sum of all variants)
    const getProductTotalQty = (product: Product): number => {
      if (!product.variations || product.variations.length === 0) {
        return quantities[product.id || ''] || 0;
      }
      // Sum all variant quantities
      let total = 0;
      for (const variation of product.variations) {
        for (const option of variation.options) {
          const key = `${product.id}-${option.value}`;
          total += quantities[key] || 0;
        }
      }
      return total;
    };

    // Get total amount for a product with variants
    const getProductVariantTotal = (product: Product): number => {
      if (!product.variations || product.variations.length === 0) {
        return 0;
      }
      let variantTotal = 0;
      for (const variation of product.variations) {
        for (const option of variation.options) {
          const key = `${product.id}-${option.value}`;
          const qty = quantities[key] || 0;
          const variantPrice = product.price + (option.priceAdjustment || 0);
          variantTotal += variantPrice * qty;
        }
      }
      return variantTotal;
    };

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

    // Get bundle price for a product and quantity (uses base price for bundle calculation)
    const getBundlePrice = (
      product: Product,
      qty: number,
      basePrice?: number
    ): { bundlePrice: number | null; originalPrice: number } => {
      const price = basePrice ?? product.price;
      const originalPrice = price * qty;

      if (
        !product.bundlePricing ||
        product.bundlePricing.length === 0 ||
        qty === 0
      ) {
        return { bundlePrice: null, originalPrice };
      }

      // Find exact bundle match
      const exactBundle = product.bundlePricing.find((b) => b.quantity === qty);
      if (exactBundle) {
        return { bundlePrice: exactBundle.totalPrice, originalPrice };
      }

      // Find the best bundle combination
      // Sort bundles by quantity descending for greedy algorithm
      const sortedBundles = [...product.bundlePricing].sort(
        (a, b) => b.quantity - a.quantity
      );

      let remaining = qty;
      let bundleTotal = 0;
      let usedBundles = false;

      for (const bundle of sortedBundles) {
        while (remaining >= bundle.quantity) {
          bundleTotal += bundle.totalPrice;
          remaining -= bundle.quantity;
          usedBundles = true;
        }
      }

      // Add remaining items at regular price
      if (remaining > 0) {
        bundleTotal += price * remaining;
      }

      return {
        bundlePrice: usedBundles ? bundleTotal : null,
        originalPrice,
      };
    };

    // Calculate total from quantities (including variation price adjustments and bundle pricing)
    const { total, originalTotal, hasBundleDiscount } = useMemo(() => {
      let calculatedTotal = 0;
      let calculatedOriginal = 0;
      let hasDiscount = false;

      products.forEach((product) => {
        if (!product.variations || product.variations.length === 0) {
          // No variations - simple calculation
          const qty = quantities[product.id || ''] || 0;
          const { bundlePrice, originalPrice } = getBundlePrice(
            product,
            qty,
            product.price
          );

          calculatedOriginal += originalPrice;
          if (bundlePrice !== null && bundlePrice < originalPrice) {
            calculatedTotal += bundlePrice;
            hasDiscount = true;
          } else {
            calculatedTotal += originalPrice;
          }
        } else {
          // Has variations - calculate each variant separately
          // Sum up total quantity across all variants for bundle pricing
          let totalProductQty = 0;
          let totalVariantPrice = 0;

          for (const variation of product.variations) {
            for (const option of variation.options) {
              const key = `${product.id}-${option.value}`;
              const qty = quantities[key] || 0;
              totalProductQty += qty;
              const variantPrice =
                product.price + (option.priceAdjustment || 0);
              totalVariantPrice += variantPrice * qty;
            }
          }

          calculatedOriginal += totalVariantPrice;

          // Apply bundle pricing based on total quantity
          const { bundlePrice, originalPrice } = getBundlePrice(
            product,
            totalProductQty,
            product.price
          );

          if (
            bundlePrice !== null &&
            bundlePrice < originalPrice &&
            totalProductQty > 0
          ) {
            // Calculate the discount ratio and apply it
            const discountRatio = bundlePrice / originalPrice;
            calculatedTotal += totalVariantPrice * discountRatio;
            hasDiscount = true;
          } else {
            calculatedTotal += totalVariantPrice;
          }
        }
      });

      return {
        total: calculatedTotal,
        originalTotal: calculatedOriginal,
        hasBundleDiscount: hasDiscount,
      };
    }, [products, quantities]);

    // Handle quantity change - key can be "productId" or "productId-variationValue"
    const handleQuantityChange = (
      key: string,
      delta: number,
      stock?: number
    ) => {
      setQuantities((prev) => {
        const current = prev[key] || 0;
        let newQty = Math.max(0, current + delta);
        // Respect stock limit if defined
        if (stock !== undefined && newQty > stock) {
          newQty = stock;
        }
        return { ...prev, [key]: newQty };
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
              handleQuantityChange(product.id || '', -1);
            }}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium">
            {quantities[product.id || ''] || 0}
          </span>
          <button
            type="button"
            className="px-3 py-2 text-gray-500 hover:bg-gray-100 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              handleQuantityChange(product.id || '', 1, product.stock);
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
      const qty = quantities[product.id || ''] || 0;
      if (qty === 0) {
        return formatCurrency(0);
      }

      const { bundlePrice, originalPrice } = getBundlePrice(product, qty);

      // If bundle price is cheaper, show strikethrough
      if (bundlePrice !== null && bundlePrice < originalPrice) {
        return (
          <div className="text-right">
            <span className="text-gray-400 line-through text-sm block">
              {formatCurrency(originalPrice)}
            </span>
            <span className="text-green-600 font-semibold">
              {formatCurrency(bundlePrice)}
            </span>
          </div>
        );
      }

      return formatCurrency(originalPrice);
    };

    // Render variant grid for a product
    const renderVariantGrid = (product: Product) => {
      if (!product.variations || product.variations.length === 0) return null;

      const isExpanded = expandedProducts[product.id || ''];
      if (!isExpanded) return null;

      return (
        <div className="mt-3 pt-3 border-t border-gray-200">
          {product.variations.map((variation) => (
            <div key={variation.id} className="mb-3 last:mb-0">
              <div className="text-xs font-medium text-gray-500 mb-2">
                {variation.name}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {variation.options.map((option) => {
                  const key = `${product.id}-${option.value}`;
                  const qty = quantities[key] || 0;
                  const variantPrice =
                    product.price + (option.priceAdjustment || 0);

                  return (
                    <div
                      key={option.value}
                      className="flex items-center justify-between bg-gray-50 rounded-md px-2 py-1.5"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {option.label}
                        </div>
                        <div className="text-xs text-blue-600">
                          {formatCurrency(variantPrice)}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 border border-gray-300 rounded bg-white ml-2">
                        <button
                          type="button"
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(key, -1, option.stock);
                          }}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-sm font-medium">
                          {qty}
                        </span>
                        <button
                          type="button"
                          className="px-2 py-1 text-gray-500 hover:bg-gray-100 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(key, 1, option.stock);
                          }}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      );
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
              {title && (
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {title}
                </h2>
              )}
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
              {products.map((product) => {
                const hasVariations =
                  product.variations && product.variations.length > 0;
                const isExpanded = expandedProducts[product.id || ''];
                const totalQty = getProductTotalQty(product);

                return (
                  <div
                    key={product.id}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    {/* Product Header Row */}
                    <div
                      className={`grid grid-cols-12 gap-4 px-4 py-4 items-start ${hasVariations ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                      onClick={(e) => {
                        if (hasVariations) {
                          e.stopPropagation();
                          toggleProductExpand(product.id || '');
                        }
                      }}
                    >
                      <div className="col-span-5">
                        <div className="flex items-center gap-2">
                          {hasVariations && (
                            <span className="text-gray-400">
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </span>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">
                              {product.name}
                            </div>
                            <div className="text-blue-600 text-sm font-medium">
                              {formatCurrency(product.price)}
                              {hasVariations && (
                                <span className="text-gray-400 text-xs ml-1">
                                  (tap to select size)
                                </span>
                              )}
                            </div>
                            {/* Bundle Pricing Info */}
                            {product.bundlePricing &&
                              product.bundlePricing.length > 0 && (
                                <div className="mt-1 text-xs text-green-600">
                                  {product.bundlePricing
                                    .slice(0, 3)
                                    .map((bundle, i) => (
                                      <span key={i}>
                                        Buy {bundle.quantity} ={' '}
                                        {formatCurrency(bundle.totalPrice)}
                                        {i <
                                          Math.min(
                                            product.bundlePricing!.length,
                                            3
                                          ) -
                                            1 && ' | '}
                                      </span>
                                    ))}
                                </div>
                              )}
                          </div>
                        </div>
                      </div>
                      <div className="col-span-4 flex justify-center pt-1">
                        {hasVariations ? (
                          // Show total qty summary for products with variants
                          <div className="text-center">
                            {totalQty > 0 ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                {totalQty} selected
                              </span>
                            ) : (
                              <span className="text-sm text-gray-400">
                                Select sizes below
                              </span>
                            )}
                          </div>
                        ) : (
                          // Regular quantity selector for products without variants
                          renderStockStatus(product)
                        )}
                      </div>
                      <div className="col-span-3 text-right text-gray-900 font-medium pt-1">
                        {hasVariations
                          ? formatCurrency(getProductVariantTotal(product))
                          : renderProductAmount(product)}
                      </div>
                    </div>
                    {/* Variant Grid (expandable) */}
                    {hasVariations && (
                      <div className="px-4 pb-4">
                        {renderVariantGrid(product)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty State for Products */}
          {hasNoProducts && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Products Added
              </h3>
              <p className="text-gray-500">
                Add products from your inventory using the properties panel on
                the right
              </p>
            </div>
          )}

          {/* Total Amount */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border-l-4 border-blue-500">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900">
                Total Amount:
              </span>
              <div className="text-right">
                {hasBundleDiscount && originalTotal > total ? (
                  <>
                    <span className="text-gray-400 line-through text-base block">
                      {formatCurrency(originalTotal)}
                    </span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(total)}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(total)}
                  </span>
                )}
              </div>
            </div>
            {hasBundleDiscount && originalTotal > total && (
              <div className="mt-2 flex items-center justify-end gap-2">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  You save {formatCurrency(originalTotal - total)}!
                </span>
              </div>
            )}
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
            <a
              href={termsUrl}
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Terms & Conditions
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={policyUrl}
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Policy
            </a>
            <span className="text-gray-300">|</span>
            <a
              href={contactUrl}
              className="text-blue-600 hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Contact Us
            </a>
          </div>

          {/* Company Info */}
          <div className="text-center text-gray-500 text-sm mt-4">
            <p>
              &copy; {new Date().getFullYear()} {companyName}.
            </p>
            <p>{companyRegistration}</p>
          </div>
        </div>
      </section>
    );
  }
);

FormWithPaymentElement.displayName = 'FormWithPaymentElement';
