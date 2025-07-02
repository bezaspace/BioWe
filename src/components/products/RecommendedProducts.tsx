'use client';

import { useEffect, useState } from 'react';
import { Product } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@/components/ui/carousel';

interface RecommendedProductsProps {
  cartProducts: Product[];
}

export function RecommendedProducts({ cartProducts }: RecommendedProductsProps) {
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cartProducts.length > 0) {
      fetch('/api/products/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartProducts),
      })
        .then(res => res.json())
        .then(data => {
          setRecommendations(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching recommendations:', error);
          setLoading(false);
        });
    }
  }, [cartProducts]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">recommended picks that go with this</h2>
        <Carousel className="w-full max-w-3xl mx-auto">
          <CarouselContent>
            {[...Array(4)].map((_, i) => (
              <CarouselItem key={i}>
                <Skeleton className="h-64 w-full" />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  // Group recommendations into pairs
  function groupInPairs<T>(arr: T[]): T[][] {
    const pairs: T[][] = [];
    for (let i = 0; i < arr.length; i += 2) {
      pairs.push(arr.slice(i, i + 2));
    }
    return pairs;
  }
  const pairs = groupInPairs(recommendations);

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-4">recommended picks that go with this</h2>
      <Carousel className="w-full max-w-3xl mx-auto">
        <CarouselContent>
          {pairs.map((pair, idx) => (
            <CarouselItem key={idx}>
              <div className="grid grid-cols-2 gap-2 px-2">
                {pair.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
        <CarouselDots count={pairs.length} />
      </Carousel>
    </div>
  );
}
