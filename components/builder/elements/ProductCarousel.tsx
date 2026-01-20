import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  ({ props, isSelected, isHovered, onSelect, onHover, viewportMode = 'desktop' }: ProductCarouselElementProps) => {
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
    } = props;

    const [currentIndex, setCurrentIndex] = React.useState(0);

    // Determine grid columns based on viewport mode and column setting
    const getGridCols = () => {
      if (viewportMode === 'mobile') return 'grid-cols-1';
      if (viewportMode === 'tablet') return columns >= 3 ? 'grid-cols-2' : 'grid-cols-2';
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

    const visibleProducts = layout === 'carousel'
      ? products.slice(currentIndex, currentIndex + columns)
      : products;

    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < products.length - columns;

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
            <h2 className="text-3xl font-bold mb-4" style={{ color: textColor }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-lg opacity-80 max-w-2xl mx-auto" style={{ color: textColor }}>
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
                      canGoPrev ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center ${
                      canGoNext ? 'hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </>
              )}

              {/* Product Grid */}
              <div className={`grid ${getGridCols()} gap-6`}>
                {visibleProducts.map((product) => (
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
                          <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1" style={{ color: textColor }}>
                        {product.name}
                      </h3>

                      {showDescription && product.description && (
                        <p className="text-sm opacity-70 mb-3 line-clamp-2" style={{ color: textColor }}>
                          {product.description}
                        </p>
                      )}

                      {/* Variations Preview */}
                      {product.variations && product.variations.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-2">
                          {product.variations.map((variation) => (
                            <div key={variation.id} className="text-xs">
                              {variation.type === 'color' ? (
                                <div className="flex gap-1">
                                  {variation.options.slice(0, 4).map((opt) => (
                                    <div
                                      key={opt.value}
                                      className="w-4 h-4 rounded-full border border-gray-300"
                                      style={{ backgroundColor: opt.colorCode || '#ccc' }}
                                      title={opt.label}
                                    />
                                  ))}
                                  {variation.options.length > 4 && (
                                    <span className="text-gray-500 ml-1">+{variation.options.length - 4}</span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-gray-500">
                                  {variation.options.length} {variation.name.toLowerCase()}s
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {showPrice && (
                        <p className="font-bold text-lg" style={{ color: priceColor }}>
                          {product.currency} {product.base_price.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Carousel Dots */}
              {layout === 'carousel' && products.length > columns && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: Math.ceil(products.length / columns) }).map((_, index) => (
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
