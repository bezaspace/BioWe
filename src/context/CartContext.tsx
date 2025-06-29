
"use client";

import type { Product, CartItem, Discount, CreateOrderRequest, ShippingAddress } from '@/types';
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
  placeOrder: () => Promise<string | null>;
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

  const placeOrder = async (): Promise<string | null> => {
    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    // Get user profile data from localStorage or use defaults
    // In a real app, this would come from a user profile API
    const userProfile = localStorage.getItem('bioWeUserProfile');
    let shippingAddress: ShippingAddress;

    if (userProfile) {
      try {
        const profile = JSON.parse(userProfile);
        if (profile.shippingAddress && 
            profile.shippingAddress.fullName && 
            profile.shippingAddress.addressLine1 &&
            profile.shippingAddress.city &&
            profile.shippingAddress.state &&
            profile.shippingAddress.postalCode &&
            profile.shippingAddress.country) {
          shippingAddress = profile.shippingAddress;
        } else {
          throw new Error('Please complete your shipping address in your profile before placing an order. Make sure to fill in all required fields: name, address, city, state, postal code, and country.');
        }
      } catch (error) {
        if (error instanceof Error) {
          throw error;
        }
        throw new Error('Please complete your shipping address in your profile before placing an order.');
      }
    } else {
      throw new Error('Please complete your profile and shipping address before placing an order. Go to your profile page to add your shipping information.');
    }

    // Get auth token
    const auth = await import('@/firebase/client');
    const user = auth.auth.currentUser;
    if (!user) {
      throw new Error('You must be signed in to place an order');
    }

    const token = await user.getIdToken();

    // Prepare order data
    const orderData: CreateOrderRequest = {
      items: cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      shippingAddress,
      discountCode: discount?.code,
      notes: '', // Could be added as a feature later
    };

    try {
      console.log('Placing order with data:', orderData);
      
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      console.log('Order API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        console.error('Order API error:', errorData);
        throw new Error(errorData.error || `Failed to place order (Status: ${response.status})`);
      }

      const result = await response.json();
      console.log('Order placed successfully:', result);
      
      // Clear cart after successful order
      clearCart();
      
      return result.order.id;
    } catch (error: any) {
      console.error('Error placing order:', error);
      
      // Provide more specific error messages
      if (error.message.includes('fetch')) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection and try again.');
      }
      
      throw error;
    }
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
        placeOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
