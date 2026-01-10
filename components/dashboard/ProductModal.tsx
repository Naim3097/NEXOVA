'use client';

import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Product {
  id: string;
  code: string;
  name: string;
  description: string | null;
  image_url: string | null;
  stock: number;
  base_price: number;
  currency: string;
  quantity_pricing: Array<{ min_qty: number; price: number }>;
  notes: string | null;
  status: 'active' | 'inactive';
}

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductModal({
  product,
  isOpen,
  onClose,
  onSave,
}: ProductModalProps) {
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    image_url: '',
    stock: 0,
    base_price: 0,
    currency: 'RM',
    quantity_pricing: [] as Array<{ min_qty: number; price: number }>,
    notes: '',
    status: 'active' as 'active' | 'inactive',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        code: product.code,
        name: product.name,
        description: product.description || '',
        image_url: product.image_url || '',
        stock: product.stock,
        base_price: product.base_price,
        currency: product.currency,
        quantity_pricing: product.quantity_pricing || [],
        notes: product.notes || '',
        status: product.status,
      });
    } else {
      // Reset for new product
      setFormData({
        code: '',
        name: '',
        description: '',
        image_url: '',
        stock: 0,
        base_price: 0,
        currency: 'RM',
        quantity_pricing: [],
        notes: '',
        status: 'active',
      });
    }
    setError('');
  }, [product, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.code || !formData.name || formData.base_price <= 0) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save product');
      }

      onSave();
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const addQuantityPricing = () => {
    setFormData({
      ...formData,
      quantity_pricing: [
        ...formData.quantity_pricing,
        { min_qty: 0, price: 0 },
      ],
    });
  };

  const removeQuantityPricing = (index: number) => {
    setFormData({
      ...formData,
      quantity_pricing: formData.quantity_pricing.filter((_, i) => i !== index),
    });
  };

  const updateQuantityPricing = (
    index: number,
    field: 'min_qty' | 'price',
    value: number
  ) => {
    const updated = [...formData.quantity_pricing];
    updated[index][field] = value;
    setFormData({
      ...formData,
      quantity_pricing: updated,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {product ? 'Edit Product' : 'Add Product'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Code / SKU *
                  </label>
                  <Input
                    type="text"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    placeholder="e.g., PROD-001"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Premium T-Shirt"
                    required
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Product description..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <Input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) =>
                    setFormData({ ...formData, image_url: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="mt-2 h-20 w-20 object-cover rounded border"
                  />
                )}
              </div>
            </div>

            {/* Pricing & Stock */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Pricing & Stock</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Base Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.base_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        base_price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) =>
                      setFormData({ ...formData, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="RM">RM (MYR)</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stock: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Quantity Pricing */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  Bulk Pricing (Optional)
                </h3>
                <Button
                  type="button"
                  onClick={addQuantityPricing}
                  size="sm"
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" />
                  Add Tier
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Set discounted prices for bulk purchases
              </p>
              {formData.quantity_pricing.length > 0 && (
                <div className="space-y-2">
                  {formData.quantity_pricing.map((tier, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        type="number"
                        min="1"
                        placeholder="Min Qty"
                        value={tier.min_qty}
                        onChange={(e) =>
                          updateQuantityPricing(
                            index,
                            'min_qty',
                            parseInt(e.target.value) || 0
                          )
                        }
                        className="w-32"
                      />
                      <span className="text-gray-500">→</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Price"
                        value={tier.price}
                        onChange={(e) =>
                          updateQuantityPricing(
                            index,
                            'price',
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-32"
                      />
                      <span className="text-sm text-gray-600">
                        {formData.currency}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuantityPricing(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Internal Notes & Status */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Additional Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Internal Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder="Private notes for internal use only..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    These notes are only visible to you
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as 'active' | 'inactive',
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : product ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
