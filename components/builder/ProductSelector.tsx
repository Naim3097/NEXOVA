'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

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
}

interface ProductSelectorProps {
  onSelect: (product: DatabaseProduct) => void;
}

export default function ProductSelector({ onSelect }: ProductSelectorProps) {
  const [products, setProducts] = useState<DatabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProductId, setSelectedProductId] = useState('');

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

  return (
    <div className="space-y-2">
      <select
        value={selectedProductId}
        onChange={(e) => setSelectedProductId(e.target.value)}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select a product...</option>
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.code} - {product.name} ({product.currency}{' '}
            {product.base_price.toFixed(2)})
            {product.stock === 0 ? ' - Out of Stock' : ''}
          </option>
        ))}
      </select>

      <Button
        type="button"
        onClick={handleAdd}
        disabled={!selectedProductId}
        className="w-full text-sm"
        size="sm"
      >
        Add Selected Product
      </Button>
    </div>
  );
}
