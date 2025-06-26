"use client"

import React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import { type Testimonial } from '@/types'
import { TestimonialCard } from './TestimonialCard'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
} from '@/components/ui/carousel'

interface TestimonialsCarouselProps {
  testimonials: Testimonial[]
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const autoplayPlugin = React.useRef(
    Autoplay({ 
      delay: 4000, 
      stopOnInteraction: true,
      stopOnMouseEnter: true 
    })
  )

  if (!testimonials || testimonials.length === 0) {
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
          {testimonials.map((testimonial) => (
            <CarouselItem 
              key={testimonial.id} 
              className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full">
                <TestimonialCard testimonial={testimonial} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation Arrows */}
        <CarouselPrevious className="hidden md:flex -left-12 lg:-left-16" />
        <CarouselNext className="hidden md:flex -right-12 lg:-right-16" />
        
        {/* Dots Indicator */}
        <CarouselDots count={testimonials.length} className="mt-8" />
      </Carousel>
    </div>
  )
}