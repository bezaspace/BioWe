
import { BlogPostCard } from '@/components/blog/BlogPostCard';
import type { BlogPost } from '@/types';
import { mockBlogPosts } from '@/lib/mock-data';
import { Rss } from 'lucide-react';

async function getBlogPosts(): Promise<BlogPost[]> {
  // In a real app, you'd fetch this from a CMS or database
  return Promise.resolve(mockBlogPosts);
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/30 dark:via-emerald-950/30 dark:to-teal-900/30 rounded-xl shadow-md">
        <Rss className="mx-auto h-16 w-16 text-secondary mb-6" />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-secondary mb-4">
          The BioWe Blog
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your source for gardening tips, plant care advice, and insights into sustainable living from the experts at BioWe.
        </p>
      </section>

      {posts.length > 0 ? (
        <section>
          <h2 className="text-3xl font-bold tracking-tight text-secondary mb-8 text-center sm:text-left">
            Latest Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center py-10">
          <Rss className="mx-auto h-20 w-20 text-muted-foreground mb-6" />
          <h2 className="text-2xl font-semibold mb-4">No Blog Posts Yet</h2>
          <p className="text-muted-foreground">
            We're busy cultivating some great content! Check back soon for our latest articles.
          </p>
        </section>
      )}

      {/* Potential future sections: Categories, Featured Post, Newsletter Signup */}
    </div>
  );
}
