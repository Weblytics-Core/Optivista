
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, ArrowRight, X, Download } from "lucide-react";
import type { SiteImage, UserProfileData } from '@/lib/types';
import { processImageUrl } from '@/lib/utils';
import { useUser, useFirestore, addDocumentNonBlocking, useDoc, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ImageDetailDialogProps {
  images: SiteImage[];
  initialIndex: number | null;
  onClose: () => void;
}

export function ImageDetailDialog({ images, initialIndex, onClose }: ImageDetailDialogProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userData } = useDoc<UserProfileData>(userDocRef);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex !== null && currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  }, [currentIndex, images.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex !== null && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  }, [currentIndex]);
  
  const handleDownload = async () => {
    if (!image || !user || !userData || !firestore) {
      toast({
        title: "Download failed",
        description: "You must be logged in to download images.",
        variant: "destructive",
      });
      return;
    }
  
    try {
      // 1. Log the download event to Firestore
      const downloadsCollectionRef = collection(firestore, 'downloads');
      const downloadData = {
        userId: user.uid,
        userEmail: user.email,
        userName: `${userData.firstName} ${userData.lastName}`,
        imageId: image.id,
        imageName: image.name,
        imageUrl: image.url,
        downloadDate: serverTimestamp(),
      };
      addDocumentNonBlocking(downloadsCollectionRef, downloadData);
  
      // 2. Trigger the file download
      // Using fetch to get the image as a blob, which works for cross-origin resources
      const response = await fetch(processImageUrl(image.url));
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
      }
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
  
      const link = document.createElement('a');
      link.href = objectUrl;
      const fileName = image.name.replace(/ /g, '_') + '.' + (blob.type.split('/')[1] || 'jpg');
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      
      // 3. Clean up
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
  
      toast({
        title: "Download Started",
        description: `Downloading "${image.name}"...`,
      });
    } catch (error: any) {
      console.error("Download error:", error);
      toast({
        title: "Download Failed",
        description: error.message || "Could not download the image. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, onClose]);


  if (currentIndex === null || !images[currentIndex]) {
    return null;
  }
  
  const image = images[currentIndex];
  const canGoPrev = currentIndex > 0;
  const canGoNext = currentIndex < images.length - 1;

  return (
    <Dialog open={currentIndex !== null} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-6xl w-11/12 p-0 h-[90vh] flex flex-col">
        <DialogHeader className="sr-only">
          <DialogTitle>{image.name}</DialogTitle>
        </DialogHeader>
        <div className="relative flex-1 flex items-center justify-center bg-black/90">
             <Image 
                src={processImageUrl(image.url)}
                alt={image.name}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 80vw"
                data-ai-hint={image.aiHint}
              />

            {canGoPrev && (
                <Button variant="ghost" size="icon" onClick={handlePrev} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white">
                    <ArrowLeft className="h-6 w-6" />
                </Button>
            )}
            {canGoNext && (
                 <Button variant="ghost" size="icon" onClick={handleNext} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-black/30 hover:bg-black/50 text-white">
                    <ArrowRight className="h-6 w-6" />
                </Button>
            )}
             <Button variant="ghost" size="icon" onClick={onClose} className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/30 hover:bg-black/50 text-white">
                 <X className="h-6 w-6" />
             </Button>
        </div>

        <div className="p-6 bg-card border-t shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className='max-w-prose'>
              <h2 className="text-2xl font-headline font-bold">{image.name}</h2>
              <p className="text-muted-foreground capitalize text-sm">{image.category}</p>
              <p className="text-foreground/80 mt-2">{image.description}</p>
            </div>
            {user && (
              <Button onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
