'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Package, CheckSquare, Square } from 'lucide-react';

interface VariationOption {
  value: string;
  label: string;
  priceAdjustment: number;
  stock: number;
  colorCode?: string;
}

interface Variation {
  id: string;
  name: string;
  type: 'size' | 'color' | 'other';
  options: VariationOption[];
}

interface DatabaseProduct {
  id: string;
  code: string;
  name: string;
  description: string | null;
  image_url: string | null;
  base_price: number;
  currency: string;
  stock: number;
  status: string;
  variations?: Variation[];
}

interface ProductSelectorProps {
  onSelect: (product: DatabaseProduct) => void;
  enableBulkSelect?: boolean;
  onBulkSelect?: (products: DatabaseProduct[]) => void;
}

export default function ProductSelector({
  onSelect,
  enableBulkSelect = false,
  onBulkSelect,
}: ProductSelectorProps) {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [isBulkMode, setIsBulkMode] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok && data.products) {
        // Only show active products with stock
        const activeProducts = data.products.filter(
          (p: DatabaseProduct) => p.status === 'active'
        );
        setProducts(activeProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    const product = products.find((p) => p.id === selectedProductId);
    if (product) {
      onSelect(product);
      setSelectedProductId(''); // Reset selection
    }
  };

  const toggleProductSelection = (productId: string) => {
    setSelectedProductIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleBulkAdd = () => {
    if (selectedProductIds.size === 0 || !onBulkSelect) return;
    const selectedProducts = products.filter((p) =>
      selectedProductIds.has(p.id)
    );
    onBulkSelect(selectedProducts);
    setSelectedProductIds(new Set());
    setIsBulkMode(false);
  };

  const selectAllProducts = () => {
    if (selectedProductIds.size === products.length) {
      setSelectedProductIds(new Set());
    } else {
      setSelectedProductIds(new Set(products.map((p) => p.id)));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-3">
        <div className="inline-block animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
        <p className="text-xs text-gray-500 mt-2">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-4">
        <Package className="mx-auto h-8 w-8 text-gray-400 mb-2" />
        <p className="text-xs text-gray-600 mb-2">No products in inventory</p>
        <a
          href="/dashboard/products"
          target="_blank"
          className="text-xs text-blue-600 hover:underline"
        >
          Create your first product →
        </a>
      </div>
    );
  }

  // Bulk selection mode
  if (enableBulkSelect && isBulkMode) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={selectAllProducts}
            className="text-xs text-blue-600 hover:underline"
          >
            {selectedProductIds.size === products.length
              ? 'Deselect All'
              : 'Select All'}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsBulkMode(false);
              setSelectedProductIds(new Set());
            }}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </div>
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
          {products.map((product) => {
            const isSelected = selectedProductIds.has(product.id);
            const hasVariations =
              product.variations && product.variations.length > 0;
            return (
              <div
                key={product.id}
                onClick={() => toggleProductSelection(product.id)}
                className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${
                  isSelected ? 'bg-blue-50' : ''
                }`}
              >
                {isSelected ? (
                  <CheckSquare className="w-4 h-4 text-blue-600 flex-shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {product.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {product.currency} {product.base_price.toFixed(2)}
                    {hasVariations && (
                      <span className="ml-1 text-blue-600">
                        • {product.variations![0].options.length} variants
                      </span>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <Button
          type="button"
          onClick={handleBulkAdd}
          disabled={selectedProductIds.size === 0}
          className="w-full text-sm"
          size="sm"
        >
          Add {selectedProductIds.size} Product
          {selectedProductIds.size !== 1 ? 's' : ''}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <select
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a product...</option>
        {products.map((product) => {
          const hasVariations =
            product.variations && product.variations.length > 0;
          return (
            <option key={product.id} value={product.id}>
              {product.code} - {product.name} ({product.currency}{' '}
              {product.base_price.toFixed(2)})
              {hasVariations
                ? ` • ${product.variations![0].options.length} variants`
                : ''}
              {product.stock === 0 ? ' - Out of Stock' : ''}
            </option>
          );
        })}
      </select>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={handleAdd}
          disabled={!selectedProductId}
          className="flex-1 text-sm"
          size="sm"
        >
          Add Product
        </Button>
        {enableBulkSelect && (
          <Button
            type="button"
            onClick={() => setIsBulkMode(true)}
            variant="outline"
            className="text-sm"
            size="sm"
          >
            Bulk Add
          </Button>
        )}
      </div>
    </div>
  );
}
