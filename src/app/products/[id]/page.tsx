
"use client"; // For useState and event handlers

import Image from 'next/image';
import { notFound, useParams } from 'next/navigation'; // Import useParams
import type { Product } from '@/types';
import { mockProducts } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, MinusCircle, PlusCircle, CheckCircle, XCircle, Info, BookOpen, ShieldAlert, MessageSquare, ThumbsUp, Package, Send, ListChecks, Settings, Leaf, Activity } from 'lucide-react';
import { ProductPageAddToCartButton } from '@/components/products/ProductPageAddToCartButton';
import { StarRating } from '@/components/shared/StarRating';
import React, { useState, useEffect } from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils'; // Import cn utility

async function getProductById(id: string): Promise<Product | undefined> {
  // In a real app, you'd fetch this from a CMS or database
  // Simulating async fetch
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockProducts.find(p => p.id === id));
    }, 0);
  });
}

// Helper component to render sections
interface ProductInfoSectionProps {
  title: string;
  content: string[] | string | undefined | React.ReactNode; // Allow ReactNode for review section
  IconComponent: React.ElementType;
  className?: string;
}

const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({ title, content, IconComponent, className }) => {
  if (!content || (Array.isArray(content) && content.length === 0 && typeof content !== 'string' && !React.isValidElement(content))) {
    return null;
  }

  return (
    <section className={cn("py-6", className)}>
      <h2 className="text-2xl font-semibold mb-4 flex items-center text-secondary">
        <IconComponent className="mr-3 h-6 w-6" />
        {title}
      </h2>
      <div className="text-base text-foreground space-y-2 pl-1">
        {Array.isArray(content) ? (
          <ul className="list-disc list-outside ml-5 space-y-1">
            {content.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        ) : (
          <div>{content}</div> // Use div to wrap string or ReactNode
        )}
      </div>
    </section>
  );
};


export default function ProductDetailPage() {
  const routeParams = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function fetchProduct(productId: string) {
      setIsLoading(true);
      const fetchedProduct = await getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);
      }
      setIsLoading(false);
    }

    if (routeParams && typeof routeParams.id === 'string') {
      fetchProduct(routeParams.id);
    } else {
      setIsLoading(false); // Handle cases where ID might not be available initially
    }
  }, [routeParams?.id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-muted h-12 w-12 mb-4 animate-spin border-t-primary"></div>
        <p className="ml-4 text-lg">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => {
      const newQuantity = prev + amount;
      return newQuantity < 1 ? 1 : newQuantity;
    });
  };

  const availabilityColor = product.availability === 'In Stock' ? 'text-green-600' : product.availability === 'Out of Stock' ? 'text-red-600' : 'text-yellow-600';
  const AvailabilityIcon = product.availability === 'In Stock' ? CheckCircle : product.availability === 'Out of Stock' ? XCircle : Info;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8">
          <CardHeader className="p-0 md:p-4">
            <div className="aspect-square relative w-full rounded-lg overflow-hidden">
              <Image
                src={product.imageSrc}
                alt={product.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
                data-ai-hint={product.dataAiHint}
              />
            </div>
          </CardHeader>
          
          <div className="flex flex-col p-6 md:p-4">
            <div className="flex-grow">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary mb-2">
                {product.name}
              </h1>

              {product.rating !== undefined && product.reviewCount !== undefined && (
                <div className="mb-3 flex items-center">
                  <StarRating rating={product.rating} reviewCount={product.reviewCount} starClassName="h-5 w-5" />
                </div>
              )}

              <p className="text-3xl font-semibold text-primary mb-4">
                ${product.price.toFixed(2)}
              </p>

              {product.availability && (
                <div className={`flex items-center text-md font-medium mb-4 ${availabilityColor}`}>
                  <AvailabilityIcon className="mr-2 h-5 w-5" />
                  {product.availability}
                </div>
              )}
              
              <p className="text-base text-foreground mb-6 space-y-3">
                {product.description.split('\\n\\n').map((paragraph, index) => (
                  <span key={index} className="block">{paragraph}</span>
                ))}
              </p>
            </div>

            <div className="mt-auto">
              <div className="flex items-center space-x-3 mb-6">
                <label htmlFor="quantity" className="font-medium">Quantity:</label>
                <div className="flex items-center border rounded-md">
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="h-10 w-10 rounded-r-none">
                    <MinusCircle className="h-5 w-5" />
                  </Button>
                  <Input
                    type="number"
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="w-16 text-center h-10 border-y-0 border-x rounded-none focus-visible:ring-0"
                    min="1"
                  />
                  <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(1)} className="h-10 w-10 rounded-l-none">
                    <PlusCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <ProductPageAddToCartButton product={product} quantity={quantity} disabled={product.availability === 'Out of Stock'} />
               {product.availability === 'Out of Stock' && (
                <p className="text-sm text-destructive mt-2 text-center">This product is currently unavailable.</p>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-6 sm:p-8 border-t">
          <div className="space-y-6">
            {product.features && product.features.length > 0 && (
              <ProductInfoSection
                title="Key Features"
                content={product.features}
                IconComponent={ListChecks}
              />
            )}

            <ProductInfoSection
              title="How to Use"
              content={product.howToUse}
              IconComponent={Settings}
            />
            
            <ProductInfoSection
              title="Ingredients / Composition"
              content={product.ingredients}
              IconComponent={Leaf}
            />

            <ProductInfoSection
              title="Safety Information"
              content={product.safetyInfo}
              IconComponent={ShieldAlert}
            />

            <Separator />

            <ProductInfoSection
              title="Customer Reviews"
              content={product.rating !== undefined && product.reviewCount !== undefined && product.reviewCount > 0 ? 
                (<div><StarRating rating={product.rating} reviewCount={product.reviewCount} starClassName="h-6 w-6" /><p className="mt-2 text-sm text-muted-foreground">Full customer reviews functionality coming soon!</p></div>) : 
                "No reviews yet. Be the first to review!"}
              IconComponent={MessageSquare}
            />
            
            <Separator />

            <ProductInfoSection
              title="Related Products"
              content="Suggestions for related products coming soon!"
              IconComponent={Package}
            />

            <Separator />
            
            <ProductInfoSection
              title="Shipping & Return Information"
              content={['We typically ship orders within 1-2 business days. Standard shipping takes 3-5 business days. Expedited options available at checkout.', 'We offer a 30-day return policy on unopened products. Please contact our customer service for return authorizations.']}
              IconComponent={Send}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

