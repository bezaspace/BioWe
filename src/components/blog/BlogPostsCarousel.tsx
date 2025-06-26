"use client"

import React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { type BlogPost } from '@/types'
import { BlogPostCard } from './BlogPostCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'

interface BlogPostsCarouselProps {
  posts: BlogPost[]
}

export function BlogPostsCarousel({ posts }: BlogPostsCarouselProps) {
  const autoplayPlugin = React.useRef(
    Autoplay({ 
      delay: 5000, 
      stopOnInteraction: true,
      stopOnMouseEnter: true 
    })
  )

  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      <Carousel
        opts={{
          align: "start",
          loop: true,
          skipSnaps: false,
          dragFree: false,
        }}
        plugins={[autoplayPlugin.current]}
        className="w-full"
        onMouseEnter={() => autoplayPlugin.current.stop()}
        onMouseLeave={() => autoplayPlugin.current.reset()}
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {posts.map((post) => (
            <CarouselItem 
              key={post.id} 
              className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full">
                <BlogPostCard post={post} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
        <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
        
        {/* Dots Indicator */}
        <CarouselDots count={posts.length} className="mt-8" />
      </Carousel>
    </div>
  )
}