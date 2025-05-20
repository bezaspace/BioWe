
"use client";

import Image from 'next/image';
import type { Testimonial } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const authorInitial = testimonial.author.charAt(0).toUpperCase();

  return (
    <Card className="flex flex-col h-full shadow-lg hover:shadow-xl transition-shadow duration-300 bg-background">
      <CardHeader className="pb-4">
        <Quote className="w-8 h-8 text-primary mb-2 transform -scale-x-100" />
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-foreground/80 italic leading-relaxed">"{testimonial.quote}"</p>
      </CardContent>
      <CardFooter className="pt-4 mt-auto border-t border-border">
        <div className="flex items-center space-x-3">
          {testimonial.avatarSrc && (
            <Avatar className="h-12 w-12">
              <AvatarImage src={testimonial.avatarSrc} alt={testimonial.author} data-ai-hint={testimonial.dataAiHint} />
              <AvatarFallback>{authorInitial}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <p className="font-semibold text-secondary">{testimonial.author}</p>
            {testimonial.role && <p className="text-sm text-muted-foreground">{testimonial.role}</p>}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
