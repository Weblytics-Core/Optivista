
"use client";

import React, { useState, useMemo } from 'react';
import { ImageCard } from '@/components/image-card';
import type { SiteImage } from '@/lib/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ImageIcon, ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ImageDetailDialog } from '@/components/image-detail-dialog';

const IMAGES_PER_PAGE = 12;

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(IMAGES_PER_PAGE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const firestore = useFirestore();

  const imagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'images');
  }, [firestore]);

  const { data: allImages, isLoading, error } = useCollection<SiteImage>(imagesCollectionRef);

  const categories = useMemo(() => {
    if (!allImages) return ['all'];
    return ['all', ...Array.from(new Set(allImages.map(img => img.category)))];
  }, [allImages]);

  const filteredImages = useMemo(() => {
    if (!allImages) return [];
    if (filter === 'all') {
      return allImages;
    }
    return allImages.filter(image => image.category === filter);
  }, [filter, allImages]);

  const imagesToShow = useMemo(() => {
    return filteredImages.slice(0, visibleCount);
  }, [filteredImages, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + IMAGES_PER_PAGE);
  };
  
  // Reset visible count when filter changes
  React.useEffect(() => {
    setVisibleCount(IMAGES_PER_PAGE);
  }, [filter]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
             <div key={i} className="space-y-2">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
             </div>
          ))}
        </div>
      );
    }

    if (error) {
       return (
        <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Error Fetching Images</AlertTitle>
            <AlertDescription>
                There was a problem loading the gallery. Please try again later.
            </AlertDescription>
        </Alert>
       )
    }

    if (!allImages || allImages.length === 0) {
        return (
            <div className="text-center col-span-full py-16">
                <ImageIcon className="mx-auto h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">The gallery is empty</h3>
                <p className="mt-2 text-muted-foreground">Check back later for new photos.</p>
            </div>
        )
    }

    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {imagesToShow.map((image, index) => (
              <ImageCard key={image.id} image={image} onImageClick={() => setSelectedIndex(index)} />
            ))}
        </div>
        {visibleCount < filteredImages.length && (
          <div className="mt-12 text-center">
            <Button onClick={handleLoadMore} size="lg" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Load More
            </Button>
          </div>
        )}
      </>
    )
  }


  return (
    <>
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">Our Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our collection of high-quality images. Find the perfect shot for your next project.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <Tabs value={filter} onValueChange={setFilter}>
            <TabsList className="grid w-full h-auto sm:flex sm:flex-wrap">
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className="capitalize">
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
        
        {renderContent()}

      </div>
      {selectedIndex !== null && (
        <ImageDetailDialog 
            images={filteredImages}
            initialIndex={selectedIndex}
            onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  );
}
