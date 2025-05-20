
"use client";

import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface ProductPageAddToCartButtonProps {
  product: Product;
  quantity: number;
  disabled?: boolean;
}

export function ProductPageAddToCartButton({ product, quantity, disabled = false }: ProductPageAddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (disabled) return;
    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
  };

  return (
    <Button 
      onClick={handleAddToCart} 
      className="w-full text-lg py-6"
      disabled={disabled}
    >
      <ShoppingCart className="mr-2 h-6 w-6" /> Add to Cart
    </Button>
  );
}
