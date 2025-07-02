
import React from 'react';
import CategoryCard from './CategoryCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  CarouselDots,
} from '@/components/ui/carousel';

const categories = [
  {
    title: 'Bio Fertilizers',
    imageUrl: '/images/products/bio fertilizer.png',
  },
  {
    title: 'Bio Pesticides',
    imageUrl: '/images/products/bio pesticide.png',
  },
  {
    title: 'Vermicompost',
    imageUrl: '/images/products/vermicompost.png',
  },
  {
    title: 'Garden Mix',
    imageUrl: '/images/products/garden mix.png',
  },
];

const CategorySection: React.FC = () => {
  return (
    <section className="mb-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight text-secondary">Shop by Category</h2>
        </div>
        <div className="relative flex flex-col items-center">
          <Carousel
            opts={{
              align: 'center',
              containScroll: 'trimSnaps',
              slidesToScroll: 1,
            }}
            className="w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl"
          >
            <CarouselContent>
              {categories.map((category, index) => (
                <CarouselItem
                  key={index}
                  className="basis-[80%] sm:basis-[70%] md:basis-[60%] lg:basis-[45%] transition-all"
                >
                  <CategoryCard
                    title={category.title}
                    imageUrl={category.imageUrl}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
            <CarouselDots count={categories.length} />
          </Carousel>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
