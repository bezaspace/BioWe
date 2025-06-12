// src/components/home/CategoryTilesSection.tsx

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/types';

interface CategoryTilesSectionProps {
  products: Product[];
}

interface CategoryInfo {
  name: string;
  imageSrc: string;
  imageAlt: string;
}

function getUniqueCategories(products: Product[]): CategoryInfo[] {
  const categoryMap = new Map<string, CategoryInfo>();
  for (const product of products) {
    if (!categoryMap.has(product.category)) {
      categoryMap.set(product.category, {
        name: product.category,
        imageSrc: product.imageSrc,
        imageAlt: product.imageAlt,
      });
    }
  }
  return Array.from(categoryMap.values());
}

export const CategoryTilesSection: React.FC<CategoryTilesSectionProps> = ({ products }) => {
  let categories = getUniqueCategories(products);
  if (categories.length < 6) {
    // Fallback: show first 6 products as tiles if not enough categories
    categories = products.slice(0, 6).map((product) => ({
      name: product.name,
      imageSrc: product.imageSrc,
      imageAlt: product.imageAlt,
    }));
  } else {
    categories = categories.slice(0, 6);
  }

  return (
    <section className="mb-1">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="flex md:grid md:grid-cols-6 gap-3 overflow-x-auto">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={`/products?category=${encodeURIComponent(category.name)}`}
              className="flex-shrink-0 flex flex-col items-center group block rounded-lg shadow hover:shadow-md transition-shadow bg-white dark:bg-background overflow-hidden border border-muted"
              style={{ minWidth: 64, maxWidth: 100 }}
            >
              <div className="relative w-16 h-16 md:w-full md:aspect-square bg-muted">
                <Image
                  src={category.imageSrc}
                  alt={category.imageAlt || category.name}
                  fill
                  sizes="64px"
                  className="transition-transform group-hover:scale-105"
                  style={{ objectFit: 'cover' }}
                  priority={true}
                />
              </div>
              <div className="mt-1 text-center w-16 md:w-full">
                <span className="text-[10px] md:text-sm font-medium text-primary group-hover:text-secondary transition-colors truncate block">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryTilesSection;
