
"use client";

import type { Testimonial } from '@/types';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const PEXELS_API_KEY_TESTIMONIAL = 'DdWPcf1SxT9pcCdjeeeHLrDsXWtB19DNYIMPM3YskpPjkDdKpjIlo0QO';

async function fetchPexelsAvatar(query: string): Promise<string | null> {
  if (!query) return null;
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=square&size=small`, { // size=small for avatar
      headers: { Authorization: PEXELS_API_KEY_TESTIMONIAL },
    });
    if (!response.ok) {
      console.error(`Pexels API error for avatar query "${query}": ${response.status} ${await response.text()}`);
      return null;
    }
    const data = await response.json();
    return data.photos?.[0]?.src.avatar || data.photos?.[0]?.src.tiny || data.photos?.[0]?.src.small || null;
  } catch (error) {
    console.error(`Error fetching avatar from Pexels for query "${query}":`, error);
    return null;
  }
}


export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const authorInitial = testimonial.author.charAt(0).toUpperCase();
  const [avatarSrc, setAvatarSrc] = useState(testimonial.avatarSrc); // Initial placeholder

  useEffect(() => {
    let isMounted = true;
    if (testimonial.dataAiHint && testimonial.avatarSrc && testimonial.avatarSrc.includes('placehold.co')) { // Only fetch if it's a placeholder
      fetchPexelsAvatar(testimonial.dataAiHint)
        .then(pexelsUrl => {
          if (isMounted && pexelsUrl) {
            setAvatarSrc(pexelsUrl);
          }
        })
        .catch(console.error);
    }
    return () => {
      isMounted = false;
    };
  }, [testimonial.dataAiHint, testimonial.avatarSrc]);


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
          {testimonial.avatarSrc && ( // Keep this condition, avatarSrc is now dynamic
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={avatarSrc} // Use state variable
                alt={testimonial.author} 
                // data-ai-hint={testimonial.dataAiHint} // Not directly on AvatarImage
              />
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
