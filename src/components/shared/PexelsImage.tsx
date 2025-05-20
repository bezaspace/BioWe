
"use client";

import Image from 'next/image';
import type { ImageProps as NextImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface PexelsImageProps extends Omit<NextImageProps, 'src' | 'alt'> {
  initialSrc: string;
  altText: string;
  aiHint: string;
  orientation?: 'landscape' | 'portrait' | 'square';
}

const PEXELS_API_KEY = 'DdWPcf1SxT9pcCdjeeeHLrDsXWtB19DNYIMPM3YskpPjkDdKpjIlo0QO';

async function fetchPexelsImage(query: string, orientation: PexelsImageProps['orientation'] = 'landscape'): Promise<string | null> {
  if (!query) return null;
  try {
    const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=${orientation}`, {
      headers: { Authorization: PEXELS_API_KEY },
    });
    if (!response.ok) {
      console.error(`Pexels API error for query "${query}": ${response.status} ${await response.text()}`);
      return null;
    }
    const data = await response.json();
    return data.photos?.[0]?.src.large2x || data.photos?.[0]?.src.original || null;
  } catch (error) {
    console.error(`Error fetching from Pexels for query "${query}":`, error);
    return null;
  }
}

export const PexelsImage: React.FC<PexelsImageProps> = ({
  initialSrc,
  altText,
  aiHint,
  orientation = 'landscape',
  className,
  fill = true, // Default to fill as it's common in the app
  priority,
  sizes,
  ...rest
}) => {
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [isPexelsLoading, setIsPexelsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (aiHint) {
      setIsPexelsLoading(true);
      setCurrentSrc(initialSrc); // Reset to initialSrc before fetching new one
      fetchPexelsImage(aiHint, orientation)
        .then(pexelsUrl => {
          if (isMounted) {
            if (pexelsUrl) {
              setCurrentSrc(pexelsUrl);
            }
            // If pexelsUrl is null, currentSrc remains initialSrc after this fetch attempt
            setIsPexelsLoading(false);
          }
        })
        .catch(() => { // Error already logged in fetchPexelsImage
          if (isMounted) {
            setIsPexelsLoading(false); // Ensure loading stops on error
          }
        });
    } else {
      setIsPexelsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [aiHint, orientation, initialSrc]);

  return (
    <Image
      key={currentSrc} // Forces re-render if src changes, helps with loading states
      src={currentSrc}
      alt={altText}
      fill={fill}
      sizes={sizes}
      className={cn(
        className,
        isPexelsLoading && currentSrc === initialSrc && 'opacity-60 animate-pulse bg-muted-foreground/10',
        !isPexelsLoading && currentSrc !== initialSrc && 'opacity-100 transition-opacity duration-700'
      )}
      priority={priority && currentSrc === initialSrc} // Prioritize only if it's the initial server-rendered image
      data-ai-hint={aiHint} // Keep for debugging or future use
      onError={() => {
        if (currentSrc !== initialSrc) {
          setCurrentSrc(initialSrc); // Fallback to placeholder if Pexels URL fails
        }
        setIsPexelsLoading(false); // Ensure loading state is cleared
      }}
      onLoadingComplete={() => {
        // This will be called when next/image finishes loading currentSrc.
        // If currentSrc is the pexelsUrl, we are truly done.
        if (currentSrc !== initialSrc) {
           // We can potentially remove the pulse animation here if it wasn't handled by opacity transition alone
        }
      }}
      {...rest}
    />
  );
};
