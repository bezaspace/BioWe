
"use client";

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

  const handleAddToCart = () => {
    addToCart(product);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
<Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full">
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
      <CardFooter className="p-2 pt-0">
        <Button onClick={handleAddToCart} className="w-full h-8 px-2 py-1 text-xs">
          <ShoppingCart className="mr-1 h-4 w-4" /> Buy
        </Button>
      </CardFooter>
    </Card>
  );
}
