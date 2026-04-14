'use client';

import { useState, useRef } from 'react';
import {
  X,
  Upload,
  FileSpreadsheet,
  Download,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import * as XLSX from 'xlsx';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

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

interface ParsedProduct {
  code: string;
  name: string;
  description?: string;
  image_url?: string;
  stock?: number;
  base_price: number;
  currency?: string;
  variations?: Variation[];
  notes?: string;
  status?: 'active' | 'inactive';
}

interface UploadResult {
  success: boolean;
  message?: string;
  inserted?: number;
  skipped?: number;
  errors?: Array<{ row: number; error: string }>;
  error?: string;
}

export default function BulkUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: BulkUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [parsedProducts, setParsedProducts] = useState<ParsedProduct[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Reset states
    setParseError(null);
    setParsedProducts([]);
    setUploadResult(null);

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // xlsx
      'application/vnd.ms-excel', // xls
      'text/csv',
    ];

    if (
      !validTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith('.xlsx') &&
      !selectedFile.name.endsWith('.xls') &&
      !selectedFile.name.endsWith('.csv')
    ) {
      setParseError('Please upload an Excel (.xlsx, .xls) or CSV file');
      return;
    }

    setFile(selectedFile);

    try {
      const data = await readFileAsArrayBuffer(selectedFile);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      if (jsonData.length === 0) {
        setParseError('The file appears to be empty');
        return;
      }

      // Helper function to parse size variations with price adjustments
      const parseSizeVariations = (
        sizesString: string,
        plusSizePrice?: number
      ): Variation | null => {
        if (!sizesString) return null;

        // Parse sizes from comma-separated string like "XS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL"
        const sizes = sizesString
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
        if (sizes.length === 0) return null;

        // Plus sizes that get extra charge (4XL, 5XL, 6XL, etc.)
        const plusSizes = ['4XL', '5XL', '6XL', '7XL'];
        const priceAdjustment = plusSizePrice || 10; // Default +RM10 for plus sizes

        const options: VariationOption[] = sizes.map((size) => {
          const sizeUpper = size.toUpperCase();
          const isPlusSize = plusSizes.includes(sizeUpper);

          return {
            value: size.toLowerCase().replace(/\s+/g, '_'),
            label: size,
            priceAdjustment: isPlusSize ? priceAdjustment : 0,
            stock: 0, // Will be distributed from total stock
          };
        });

        return {
          id: `var_size_${Date.now()}`,
          name: 'Size',
          type: 'size' as const,
          options,
        };
      };

      // Map Excel columns to product fields
      const products: ParsedProduct[] = jsonData
        .map((row: any) => {
          // Support multiple column name variations
          const code =
            row['Product Code'] ||
            row['Code'] ||
            row['SKU'] ||
            row['code'] ||
            row['sku'] ||
            '';
          const name =
            row['Product Name'] ||
            row['Name'] ||
            row['name'] ||
            row['Title'] ||
            '';
          const description =
            row['Description'] ||
            row['Short Description'] ||
            row['description'] ||
            '';
          const image_url =
            row['Image URL'] ||
            row['Image'] ||
            row['image_url'] ||
            row['image'] ||
            '';
          const stock =
            parseFloat(
              row['Stock'] || row['Quantity'] || row['stock'] || '0'
            ) || 0;

          // Handle price - try multiple column names
          let base_price =
            row['Base Price'] ||
            row['Price'] ||
            row['Sale Price'] ||
            row['Sale Price (MYR)'] ||
            row['base_price'] ||
            row['price'] ||
            0;
          if (typeof base_price === 'string') {
            base_price = parseFloat(base_price.replace(/[^0-9.-]/g, '')) || 0;
          }

          const currency = row['Currency'] || row['currency'] || 'RM';
          const sizesVariants =
            row['Sizes/Variants'] ||
            row['Sizes'] ||
            row['Variants'] ||
            row['Size'] ||
            '';
          const notes = row['Notes'] || row['notes'] || '';
          const status =
            (row['Status'] || row['status'] || 'active').toLowerCase() ===
            'inactive'
              ? 'inactive'
              : 'active';

          // Parse plus size price adjustment if provided
          let plusSizePrice: number | undefined;
          const plusSizePriceStr =
            row['Plus Size Price'] ||
            row['Plus Size'] ||
            row['4XL+ Price'] ||
            '';
          if (plusSizePriceStr) {
            const parsed = parseFloat(
              String(plusSizePriceStr).replace(/[^0-9.-]/g, '')
            );
            if (!isNaN(parsed) && parsed > 0) {
              // Calculate adjustment based on base price
              plusSizePrice = parsed - Number(base_price);
            }
          }

          // Parse size variations
          const variations: Variation[] = [];
          const sizeVariation = parseSizeVariations(
            String(sizesVariants),
            plusSizePrice
          );
          if (sizeVariation) {
            variations.push(sizeVariation);
          }

          return {
            code: String(code).trim(),
            name: String(name).trim(),
            description: description ? String(description).trim() : undefined,
            image_url: image_url ? String(image_url).trim() : undefined,
            stock: Math.floor(stock),
            base_price: Number(base_price),
            currency: String(currency).trim(),
            variations: variations.length > 0 ? variations : undefined,
            notes: notes ? String(notes).trim() : undefined,
            status: status as 'active' | 'inactive',
          };
        })
        .filter((p) => p.code && p.name && p.base_price > 0);

      if (products.length === 0) {
        setParseError(
          'No valid products found. Make sure your file has columns: Code/SKU, Name, and Price'
        );
        return;
      }

      setParsedProducts(products);
    } catch (error) {
      console.error('Error parsing file:', error);
      setParseError('Failed to parse file. Please check the format.');
    }
  };

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (parsedProducts.length === 0) return;

    setUploading(true);
    setUploadResult(null);

    try {
      const response = await fetch('/api/products/bulk-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: parsedProducts }),
      });

      const result = await response.json();

      if (response.ok) {
        setUploadResult({
          success: true,
          message: result.message,
          inserted: result.inserted,
          skipped: result.skipped,
          errors: result.errors,
        });
        onSuccess();
      } else {
        setUploadResult({
          success: false,
          error: result.error || 'Unknown error occurred',
          errors: result.validationErrors,
        });
        console.error('Upload failed:', result);
      }
    } catch (error) {
      console.error('Error uploading:', error);
      setUploadResult({
        success: false,
        error: 'Failed to upload products. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create template workbook
    const templateData = [
      {
        'Product Code': 'PROD-001',
        'Product Name': 'Sample T-Shirt',
        Description: 'Product description here',
        'Image URL': 'https://example.com/image.jpg',
        Stock: 100,
        'Base Price': 39.0,
        'Sizes/Variants': 'XS, S, M, L, XL, 2XL, 3XL, 4XL, 5XL',
        'Plus Size Price': 49.0,
        Currency: 'RM',
        Notes: 'Internal notes here',
        Status: 'active',
      },
      {
        'Product Code': 'PROD-002',
        'Product Name': 'Basic Polo',
        Description: 'Another description',
        'Image URL': 'https://example.com/image2.jpg',
        Stock: 50,
        'Base Price': 59.9,
        'Sizes/Variants': 'S, M, L, XL',
        'Plus Size Price': '',
        Currency: 'RM',
        Notes: '',
        Status: 'active',
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');

    // Set column widths
    ws['!cols'] = [
      { wch: 15 }, // Product Code
      { wch: 25 }, // Product Name
      { wch: 40 }, // Description
      { wch: 40 }, // Image URL
      { wch: 10 }, // Stock
      { wch: 12 }, // Base Price
      { wch: 35 }, // Sizes/Variants
      { wch: 15 }, // Plus Size Price
      { wch: 10 }, // Currency
      { wch: 30 }, // Notes
      { wch: 10 }, // Status
    ];

    XLSX.writeFile(wb, 'product_upload_template.xlsx');
  };

  const resetModal = () => {
    setFile(null);
    setParsedProducts([]);
    setParseError(null);
    setUploadResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />

      <div className="relative bg-white rounded-2xl border-[#E2E8F0] shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
          <h2 className="text-xl font-semibold text-[#455263]">
            Bulk Upload Products
          </h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-[#F8FAFC] rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Download Template */}
          <div className="mb-6 p-4 bg-[#5FC7CD]/10 border border-[#5FC7CD]/20 rounded-xl">
            <div className="flex items-start gap-3">
              <FileSpreadsheet className="text-[#5FC7CD] mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-sm text-[#455263] font-medium">
                  Need a template?
                </p>
                <p className="text-sm text-[#969696] mt-1">
                  Download our Excel template with the correct column headers.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  className="mt-2"
                >
                  <Download size={16} className="mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[#455263] mb-2">
              Upload Excel or CSV File
            </label>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                file
                  ? 'border-green-300 bg-green-50'
                  : 'border-[#E2E8F0] hover:border-[#5FC7CD]'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
              {file ? (
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="text-green-600" size={24} />
                  <span className="text-green-700 font-medium">
                    {file.name}
                  </span>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto text-[#969696]" size={32} />
                  <p className="mt-2 text-sm text-[#969696]">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-[#969696] mt-1">
                    Supports .xlsx, .xls, .csv
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Parse Error */}
          {parseError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-[#EF4444] mt-0.5" size={20} />
              <p className="text-sm text-[#EF4444]">{parseError}</p>
            </div>
          )}

          {/* Parsed Products Preview */}
          {parsedProducts.length > 0 && !uploadResult?.success && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-[#455263] mb-2">
                Preview ({parsedProducts.length} products found)
              </h3>
              <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#F8FAFC] sticky top-0">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium text-[#969696]">
                          Code
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-[#969696]">
                          Name
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-[#969696]">
                          Price
                        </th>
                        <th className="px-3 py-2 text-left font-medium text-[#969696]">
                          Variations
                        </th>
                        <th className="px-3 py-2 text-right font-medium text-[#969696]">
                          Stock
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0]">
                      {parsedProducts.slice(0, 10).map((product, index) => (
                        <tr key={index} className="hover:bg-[#F8FAFC]">
                          <td className="px-3 py-2 text-[#455263]">
                            {product.code}
                          </td>
                          <td className="px-3 py-2 text-[#455263] truncate max-w-[150px]">
                            {product.name}
                          </td>
                          <td className="px-3 py-2 text-right text-[#455263]">
                            {product.currency} {product.base_price.toFixed(2)}
                          </td>
                          <td className="px-3 py-2 text-[#969696] text-xs">
                            {product.variations &&
                            product.variations.length > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-xl bg-[#5FC7CD]/10 text-[#5FC7CD]">
                                {product.variations[0].options.length} sizes
                                {product.variations[0].options.some(
                                  (o) => o.priceAdjustment > 0
                                ) && (
                                  <span className="ml-1 text-orange-600">
                                    +pricing
                                  </span>
                                )}
                              </span>
                            ) : (
                              <span className="text-[#969696]">-</span>
                            )}
                          </td>
                          <td className="px-3 py-2 text-right text-[#455263]">
                            {product.stock}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {parsedProducts.length > 10 && (
                  <div className="px-3 py-2 bg-[#F8FAFC] text-sm text-[#969696] text-center">
                    ... and {parsedProducts.length - 10} more products
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Result */}
          {uploadResult && (
            <div
              className={`mb-6 p-4 rounded-xl ${uploadResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
            >
              <div className="flex items-start gap-3">
                {uploadResult.success ? (
                  <CheckCircle2 className="text-green-600 mt-0.5" size={20} />
                ) : (
                  <AlertCircle className="text-[#EF4444] mt-0.5" size={20} />
                )}
                <div>
                  <p
                    className={`font-medium ${uploadResult.success ? 'text-green-900' : 'text-[#EF4444]'}`}
                  >
                    {uploadResult.success
                      ? uploadResult.message
                      : uploadResult.error}
                  </p>
                  {uploadResult.success &&
                    uploadResult.skipped &&
                    uploadResult.skipped > 0 && (
                      <p className="text-sm text-green-700 mt-1">
                        {uploadResult.skipped} product(s) were skipped due to
                        validation errors.
                      </p>
                    )}
                  {uploadResult.errors && uploadResult.errors.length > 0 && (
                    <ul className="mt-2 text-sm text-[#EF4444] list-disc list-inside">
                      {uploadResult.errors.slice(0, 5).map((err, i) => (
                        <li key={i}>
                          Row {err.row}: {err.error}
                        </li>
                      ))}
                      {uploadResult.errors.length > 5 && (
                        <li>
                          ... and {uploadResult.errors.length - 5} more errors
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-[#E2E8F0] bg-[#F8FAFC]">
          <Button variant="outline" onClick={handleClose}>
            {uploadResult?.success ? 'Close' : 'Cancel'}
          </Button>
          {!uploadResult?.success && (
            <Button
              variant="teal"
              onClick={handleUpload}
              disabled={parsedProducts.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <span className="animate-spin mr-2">&#9696;</span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} className="mr-2" />
                  Upload{' '}
                  {parsedProducts.length > 0
                    ? `(${parsedProducts.length})`
                    : ''}
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
