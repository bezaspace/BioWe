
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ProductList } from '@/components/products/ProductList';
import { mockTestimonials, mockBlogPosts, mockProducts } from '@/lib/mock-data';
import type { Product, Testimonial, BlogPost } from '@/types';
import { ChevronRight, Leaf, ShieldCheck, Smile, Truck, MessageSquareQuote, Rss } from 'lucide-react';
import { TestimonialsCarousel } from '@/components/home/TestimonialsCarousel';
import { BlogPostsCarousel } from '@/components/blog/BlogPostsCarousel'; // Import BlogPostsCarousel
import CategoryTilesSection from '@/components/home/CategoryTilesSection';
import CategorySection from '@/components/home/CategorySection';

import { headers } from 'next/headers';

async function getFeaturedProducts(): Promise<Product[]> {
  const h = await headers();
  const host = h.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/products`, {
    cache: 'no-store',
  });
  const products: Product[] = await res.json();
  return products.slice(0, 4);
}

async function getTestimonials(): Promise<Testimonial[]> {
  return Promise.resolve(mockTestimonials); // Show all testimonials for carousel
}

async function getRecentBlogPosts(): Promise<BlogPost[]> {
  return Promise.resolve(mockBlogPosts.slice(0, 2)); // Show first 2 blog posts
}

// Hero Section Component
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-950 dark:to-teal-900 aspect-[4/3] min-h-[225px] rounded-xl shadow-lg overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {/* Decorative background elements if desired */}
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <Leaf className="mx-auto h-10 w-10 text-secondary mb-3" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3">
          Welcome to <span className="text-secondary">BioWe</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-4">
          Nurturing your green oasis with premium, eco-friendly gardening supplies. Grow healthier, happier plants with BioWe.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button size="sm" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/products">Shop All Products</Link>
          </Button>
          <Button size="sm" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
            <Link href="/contact">Get Expert Advice</Link>
          </Button>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
}

// Featured Products Section Component
interface FeaturedProductsProps {
  products: Product[];
}
function FeaturedProductsSection({ products }: FeaturedProductsProps) {
  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-secondary">Featured Products</h2>
        <Button variant="link" asChild className="text-secondary hover:text-primary">
          <Link href="/products">
            View All <ChevronRight className="ml-1 h-5 w-5" />
          </Link>
        </Button>
      </div>
      <ProductList products={products} />
    </section>
  );
}

// Why Choose Us Section Component
function WhyChooseUsSection() {
  const features = [
    {
      icon: <Leaf className="h-10 w-10 text-secondary mb-4" />,
      title: 'Direct from the Source',
      description: 'We partner directly with organic farms and ethical producers to bring you the highest quality, all-natural gardening products, ensuring your plants receive the purest nutrients.',
    },
  ];

  return (
    <section className="mb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-3xl font-bold tracking-tight text-center text-secondary mb-6">Why BioWe?</h2>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="text-center shadow-lg hover:shadow-xl transition-shadow max-w-md mx-auto">
              <CardHeader className="items-center">
                {feature.icon}
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// Testimonials Section Component
interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}
function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  return (
    <section className="mb-16 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center mb-12">
           <MessageSquareQuote className="h-10 w-10 text-secondary mr-4" />
          <h2 className="text-3xl font-bold tracking-tight text-center text-secondary">
            What Our Customers Say
          </h2>
        </div>
        <div className="relative px-12 lg:px-16">
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </div>
    </section>
  );
}

// Blog Snippets Section Component
interface BlogSnippetsSectionProps {
  posts: BlogPost[];
}
function BlogSnippetsSection({ posts }: BlogSnippetsSectionProps) {
  if (!posts || posts.length === 0) {
    return null;
  }
  return (
    <section className="mb-16 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="flex items-center mb-4 sm:mb-0">
            <Rss className="h-10 w-10 text-secondary mr-4" />
            <h2 className="text-3xl font-bold tracking-tight text-secondary">
              From Our Blog
            </h2>
          </div>
          <Button variant="link" asChild className="text-secondary hover:text-primary">
            <Link href="/blog">
              Read More on the Blog <ChevronRight className="ml-1 h-5 w-5" />
            </Link>
          </Button>
        </div>
        <BlogPostsCarousel posts={posts} />
      </div>
    </section>
  );
}


// Call to Action Section Component
function CallToActionSection() {
  return (
    <section className="py-16 bg-secondary text-secondary-foreground rounded-xl shadow-lg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Watch Your Garden Flourish?</h2>
        <p className="text-lg text-secondary-foreground/90 max-w-xl mx-auto mb-10">
          Explore our collection of premium gardening supplies and start your journey to a greener thumb today.
        </p>
        <Button size="lg" variant="default" asChild className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg transition-shadow">
          <Link href="/products">Start Shopping Now</Link>
        </Button>
      </div>
    </section>
  );
}


export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();
  const testimonials = await getTestimonials();
  const recentBlogPosts = await getRecentBlogPosts(); // Fetch recent blog posts

  // Use mockProducts for categories (replace with API fetch if needed)
  const allProducts: Product[] = mockProducts;

  return (
    <div>
      <CategoryTilesSection products={allProducts} />
      <HeroSection />
      <CategorySection />
      <FeaturedProductsSection products={featuredProducts} />
      <WhyChooseUsSection />
      <TestimonialsSection testimonials={testimonials} />
      <BlogSnippetsSection posts={recentBlogPosts} /> {/* Add BlogSnippetsSection */}
      <CallToActionSection />
    </div>
  );
}
