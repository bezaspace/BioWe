
"use client";

import type { Product, CartItem, Discount } from '@/types';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  appliedPromoCode: string | null;
  discount: Discount | null;
  applyPromoCode: (discount: Discount) => void;
  removePromoCode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState<Discount | null>(null);

  useEffect(() => {
    // This check ensures localStorage is only accessed on the client-side
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('bioWeCart');
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart));
        } catch (error) {
          console.error("Failed to parse cart from localStorage", error);
          localStorage.removeItem('bioWeCart'); // Clear corrupted data
        }
      }
      const storedPromo = localStorage.getItem('bioWePromo');
      if (storedPromo) {
        try {
          const promoObj = JSON.parse(storedPromo);
          setAppliedPromoCode(promoObj.code || null);
          setDiscount(promoObj.discount || null);
        } catch (error) {
          localStorage.removeItem('bioWePromo');
        }
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (cartItems.length > 0 ) {
        localStorage.setItem('bioWeCart', JSON.stringify(cartItems));
      } else if (cartItems.length === 0 && localStorage.getItem('bioWeCart')) { 
        // Clear localStorage if cart becomes empty and was previously populated
        localStorage.removeItem('bioWeCart');
      }
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (appliedPromoCode && discount) {
        localStorage.setItem('bioWePromo', JSON.stringify({ code: appliedPromoCode, discount }));
      } else {
        localStorage.removeItem('bioWePromo');
      }
    }
  }, [appliedPromoCode, discount]);

  const addToCart = (product: Product, quantityToAdd: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantityToAdd }
            : item
        );
      }
      return [...prevItems, { product, quantity: quantityToAdd }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedPromoCode(null);
    setDiscount(null);
  };

  const applyPromoCode = (discountObj: Discount) => {
    setAppliedPromoCode(discountObj.code);
    setDiscount(discountObj);
  };

  const removePromoCode = () => {
    setAppliedPromoCode(null);
    setDiscount(null);
  };

  const getCartTotal = () => {
    const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
    if (discount) {
      if (discount.discountType === "percentage") {
        return Math.max(0, subtotal - (subtotal * discount.amount) / 100);
      } else if (discount.discountType === "fixed") {
        return Math.max(0, subtotal - discount.amount);
      }
    }
    return subtotal;
  };

  const getCartItemCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        appliedPromoCode,
        discount,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
