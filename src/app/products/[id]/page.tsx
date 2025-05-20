
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import { mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { ProductPageAddToCartButton } from '@/components/products/ProductPageAddToCartButton';

async function getProductById(id: string): Promise<Product | undefined> {
  // In a real app, you'd fetch this from a CMS or database
  return Promise.resolve(mockProducts.find(p => p.id === id));
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
          <CardHeader className="p-0">
            <div className="aspect-square relative w-full">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority // Prioritize loading the main product image
                data-ai-hint={product.dataAiHint}
              />
            </div>
          </CardHeader>
          
          <div className="flex flex-col">
            <CardContent className="p-6 sm:p-8 flex-grow">
              <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary mb-4">
                {product.name}
              </CardTitle>
              <p className="text-2xl font-semibold text-primary mb-4">
                ${product.price.toFixed(2)}
              </p>
              <CardDescription className="text-base text-muted-foreground space-y-4">
                {product.description.split('\\n\\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </CardDescription>
            </CardContent>

            <CardFooter className="p-6 sm:p-8 pt-0">
              <ProductPageAddToCartButton product={product} />
            </CardFooter>
          </div>
        </div>
      </Card>

      {/* You could add related products or reviews sections here in the future */}
    </div>
  );
}

// Optional: Generate static paths if you have a known, limited number of products
export async function generateStaticParams() {
  return mockProducts.map((product) => ({
    id: product.id,
  }));
}

// Optional: Add metadata for each product page
export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }
  return {
    title: `${product.name} | BioWe`,
    description: product.description.substring(0, 160), // Basic excerpt for description
  };
}
