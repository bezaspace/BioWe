
import { ProductList } from '@/components/products/ProductList';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/types';
import { PackageSearch } from 'lucide-react';

interface ProductsPageProps {
  searchParams: { q?: string };
}

async function getFilteredProducts(search?: string): Promise<Product[]> {
  // In a real app, you'd fetch this from a database or API with search params
  if (!search) {
    return mockProducts;
  }

  const searchLower = search.toLowerCase();
  return mockProducts.filter(product => {
    const searchableText = [
      product.name,
      product.description,
      product.category,
      product.dataAiHint,
      ...(product.features || []),
      ...(Array.isArray(product.ingredients) ? product.ingredients : [])
    ].join(' ').toLowerCase();
    
    return searchableText.includes(searchLower);
  });
}

export const metadata = {
  title: 'Our Products | BioWe',
  description: 'Explore the full range of BioWe gardening and fertilizer products.',
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const products = await getFilteredProducts(searchParams.q);

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-950/30 dark:to-teal-900/30 rounded-xl shadow-md">
        <PackageSearch className="mx-auto h-16 w-16 text-secondary mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-secondary mb-4">
          Our Product Collection
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse all our premium, eco-friendly gardening supplies designed to help your green oasis flourish.
        </p>
      </section>

      {products.length > 0 ? (
        <section>
          <ProductList products={products} />
        </section>
      ) : (
        <section className="text-center py-10">
          <PackageSearch className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-4">No Products Available Yet</h2>
          <p className="text-muted-foreground">
            We're busy cultivating our product line! Check back soon for our latest offerings.
          </p>
        </section>
      )}
    </div>
  );
}
