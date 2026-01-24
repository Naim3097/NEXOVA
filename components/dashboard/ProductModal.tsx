'use client';

import { useState, useEffect, useRef } from 'react';
import {
  X,
  Plus,
  Trash2,
  Upload,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/auth-client';

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

interface BundlePricingTier {
  quantity: number;
  totalPrice: number;
}

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
  bundle_pricing: BundlePricingTier[];
  notes: string | null;
  status: 'active' | 'inactive';
  variations?: Variation[];
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
    bundle_pricing: [] as BundlePricingTier[],
    notes: '',
    status: 'active' as 'active' | 'inactive',
    variations: [] as Variation[],
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user ID on mount
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

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
        bundle_pricing: product.bundle_pricing || [],
        notes: product.notes || '',
        status: product.status,
        variations: product.variations || [],
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
        bundle_pricing: [],
        notes: '',
        status: 'active',
        variations: [],
      });
    }
    setError('');
  }, [product, isOpen]);

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !userId) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB');
      return;
    }

    try {
      setUploading(true);
      setError('');

      // Generate unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `products/${userId}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase storage
      const { data, error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from('project-images').getPublicUrl(data.path);

      setFormData({ ...formData, image_url: publicUrl });
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

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

  // Bundle Pricing handlers
  const addBundlePricing = () => {
    const nextQty =
      formData.bundle_pricing.length > 0
        ? Math.max(...formData.bundle_pricing.map((t) => t.quantity)) + 1
        : 1;
    setFormData({
      ...formData,
      bundle_pricing: [
        ...formData.bundle_pricing,
        { quantity: nextQty, totalPrice: formData.base_price * nextQty },
      ],
    });
  };

  const removeBundlePricing = (index: number) => {
    setFormData({
      ...formData,
      bundle_pricing: formData.bundle_pricing.filter((_, i) => i !== index),
    });
  };

  const updateBundlePricing = (
    index: number,
    field: 'quantity' | 'totalPrice',
    value: number
  ) => {
    const updated = [...formData.bundle_pricing];
    updated[index][field] = value;
    // Sort by quantity
    updated.sort((a, b) => a.quantity - b.quantity);
    setFormData({
      ...formData,
      bundle_pricing: updated,
    });
  };

  // Variation handlers
  const addVariation = () => {
    const newVariation: Variation = {
      id: `var_${Date.now()}`,
      name: '',
      type: 'size',
      options: [],
    };
    setFormData({
      ...formData,
      variations: [...formData.variations, newVariation],
    });
  };

  const removeVariation = (index: number) => {
    setFormData({
      ...formData,
      variations: formData.variations.filter((_, i) => i !== index),
    });
  };

  const updateVariation = (
    index: number,
    field: keyof Variation,
    value: any
  ) => {
    const updated = [...formData.variations];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({
      ...formData,
      variations: updated,
    });
  };

  const addVariationOption = (variationIndex: number) => {
    const updated = [...formData.variations];
    const newOption: VariationOption = {
      value: '',
      label: '',
      priceAdjustment: 0,
      stock: 0,
      colorCode:
        formData.variations[variationIndex].type === 'color'
          ? '#000000'
          : undefined,
    };
    updated[variationIndex].options = [
      ...updated[variationIndex].options,
      newOption,
    ];
    setFormData({
      ...formData,
      variations: updated,
    });
  };

  const removeVariationOption = (
    variationIndex: number,
    optionIndex: number
  ) => {
    const updated = [...formData.variations];
    updated[variationIndex].options = updated[variationIndex].options.filter(
      (_, i) => i !== optionIndex
    );
    setFormData({
      ...formData,
      variations: updated,
    });
  };

  const updateVariationOption = (
    variationIndex: number,
    optionIndex: number,
    field: keyof VariationOption,
    value: any
  ) => {
    const updated = [...formData.variations];
    updated[variationIndex].options[optionIndex] = {
      ...updated[variationIndex].options[optionIndex],
      [field]: value,
    };
    setFormData({
      ...formData,
      variations: updated,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between z-10">
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

              {/* Image Upload */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Image
                </label>
                {formData.image_url ? (
                  <div className="relative group w-full max-w-xs">
                    <img
                      src={formData.image_url}
                      alt="Product"
                      className="w-full h-48 object-cover rounded-lg border border-gray-300"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                        title="Replace image"
                      >
                        <Upload size={20} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, image_url: '' })
                        }
                        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                        title="Remove image"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => !uploading && fileInputRef.current?.click()}
                    className={`w-full max-w-xs h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors ${uploading ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-2" />
                        <p className="text-sm text-gray-600">Uploading...</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">
                          Click to upload image
                        </p>
                        <p className="text-xs text-gray-500 mt-1">Max 5MB</p>
                      </>
                    )}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
                {/* URL Input as Alternative */}
                <div className="mt-2">
                  <p className="text-xs text-gray-500 mb-1">
                    Or enter image URL:
                  </p>
                  <Input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
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

            {/* Product Variations */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">Variations (Optional)</h3>
                <Button
                  type="button"
                  onClick={addVariation}
                  size="sm"
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" />
                  Add Variation
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Add product variations like sizes or colors
              </p>
              {formData.variations.length > 0 && (
                <div className="space-y-4">
                  {formData.variations.map((variation, vIndex) => (
                    <div
                      key={variation.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex gap-3 flex-1">
                          <div className="flex-1">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Variation Name
                            </label>
                            <Input
                              type="text"
                              placeholder="e.g., Size, Color"
                              value={variation.name}
                              onChange={(e) =>
                                updateVariation(vIndex, 'name', e.target.value)
                              }
                            />
                          </div>
                          <div className="w-32">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Type
                            </label>
                            <select
                              value={variation.type}
                              onChange={(e) =>
                                updateVariation(vIndex, 'type', e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            >
                              <option value="size">Size</option>
                              <option value="color">Color</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeVariation(vIndex)}
                          className="text-red-600 hover:text-red-800 ml-3"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Options */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">
                            Options
                          </span>
                          <button
                            type="button"
                            onClick={() => addVariationOption(vIndex)}
                            className="text-xs text-blue-600 hover:text-blue-800"
                          >
                            + Add Option
                          </button>
                        </div>
                        {variation.options.length > 0 ? (
                          <div className="space-y-2">
                            {variation.options.map((option, oIndex) => (
                              <div
                                key={oIndex}
                                className="flex gap-2 items-center bg-gray-50 p-2 rounded"
                              >
                                {variation.type === 'color' && (
                                  <input
                                    type="color"
                                    value={option.colorCode || '#000000'}
                                    onChange={(e) =>
                                      updateVariationOption(
                                        vIndex,
                                        oIndex,
                                        'colorCode',
                                        e.target.value
                                      )
                                    }
                                    className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                                  />
                                )}
                                <Input
                                  type="text"
                                  placeholder="Label (e.g., Small)"
                                  value={option.label}
                                  onChange={(e) =>
                                    updateVariationOption(
                                      vIndex,
                                      oIndex,
                                      'label',
                                      e.target.value
                                    )
                                  }
                                  className="flex-1"
                                />
                                <Input
                                  type="text"
                                  placeholder="Value (e.g., S)"
                                  value={option.value}
                                  onChange={(e) =>
                                    updateVariationOption(
                                      vIndex,
                                      oIndex,
                                      'value',
                                      e.target.value
                                    )
                                  }
                                  className="w-24"
                                />
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    +/-
                                  </span>
                                  <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="0"
                                    value={option.priceAdjustment}
                                    onChange={(e) =>
                                      updateVariationOption(
                                        vIndex,
                                        oIndex,
                                        'priceAdjustment',
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="w-20"
                                  />
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-xs text-gray-500">
                                    Stock:
                                  </span>
                                  <Input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    value={option.stock}
                                    onChange={(e) =>
                                      updateVariationOption(
                                        vIndex,
                                        oIndex,
                                        'stock',
                                        parseInt(e.target.value) || 0
                                      )
                                    }
                                    className="w-20"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeVariationOption(vIndex, oIndex)
                                  }
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-gray-500 py-2">
                            No options added yet
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
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

            {/* Bundle Pricing */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  Bundle Pricing (Optional)
                </h3>
                <Button
                  type="button"
                  onClick={addBundlePricing}
                  size="sm"
                  variant="outline"
                >
                  <Plus size={16} className="mr-1" />
                  Add Bundle
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Set fixed total prices for quantity bundles (e.g., Buy 1 = RM39,
                Buy 2 = RM75, Buy 3 = RM100)
              </p>
              {formData.bundle_pricing.length > 0 && (
                <div className="space-y-2">
                  {formData.bundle_pricing.map((tier, index) => {
                    const originalPrice = formData.base_price * tier.quantity;
                    const savings = originalPrice - tier.totalPrice;
                    const savingsPercent =
                      originalPrice > 0
                        ? Math.round((savings / originalPrice) * 100)
                        : 0;

                    return (
                      <div
                        key={index}
                        className="flex gap-2 items-center bg-gray-50 p-2 rounded-md"
                      >
                        <span className="text-sm text-gray-600">Buy</span>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Qty"
                          value={tier.quantity}
                          onChange={(e) =>
                            updateBundlePricing(
                              index,
                              'quantity',
                              parseInt(e.target.value) || 1
                            )
                          }
                          className="w-20"
                        />
                        <span className="text-gray-500">=</span>
                        <span className="text-sm text-gray-600">
                          {formData.currency}
                        </span>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="Total Price"
                          value={tier.totalPrice}
                          onChange={(e) =>
                            updateBundlePricing(
                              index,
                              'totalPrice',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-28"
                        />
                        {savings > 0 && (
                          <span className="text-xs text-green-600 font-medium">
                            Save {savingsPercent}%
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removeBundlePricing(index)}
                          className="text-red-600 hover:text-red-800 ml-auto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
              {formData.bundle_pricing.length > 0 && (
                <div className="mt-3 p-3 bg-blue-50 rounded-md">
                  <p className="text-xs text-blue-700">
                    <strong>Preview:</strong>{' '}
                    {formData.bundle_pricing.map((tier, i) => (
                      <span key={i}>
                        Buy {tier.quantity} = {formData.currency}{' '}
                        {tier.totalPrice.toFixed(2)}
                        {i < formData.bundle_pricing.length - 1 && ', '}
                      </span>
                    ))}
                  </p>
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
              {saving
                ? 'Saving...'
                : product
                  ? 'Update Product'
                  : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
