
"use client";

import { notFound, useParams } from 'next/navigation'; // Import useParams
import type { BlogPost } from '@/types';
import { mockBlogPosts } from '@/lib/mock-data';
import { CalendarDays, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PexelsImage } from '@/components/shared/PexelsImage';
import { useEffect, useState } from 'react';

// This function would typically fetch from a CMS or database.
// For client-side fetching, we'll adapt it slightly.
async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  // Simulating async fetch for mock data
  return Promise.resolve(mockBlogPosts.find(post => post.slug === slug));
}

export default function BlogPostPage() { // Removed params from props
  const params = useParams<{ slug: string }>(); // Use the hook
  const slug = params?.slug; // Get slug from params

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setIsLoading(true);
      getPostBySlug(slug).then(fetchedPost => {
        if (fetchedPost) {
          setPost(fetchedPost);
        }
        // If fetchedPost is undefined, the `if (!post && !isLoading)` check later will handle notFound()
        setIsLoading(false);
      }).catch(error => {
        console.error("Error fetching blog post:", error);
        setIsLoading(false);
        // Potentially trigger notFound() here too, or rely on the existing check
      });
    } else if (params && !slug && !isLoading) {
      // This condition might be hit if params are resolved but slug is unexpectedly missing
      // However, the primary check `if (!post && !isLoading)` after the effect should catch this
    }
  }, [slug]); // Depend on slug from useParams

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader ease-linear rounded-full border-4 border-t-4 border-muted h-12 w-12 mb-4 animate-spin border-t-primary"></div>
        <p className="ml-4 text-lg">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    // If still no post after loading, and notFound hasn't been triggered by routing,
    // explicitly call it. Note: `notFound()` only works as expected during rendering from Server Components.
    // In client components, you might redirect or show a custom "not found" UI.
    // For simplicity here, we rely on initial load or a redirect if Next.js routing handles it.
    // If getPostBySlug truly can't find it, this is where you'd handle it.
    // A robust solution might involve `router.replace('/404')` if `useRouter` is used.
    notFound(); // Call this to trigger Next.js's not found mechanism
    return null; // Ensure component returns null after calling notFound
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <Button variant="outline" asChild>
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Link>
        </Button>
      </div>

      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="p-0">
          <div className="aspect-[16/9] relative w-full">
            <PexelsImage
              initialSrc={post.imageSrc} // Original placeholder
              altText={post.imageAlt}
              aiHint={post.dataAiHint}
              orientation="landscape"
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority
            />
          </div>
        </CardHeader>
        <CardContent className="p-6 sm:p-8">
          <CardTitle className="text-3xl sm:text-4xl font-bold tracking-tight text-secondary mb-6">
            {post.title}
          </CardTitle>
          
          <div className="flex flex-wrap items-center text-sm text-muted-foreground mb-6 space-x-4">
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1.5" />
              <span>{new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          <div
            className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-4"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

// Metadata generation for client components is handled differently, often via a custom hook or useEffect.
// For this example, we'll remove generateMetadata as it's for Server Components.
// export async function generateMetadata({ params }: { params: { slug: string } }) {
//   // ...
// }

