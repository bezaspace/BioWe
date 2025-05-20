
"use client";

import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';

interface ProductPageAddToCartButtonProps {
  product: Product;
}

export function ProductPageAddToCartButton({ product }: ProductPageAddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <Button onClick={handleAddToCart} className="w-full text-lg py-6">
      <ShoppingCart className="mr-2 h-6 w-6" /> Add to Cart
    </Button>
  );
}
