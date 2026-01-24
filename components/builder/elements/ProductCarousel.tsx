import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ShoppingCart,
  Check,
} from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface ProductCarouselProduct {
  id: string;
  code: string;
  name: string;
  description: string | null;
  image_url: string | null;
  base_price: number;
  currency: string;
  status: 'active' | 'inactive';
  variations?: Array<{
    id: string;
    name: string;
    type: 'size' | 'color' | 'other';
    options: Array<{
      value: string;
      label: string;
      priceAdjustment?: number;
      stock?: number;
      colorCode?: string;
    }>;
  }>;
}

export interface ProductCarouselProps {
  title: string;
  subtitle?: string;
  products: ProductCarouselProduct[];
  layout: 'carousel' | 'grid';
  columns: 2 | 3 | 4;
  showPrice: boolean;
  showDescription: boolean;
  cardStyle: 'minimal' | 'bordered' | 'shadow';
  bgColor: string;
  textColor: string;
  priceColor: string;
  // Background image options
  backgroundImage?: string;
  backgroundOpacity?: number;
  // Add to cart options
  showAddToCart?: boolean;
  addToCartButtonColor?: string;
  addToCartButtonText?: string;
}

interface ProductCarouselElementProps {
  props: ProductCarouselProps;
  isSelected?: boolean;
  isHovered?: boolean;
  onSelect?: () => void;
  onHover?: (hovering: boolean) => void;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

export const ProductCarouselElement = React.memo(
  ({
    props,
    isSelected,
    isHovered,
    onSelect,
    onHover,
    viewportMode = 'desktop',
  }: ProductCarouselElementProps) => {
    const {
      title,
      subtitle,
      products = [],
      layout = 'carousel',
      columns = 3,
      showPrice = true,
      showDescription = true,
      cardStyle = 'shadow',
      bgColor = '#ffffff',
      textColor = '#1f2937',
      priceColor = '#2563eb',
      backgroundImage,
      backgroundOpacity = 70,
      showAddToCart = true,
      addToCartButtonColor = '#111827',
      addToCartButtonText = 'Add to Cart',
    } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    // Track selected variants per product: { productId: variantValue }
    const [selectedVariants, setSelectedVariants] = useState<
      Record<string, string>
    >({});
    // Track dropdown open state per product
    const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>(
      {}
    );
    // Track "added" animation state
    const [addedStates, setAddedStates] = useState<Record<string, boolean>>({});

    const cart = useCart();

    // Determine grid columns based on viewport mode and column setting
    const getGridCols = () => {
      if (viewportMode === 'mobile') return 'grid-cols-1';
      if (viewportMode === 'tablet')
        return columns >= 3 ? 'grid-cols-2' : 'grid-cols-2';
      return `grid-cols-${columns}`;
    };

    const getCardClasses = () => {
      switch (cardStyle) {
        case 'minimal':
          return 'bg-white';
        case 'bordered':
          return 'bg-white border border-gray-200';
        case 'shadow':
        default:
          return 'bg-white shadow-lg';
      }
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

    const handlePrev = (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    };

    const handleNext = (e: React.MouseEvent) => {
      e.stopPropagation();
      const maxIndex = Math.max(0, products.length - columns);
      setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
    };

    const visibleProducts =
      layout === 'carousel'
        ? products.slice(currentIndex, currentIndex + columns)
        : products;

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < products.length - columns;

    // Get the effective price for a product with selected variant
    const getEffectivePrice = (product: ProductCarouselProduct) => {
      const selectedVariant = selectedVariants[product.id];
      if (!selectedVariant || !product.variations) {
        return product.base_price;
      }

      for (const variation of product.variations) {
        const option = variation.options.find(
          (opt) => opt.value === selectedVariant
        );
        if (option && option.priceAdjustment) {
          return product.base_price + option.priceAdjustment;
        }
      }
      return product.base_price;
    };

    // Get all variant options for a product (flattened)
    const getVariantOptions = (product: ProductCarouselProduct) => {
      if (!product.variations || product.variations.length === 0) return [];
      // For simplicity, use the first variation (usually size)
      const variation = product.variations[0];
      return variation.options;
    };

    // Handle variant selection
    const handleSelectVariant = (productId: string, variantValue: string) => {
      setSelectedVariants((prev) => ({
        ...prev,
        [productId]: variantValue,
      }));
      setOpenDropdowns((prev) => ({
        ...prev,
        [productId]: false,
      }));
    };

    // Toggle dropdown
    const toggleDropdown = (productId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setOpenDropdowns((prev) => ({
        ...prev,
        [productId]: !prev[productId],
      }));
    };

    // Clear selected variant
    const handleClearVariant = (productId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedVariants((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    };

    // Handle add to cart
    const handleAddToCart = (
      product: ProductCarouselProduct,
      e: React.MouseEvent
    ) => {
      e.stopPropagation();

      const hasVariations = product.variations && product.variations.length > 0;
      const selectedVariant = selectedVariants[product.id];

      // If product has variations but none selected, show dropdown
      if (hasVariations && !selectedVariant) {
        setOpenDropdowns((prev) => ({
          ...prev,
          [product.id]: true,
        }));
        return;
      }

      const price = getEffectivePrice(product);
      const variantKey = selectedVariant
        ? `${product.id}-${selectedVariant}`
        : product.id;
      const variantLabel = selectedVariant
        ? getVariantOptions(product).find(
            (opt) => opt.value === selectedVariant
          )?.label
        : undefined;

      cart.addToCart({
        productId: product.id,
        productName: product.name,
        variantKey,
        variantLabel,
        price,
      });

      // Show "added" state briefly
      setAddedStates((prev) => ({ ...prev, [product.id]: true }));
      setTimeout(() => {
        setAddedStates((prev) => ({ ...prev, [product.id]: false }));
      }, 1500);
    };

    // Format currency
    const formatCurrency = (price: number, currency: string) => {
      if (currency === 'RM' || currency === 'MYR') {
        return `RM${price.toFixed(2)}`;
      }
      return `${currency} ${price.toFixed(2)}`;
    };

    return (
      <section
        className={`${baseClasses} py-16 px-4 cursor-pointer overflow-hidden`}
        style={{ backgroundColor: bgColor }}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Background Image */}
        {backgroundImage && (
          <>
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${backgroundImage}")` }}
            />
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: bgColor,
                opacity: backgroundOpacity / 100,
              }}
            />
          </>
        )}

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold mb-4"
              style={{ color: textColor }}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className="text-lg opacity-80 max-w-2xl mx-auto"
                style={{ color: textColor }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Products */}
          {products.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500 text-lg">No products selected</p>
              <p className="text-gray-400 text-sm mt-2">
                Add products from your inventory in the properties panel
              </p>
            </div>
          ) : (
            <div className="relative">
              {/* Carousel Navigation */}
              {layout === 'carousel' && products.length > columns && (
                <>
                  <button
                    onClick={handlePrev}
                    disabled={!canGoPrev}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center ${
                      canGoPrev
                        ? 'hover:bg-gray-100'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center ${
                      canGoNext
                        ? 'hover:bg-gray-100'
                        : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Product Grid */}
              <div className={`grid ${getGridCols()} gap-6`}>
                {visibleProducts.map((product) => {
                  const hasVariations =
                    product.variations && product.variations.length > 0;
                  const variantOptions = getVariantOptions(product);
                  const selectedVariant = selectedVariants[product.id];
                  const isDropdownOpen = openDropdowns[product.id];
                  const isAdded = addedStates[product.id];
                  const effectivePrice = getEffectivePrice(product);
                  const selectedOption = variantOptions.find(
                    (opt) => opt.value === selectedVariant
                  );

                  return (
                    <div
                      key={product.id}
                      className={`${getCardClasses()} rounded-xl overflow-hidden transition-transform hover:scale-[1.02]`}
                    >
                      {/* Product Image */}
                      <div className="aspect-square bg-gray-100 relative overflow-hidden">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <svg
                              className="w-16 h-16"
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
                          </div>
                        )}
                        {/* Discount Badge (if base_price differs from sale price) */}
                        {product.base_price < 69 && (
                          <div className="absolute top-3 left-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                            -43%
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4">
                        {/* Variant Selector Dropdown */}
                        {hasVariations && showAddToCart && (
                          <div className="relative mb-3">
                            <button
                              onClick={(e) => toggleDropdown(product.id, e)}
                              className="w-full flex items-center justify-between px-4 py-3 border border-gray-300 rounded-lg text-left hover:border-gray-400 transition-colors"
                            >
                              <span
                                className={
                                  selectedVariant
                                    ? 'text-gray-900'
                                    : 'text-gray-500'
                                }
                              >
                                {selectedOption?.label || 'Choose an option'}
                              </span>
                              <ChevronDown
                                className={`w-5 h-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                              />
                            </button>

                            {/* Dropdown Options */}
                            {isDropdownOpen && (
                              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 max-h-48 overflow-y-auto">
                                {variantOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSelectVariant(
                                        product.id,
                                        option.value
                                      );
                                    }}
                                    className={`w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between ${
                                      selectedVariant === option.value
                                        ? 'bg-blue-50 text-blue-600'
                                        : ''
                                    }`}
                                  >
                                    <span>{option.label}</span>
                                    {option.priceAdjustment &&
                                      option.priceAdjustment !== 0 && (
                                        <span className="text-sm text-gray-500">
                                          {option.priceAdjustment > 0
                                            ? '+'
                                            : ''}
                                          {formatCurrency(
                                            option.priceAdjustment,
                                            product.currency
                                          )}
                                        </span>
                                      )}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Clear Selection */}
                            {selectedVariant && (
                              <button
                                onClick={(e) =>
                                  handleClearVariant(product.id, e)
                                }
                                className="mt-2 text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
                              >
                                <span>✕</span> Clear
                              </button>
                            )}
                          </div>
                        )}

                        <h3
                          className="font-semibold text-lg mb-1"
                          style={{ color: textColor }}
                        >
                          {product.name}
                        </h3>

                        {showDescription && product.description && (
                          <p
                            className="text-sm opacity-70 mb-3 line-clamp-2"
                            style={{ color: textColor }}
                          >
                            {product.description}
                          </p>
                        )}

                        {showPrice && (
                          <div className="mb-3">
                            {hasVariations && !selectedVariant ? (
                              // Show price range when no variant selected
                              <p
                                className="font-bold text-lg"
                                style={{ color: priceColor }}
                              >
                                {formatCurrency(
                                  product.base_price,
                                  product.currency
                                )}
                                {variantOptions.some(
                                  (opt) =>
                                    opt.priceAdjustment &&
                                    opt.priceAdjustment > 0
                                ) && (
                                  <span>
                                    {' '}
                                    -{' '}
                                    {formatCurrency(
                                      product.base_price +
                                        Math.max(
                                          ...variantOptions.map(
                                            (opt) => opt.priceAdjustment || 0
                                          )
                                        ),
                                      product.currency
                                    )}
                                  </span>
                                )}
                              </p>
                            ) : (
                              // Show specific price when variant selected or no variations
                              <p
                                className="font-bold text-lg"
                                style={{ color: priceColor }}
                              >
                                {product.base_price !== effectivePrice && (
                                  <span className="text-gray-400 line-through text-base mr-2">
                                    RM69.00
                                  </span>
                                )}
                                {formatCurrency(
                                  effectivePrice,
                                  product.currency
                                )}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Add to Cart Button */}
                        {showAddToCart && (
                          <button
                            onClick={(e) => handleAddToCart(product, e)}
                            disabled={isAdded}
                            className={`w-full py-3 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                              isAdded ? 'bg-green-500' : 'hover:opacity-90'
                            }`}
                            style={{
                              backgroundColor: isAdded
                                ? undefined
                                : addToCartButtonColor,
                            }}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-5 h-5" />
                                Added!
                              </>
                            ) : hasVariations && !selectedVariant ? (
                              'Select Options'
                            ) : (
                              <>
                                <ShoppingCart className="w-5 h-5" />
                                {addToCartButtonText}
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Carousel Dots */}
              {layout === 'carousel' && products.length > columns && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({
                    length: Math.ceil(products.length / columns),
                  }).map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(index * columns);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        Math.floor(currentIndex / columns) === index
                          ? 'bg-blue-500'
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }
);

ProductCarouselElement.displayName = 'ProductCarouselElement';
