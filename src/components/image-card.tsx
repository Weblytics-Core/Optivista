
"use client";

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import type { SiteImage } from '@/lib/types';
import { processImageUrl } from '@/lib/utils';
import { WatermarkedImage } from './watermarked-image';

interface ImageCardProps {
  image: SiteImage;
  onImageClick: () => void;
}

export function ImageCard({ image, onImageClick }: ImageCardProps) {
  return (
    <Card className="overflow-hidden group w-full cursor-pointer" onClick={onImageClick}>
      <CardContent className="p-0">
        <div className="aspect-square relative overflow-hidden">
          <WatermarkedImage
            src={processImageUrl(image.url)}
            alt={image.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            objectFit="cover"
            data-ai-hint={image.aiHint}
            watermarkText="Optivista"
            watermarkEnabled={false}
          />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
           <div className="absolute bottom-0 left-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 w-full">
              <h3 className="font-bold text-lg truncate font-headline text-white [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">{image.name}</h3>
           </div>
        </div>
      </CardContent>
    </Card>
  );
}
