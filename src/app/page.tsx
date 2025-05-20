import { ProductList } from '@/components/products/ProductList';
import { mockProducts } from '@/lib/mock-data';
import type { Product } from '@/types';

// Simulate fetching data
async function getProducts(): Promise<Product[]> {
  // In a real app, this would be an API call
  return Promise.resolve(mockProducts);
}

export default async function HomePage() {
  const products = await getProducts();

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight text-[#228B22]">Our Products</h1>
      <ProductList products={products} />
    </div>
  );
}
