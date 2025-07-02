
"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { ShoppingCart } from 'lucide-react';
import { StarRating } from '@/components/shared/StarRating'; // Updated path

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast({
      title: "Added to cart!",
      description: `${quantity} x ${product.name} has been added to your cart.`,
    });
    setQuantity(1); // Reset quantity after adding to cart
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full w-[260px] sm:w-[300px] md:w-[340px] mx-auto">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block relative w-full h-48">
          <Image
            src={product.imageSrc}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={product.dataAiHint}
          />
        </Link>
      </CardHeader>
      <CardContent className="p-2 flex-grow">
        <CardTitle className="text-base mb-0.5">
          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </Link>
        </CardTitle>
        <p className="text-sm font-semibold text-primary mb-1">${product.price.toFixed(2)}</p>
        {product.rating !== undefined && product.reviewCount !== undefined && (
          <div className="mb-1">
            <StarRating rating={product.rating} reviewCount={product.reviewCount} />
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 pt-0 flex-col items-stretch gap-2">
        <div className="flex items-center justify-center gap-2">
          <Button onClick={decreaseQuantity} size="sm" variant="outline" className="px-3 h-8">
            -
          </Button>
          <span className="font-bold text-md w-8 text-center">{quantity}</span>
          <Button onClick={increaseQuantity} size="sm" variant="outline" className="px-3 h-8">
            +
          </Button>
        </div>
        <Button onClick={handleAddToCart} className="w-full h-8 px-2 py-1 text-xs">
          <ShoppingCart className="mr-1 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
