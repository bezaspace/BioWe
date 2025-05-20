
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Target, CheckCircle, Sprout, MessageCircle, Heart } from 'lucide-react';
import Link from 'next/link';
import { PexelsImage } from '@/components/shared/PexelsImage';

// Removed metadata export as it's not allowed in client components
// export const metadata = {
//   title: 'About BioWe | Our Story, Mission, and Values',
//   description: 'Learn more about BioWe, our commitment to sustainable gardening, quality products, and the passion that drives us to help your green oasis flourish.',
// };

export default function AboutUsPage() {
  const values = [
    {
      icon: <Leaf className="h-10 w-10 text-secondary mb-4" />,
      title: 'Sustainability First',
      description: 'We are committed to eco-friendly practices, from sourcing sustainable ingredients to promoting responsible gardening techniques.',
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-secondary mb-4" />,
      title: 'Uncompromising Quality',
      description: 'Our products are meticulously formulated and rigorously tested to ensure they meet the highest standards for effectiveness and safety.',
    },
    {
      icon: <Sprout className="h-10 w-10 text-secondary mb-4" />,
      title: 'Growth & Innovation',
      description: 'We continuously research and develop new solutions to help you achieve a thriving garden and a greener planet.',
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-secondary mb-4" />,
      title: 'Customer Focused',
      description: 'Your success is our success. We strive to provide exceptional support and resources to our gardening community.',
    },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 rounded-xl shadow-lg overflow-hidden bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100 dark:from-green-900 dark:via-emerald-950 dark:to-teal-900">
        <div className="absolute inset-0 opacity-20">
          <PexelsImage
            initialSrc="https://placehold.co/1200x600.png"
            altText="Lush green foliage background"
            aiHint="lush foliage"
            orientation="landscape"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Leaf className="mx-auto h-16 w-16 text-secondary mb-6" />
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 text-secondary">
            About BioWe
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Nurturing nature, together. Discover the story, passion, and values that make BioWe your trusted partner in organic gardening.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl overflow-hidden">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold tracking-tight text-secondary mb-6">Our Journey to a Greener World</h2>
              <div className="space-y-4 text-foreground/90">
                <p>
                  BioWe was born from a simple yet profound love for the earth and a desire to make sustainable gardening accessible to everyone. We saw a need for high-quality, organic solutions that work in harmony with nature, not against it.
                </p>
                <p>
                  Our journey began with a small team of passionate horticulturalists, soil scientists, and eco-conscious individuals. We spent years researching, experimenting, and perfecting our formulations, always guided by the principle of "earth-kind" effectiveness.
                </p>
                <p>
                  Today, BioWe is proud to offer a comprehensive range of products that empower gardeners of all levels to cultivate thriving, healthy green spaces while respecting our planet.
                </p>
              </div>
            </div>
            <div className="aspect-video md:aspect-auto md:h-full relative order-first md:order-last">
              <PexelsImage
                initialSrc="https://placehold.co/600x450.png"
                altText="Founders collaborating in a natural setting"
                aiHint="people nature collaboration"
                orientation="landscape"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
          </div>
        </Card>
      </section>

      {/* Our Mission Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 bg-muted rounded-xl shadow-md">
        <Target className="mx-auto h-12 w-12 text-primary mb-4" />
        <h2 className="text-3xl font-bold tracking-tight text-secondary mb-4">Our Mission</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          To empower and inspire a global community of gardeners to cultivate thriving, sustainable green spaces by providing innovative, high-quality organic products and expert knowledge.
        </p>
      </section>

      {/* Our Values Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-center text-secondary mb-12">Our Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value) => (
            <Card key={value.title} className="text-center shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader className="items-center">
                {value.icon}
                <CardTitle className="text-xl">{value.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      
      {/* Our Commitment Section */}
       <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl overflow-hidden bg-secondary text-secondary-foreground">
          <div className="grid md:grid-cols-2 items-center">
             <div className="aspect-video md:aspect-auto md:h-full relative">
              <PexelsImage
                initialSrc="https://placehold.co/600x450.png"
                altText="Close-up of healthy plant thriving"
                aiHint="healthy plant soil"
                orientation="landscape"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
              />
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold tracking-tight mb-6">Our Commitment to You & The Planet</h2>
              <div className="space-y-4 text-secondary-foreground/90">
                <p>
                  At BioWe, we believe that healthy gardens and a healthy planet go hand-in-hand. Our commitment extends beyond just selling products. We are dedicated to:
                </p>
                <ul className="list-disc list-outside ml-5 space-y-2">
                  <li><strong>Eco-Conscious Sourcing:</strong> Utilizing renewable resources and environmentally friendly ingredients.</li>
                  <li><strong>Product Efficacy:</strong> Ensuring our solutions deliver visible results, helping your plants flourish.</li>
                  <li><strong>Knowledge Sharing:</strong> Providing educational content and support to help you succeed in your gardening endeavors.</li>
                  <li><strong>Community Building:</strong> Fostering a network of like-minded individuals passionate about organic gardening.</li>
                </ul>
                <p>
                  Choose BioWe, and join us in making the world a little greener, one garden at a time.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Heart className="mx-auto h-12 w-12 text-primary mb-4" />
          <h2 className="text-3xl font-bold text-secondary mb-6">Ready to Grow With Us?</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10">
            Explore our range of premium organic products or reach out to our team for expert gardening advice.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/products">Discover Our Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="shadow-md hover:shadow-lg transition-shadow">
              <Link href="/contact">Contact Our Experts</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
