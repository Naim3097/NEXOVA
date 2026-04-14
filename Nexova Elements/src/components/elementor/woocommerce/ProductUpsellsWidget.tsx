import React from 'react';
import { Star } from 'lucide-react';

interface Product {
  id: number | string;
  name: string;
  price: string;
  image?: string;
  rating?: number;
}

interface ProductUpsellsWidgetProps {
  products?: Product[];
  columns?: number;
  limit?: number;
}

export default function ProductUpsellsWidget({ 
  products = [
    { id: 1, name: "Premium Item 1", price: "$149.00", rating: 5 },
    { id: 2, name: "Premium Item 2", price: "$199.00", rating: 4 },
    { id: 3, name: "Premium Item 3", price: "$249.00", rating: 5 },
    { id: 4, name: "Premium Item 4", price: "$299.00", rating: 4 },
  ],
  columns = 4, 
  limit = 4 
}: ProductUpsellsWidgetProps) {
  const displayProducts = products.slice(0, limit);

  return (
    <div className="w-full mt-12">
      <h3 className="text-2xl font-bold mb-6">You May Also Like</h3>
      <div 
        className="grid gap-6"
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {displayProducts.map((product, i) => (
          <div key={i} className="group border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-100 relative overflow-hidden">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  Upsell Product
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h4 className="font-medium text-gray-900 mb-1 truncate text-sm">{product.name}</h4>
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star 
                    key={star} 
                    className={`w-3 h-3 ${star < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <div className="font-bold text-gray-900 text-sm">{product.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
