
"use client";

import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
  maxStars?: number;
  starClassName?: string;
  showReviewCount?: boolean;
}

export function StarRating({
  rating,
  reviewCount,
  maxStars = 5,
  starClassName,
  showReviewCount = true,
}: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5; // Consider 0.5 and above as a half star for display as full for simplicity
  const displayRating = Math.round(rating * 2) / 2; // Rounds to nearest 0.5

  const filledStarsCount = Math.floor(displayRating);
  // For simplicity, we'll show full stars for .5 ratings as well, rather than implementing a StarHalf icon
  // If you want to show a half star icon, you'd need to adjust this logic and import StarHalf
  const effectiveFilledStars = Math.ceil(displayRating); 

  return (
    <div className="flex items-center space-x-1">
      <div className="flex">
        {[...Array(maxStars)].map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < effectiveFilledStars ? 'text-primary fill-primary' : 'text-muted-foreground/50',
              starClassName
            )}
          />
        ))}
      </div>
      {showReviewCount && reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground">({reviewCount})</span>
      )}
    </div>
  );
}
