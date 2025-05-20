
import Image from 'next/image';
import { notFound } from 'next/navigation';
import type { BlogPost } from '@/types';
import { mockBlogPosts } from '@/lib/mock-data';
import { CalendarDays, UserCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  // In a real app, you'd fetch this from a CMS or database
  return Promise.resolve(mockBlogPosts.find(post => post.slug === slug));
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
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
            <Image
              src={post.imageSrc}
              alt={post.imageAlt}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
              priority // Prioritize loading the main blog image
              data-ai-hint={post.dataAiHint}
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
            <div className="flex items-center">
              <UserCircle className="h-4 w-4 mr-1.5" />
              <span>By {post.author}</span>
            </div>
          </div>

          {/* For rich text content, you might use a Markdown renderer here in a real app */}
          <div className="prose prose-lg dark:prose-invert max-w-none text-foreground space-y-4">
            {post.content.split('\\n\\n').map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Optional: Generate static paths if you have a known, limited number of posts
// export async function generateStaticParams() {
//   return mockBlogPosts.map((post) => ({
//     slug: post.slug,
//   }));
// }

// Optional: Add metadata for each blog post
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }
  return {
    title: `${post.title} | BioWe Blog`,
    description: post.excerpt,
  };
}
