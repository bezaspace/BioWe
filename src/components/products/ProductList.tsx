"use client";

import { useState } from 'react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';
import { SearchInput } from '@/components/shared/SearchInput';

interface ProductListProps {
  products: Product[];
}

export function ProductList({ products }: ProductListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = products.filter(product => {
    if (!searchQuery.trim()) return true;
    
    const search = searchQuery.toLowerCase();
    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.dataAiHint,
      ...(product.features || []),
      ...(Array.isArray(product.ingredients) ? product.ingredients : [])
    ].join(' ').toLowerCase();
    
    return searchableText.includes(search);
  });

  if (!products || products.length === 0) {
    return <p className="text-center text-muted-foreground">No products found.</p>;
  }

  return (
    <div className="space-y-6">
      {filteredProducts.length === 0 ? (
        <p className="text-center text-muted-foreground">No products match your search.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
