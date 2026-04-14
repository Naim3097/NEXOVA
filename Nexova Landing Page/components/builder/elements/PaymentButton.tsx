import React, { useState } from 'react';
import { PaymentButtonProps, Product } from '@/types';
import { CreditCard, Star } from 'lucide-react';

interface PaymentButtonElementProps {
  props: PaymentButtonProps;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onHover: (hover: boolean) => void;
}

export const PaymentButtonElement: React.FC<PaymentButtonElementProps> = ({
  props,
  isSelected,
  isHovered,
  onSelect,
  onHover,
}) => {
  const {
    products = [],
    currency,
    buttonText,
    buttonColor,
    buttonSize,
    bgColor,
  } = props;

  const displayProducts = products;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    displayProducts.length > 0 ? displayProducts[0] : null
  );
  const hasMultipleProducts = displayProducts.length > 1;
  const hasNoProducts = displayProducts.length === 0;

  // Button size classes
  const sizeClasses = {
    sm: 'px-6 py-2 text-sm',
    md: 'px-8 py-3 text-base',
    lg: 'px-10 py-4 text-lg',
  };

  // Format currency
  const formatCurrency = (value: number, curr: string) => {
    if (curr === 'MYR') {
      return `RM ${value.toFixed(2)}`;
    }
    return `${curr} ${value.toFixed(2)}`;
  };

  return (
    <div
      className={`relative py-16 px-4 transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      } ${isHovered ? 'ring-2 ring-blue-300' : ''}`}
      style={{ backgroundColor: bgColor }}
      onClick={onSelect}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
    >
      {/* Selection indicator */}
      {isSelected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
          Selected
        </div>
      )}

      <div className="max-w-5xl mx-auto">
        {/* Empty State */}
        {hasNoProducts ? (
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg p-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                <CreditCard className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                No Products Added
              </h2>
              <p className="text-gray-600 mb-6">
                Add products from your inventory using the properties panel on the right
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-4 py-2 rounded-lg">
                <CreditCard className="w-4 h-4" />
                <span>Products will appear here</span>
              </div>
            </div>
          </div>
        ) : hasMultipleProducts ? (
          /* Multiple Products Grid */
          <div>
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
              Choose Your Product
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {displayProducts.map((product, index) => (
                <div
                  key={product.id || index}
                  className={`bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer transition-all hover:shadow-xl ${
                    selectedProduct?.id === product.id ? 'ring-2 ring-blue-500' : ''
                  } ${product.featured ? 'transform scale-105' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                  }}
                >
                  {/* Featured Badge */}
                  {product.featured && (
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-center py-2 px-4 text-sm font-semibold flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-current" />
                      Most Popular
                    </div>
                  )}

                  {/* Product Image */}
                  {product.image ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      <CreditCard className="w-16 h-16 text-blue-600" />
                    </div>
                  )}

                  {/* Product Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-gray-600 text-sm mb-4">
                        {product.description}
                      </p>
                    )}
                    <div className="mb-4">
                      <span className="text-3xl font-bold text-gray-900">
                        {formatCurrency(product.price, currency || 'MYR')}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled
                      className={`w-full ${sizeClasses[buttonSize || 'md']} rounded-lg font-semibold transition-all disabled:opacity-100 disabled:cursor-not-allowed shadow-lg`}
                      style={{ backgroundColor: buttonColor, color: 'white' }}
                    >
                      {buttonText || 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : selectedProduct ? (
          /* Single Product Display */
          <div className="max-w-lg mx-auto text-center">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
              {/* Product Image */}
              {selectedProduct.image ? (
                <div className="h-64 overflow-hidden">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                    <CreditCard className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
              )}

              <div className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedProduct.name}
                </h2>

                {selectedProduct.description && (
                  <p className="text-gray-600 mb-4">{selectedProduct.description}</p>
                )}

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {formatCurrency(selectedProduct.price, currency || 'MYR')}
                  </span>
                </div>

                {/* Pay Now Button */}
                <button
                  type="button"
                  disabled
                  className={`${sizeClasses[buttonSize || 'md']} rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-100 disabled:cursor-not-allowed shadow-lg`}
                  style={{ backgroundColor: buttonColor, color: 'white' }}
                >
                  {buttonText || 'Pay Now'}
                </button>

                <p className="text-xs text-gray-500 mt-4">
                  Powered by LeanX - Secure Payment
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {/* Builder Info */}
        {!hasNoProducts && (
          <div className="text-sm text-gray-600 bg-blue-50 rounded-lg p-3 max-w-lg mx-auto mt-6">
            <p className="font-medium text-center">Preview Mode</p>
            <p className="text-xs text-center">
              Customers will see the payment checkout when they click {hasMultipleProducts ? 'a product' : 'this button'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
