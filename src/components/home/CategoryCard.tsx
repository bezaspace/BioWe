
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  imageUrl: string;
  description?: string; // Make description optional
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, imageUrl }) => {
  return (
    <Card className="flex flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full w-[260px] sm:w-[300px] md:w-[340px] mx-auto">
      <CardHeader className="p-0">
        <Link href={`/products?category=${encodeURIComponent(title)}`} className="block relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform hover:scale-105"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-3 pt-2 pb-3 text-center">
        <CardTitle className="text-base font-medium">
          <Link href={`/products?category=${encodeURIComponent(title)}`} className="hover:text-primary transition-colors">
            {title}
          </Link>
        </CardTitle>
      </CardContent>
    </Card>
  );
};

export default CategoryCard;
