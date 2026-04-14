'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  productId: string;
  productName: string;
  variantKey?: string; // e.g., "productId-XS" for variant selection
  variantLabel?: string; // e.g., "XS" or "Size S"
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (productId: string, variantKey?: string) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    variantKey?: string
  ) => void;
  clearCart: () => void;
  getQuantity: (productId: string, variantKey?: string) => number;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      setItems((prevItems) => {
        const key = item.variantKey || item.productId;
        const existingIndex = prevItems.findIndex(
          (i) => (i.variantKey || i.productId) === key
        );

        if (existingIndex >= 0) {
          // Update existing item quantity
          const newItems = [...prevItems];
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + (item.quantity || 1),
          };
          return newItems;
        }

        // Add new item
        return [
          ...prevItems,
          {
            ...item,
            quantity: item.quantity || 1,
          },
        ];
      });
    },
    []
  );

  const removeFromCart = useCallback(
    (productId: string, variantKey?: string) => {
      setItems((prevItems) => {
        const key = variantKey || productId;
        return prevItems.filter((i) => (i.variantKey || i.productId) !== key);
      });
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, variantKey?: string) => {
      setItems((prevItems) => {
        const key = variantKey || productId;
        if (quantity <= 0) {
          return prevItems.filter((i) => (i.variantKey || i.productId) !== key);
        }

        return prevItems.map((i) => {
          if ((i.variantKey || i.productId) === key) {
            return { ...i, quantity };
          }
          return i;
        });
      });
    },
    []
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getQuantity = useCallback(
    (productId: string, variantKey?: string) => {
      const key = variantKey || productId;
      const item = items.find((i) => (i.variantKey || i.productId) === key);
      return item?.quantity || 0;
    },
    [items]
  );

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getQuantity,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    // Return a no-op implementation for when cart is not available (e.g., in builder preview)
    return {
      items: [] as CartItem[],
      addToCart: () => {},
      removeFromCart: () => {},
      updateQuantity: () => {},
      clearCart: () => {},
      getQuantity: () => 0,
      getTotalItems: () => 0,
      getTotalPrice: () => 0,
    };
  }
  return context;
}
