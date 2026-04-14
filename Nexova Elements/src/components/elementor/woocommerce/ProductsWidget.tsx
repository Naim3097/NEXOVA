import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';

interface Product {
  id: number | string;
  name: string;
  price: string;
  image?: string;
  rating?: number;
}

interface ProductsWidgetProps {
  products?: Product[];
  columns?: number;
  rows?: number;
  showTitle?: boolean;
  showPrice?: boolean;
  showRating?: boolean;
  showCart?: boolean;
}

export default function ProductsWidget({ 
  products = [
    { id: 1, name: "Product Name 1", price: "$99.00", rating: 5 },
    { id: 2, name: "Product Name 2", price: "$129.00", rating: 4 },
    { id: 3, name: "Product Name 3", price: "$149.00", rating: 5 },
    { id: 4, name: "Product Name 4", price: "$199.00", rating: 4 },
  ],
  columns = 4, 
  rows = 1,
  showTitle = true,
  showPrice = true,
  showRating = true,
  showCart = true
}: ProductsWidgetProps) {
  const totalProducts = columns * rows;
  const displayProducts = products.length > 0 ? products.slice(0, totalProducts) : Array.from({ length: totalProducts }).map((_, i) => ({
    id: i,
    name: `Product Name ${i + 1}`,
    price: "$99.00",
    rating: 5,
    image: undefined
  }));
  
  return (
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
              <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                Product Image
              </div>
            )}
            {showCart && (
              <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600 hover:text-white">
                <ShoppingCart className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="p-4">
            {showTitle && (
              <h3 className="font-medium text-gray-900 mb-1 truncate">{product.name}</h3>
            )}
            
            {showRating && (
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, star) => (
                  <Star 
                    key={star} 
                    className={`w-3 h-3 ${star < (product.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
            )}
            
            {showPrice && (
              <div className="font-bold text-gray-900">{product.price}</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
