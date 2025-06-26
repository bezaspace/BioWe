
import React from 'react';
import CategoryCard from './CategoryCard';

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
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard
              key={index}
              title={category.title}
              imageUrl={category.imageUrl}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
