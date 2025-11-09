
"use client";

import React from 'react';
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MoreHorizontal, ShieldAlert, UploadCloud, Image as ImageIcon, PlusCircle } from "lucide-react";
import type { SiteImage } from "@/lib/types";
import { AddImageDialog } from '@/components/admin/add-image-dialog';
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc, writeBatch, deleteDoc, getDocs, query } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import placeholderImageData from '@/lib/placeholder-images.json';
import { processImageUrl } from '@/lib/utils';

export default function AdminImagesPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const imagesCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'images');
  }, [firestore]);
  
  const { data: images, isLoading, error, manualRefetch } = useCollection<SiteImage>(imagesCollectionRef);

  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [isSeeding, setIsSeeding] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<SiteImage | null>(null);

  const handleAddImage = (data: Omit<SiteImage, 'id'>) => {
    if (!firestore || !imagesCollectionRef) return;
    const newDocRef = doc(imagesCollectionRef);
    const newImage = { ...data, id: newDocRef.id };
    setDocumentNonBlocking(newDocRef, newImage, { merge: false });
    toast({
      title: "Image Added",
      description: `"${data.name}" has been successfully added.`,
    });
    setIsAddDialogOpen(false);
    manualRefetch();
  };
  
  const handleEditImage = (data: Omit<SiteImage, 'id'>) => {
    if (!selectedImage || !firestore) return;
    const imageDocRef = doc(firestore, 'images', selectedImage.id);
    setDocumentNonBlocking(imageDocRef, data, { merge: true });
    toast({
      title: "Image Updated",
      description: `"${data.name}" has been successfully updated.`,
    });
    setIsEditDialogOpen(false);
    setSelectedImage(null);
    manualRefetch();
  };

  const handleDeleteImage = () => {
    if (!selectedImage || !firestore) return;
    const imageDocRef = doc(firestore, 'images', selectedImage.id);
    deleteDocumentNonBlocking(imageDocRef);

    toast({
      title: "Image Deleted",
      description: `"${selectedImage.name}" has been permanently deleted.`,
      variant: 'destructive',
    });
    setIsDeleteDialogOpen(false);
    setSelectedImage(null);
    manualRefetch();
  };

  const openEditDialog = (image: SiteImage) => {
    setSelectedImage(image);
    setIsEditDialogOpen(true);
  }

  const openDeleteDialog = (image: SiteImage) => {
    setSelectedImage(image);
    setIsDeleteDialogOpen(true);
  }
  
  const handleSeedDatabase = async () => {
    if (!firestore || !imagesCollectionRef) {
        toast({ title: "Error", description: "Firestore not available.", variant: "destructive" });
        return;
    }
    setIsSeeding(true);
    try {
        // Phase 1: Delete all existing images.
        const q = query(imagesCollectionRef);
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            // Using non-blocking delete for faster UI feedback
            deleteDocumentNonBlocking(doc.ref);
        });
        
        // Give deletions a moment to process before adding new ones
        await new Promise(resolve => setTimeout(resolve, 500));

        // Phase 2: Add all new images in a batch.
        const batch = writeBatch(firestore);
        const imagesToSeed = placeholderImageData.placeholderImages as Omit<SiteImage, 'price'>[];
        
        imagesToSeed.forEach(imageData => {
            // Use the id from the JSON file for consistency if available, otherwise generate a new one
            const docRef = imageData.id ? doc(imagesCollectionRef, imageData.id) : doc(imagesCollectionRef);
            batch.set(docRef, { ...imageData, id: docRef.id });
        });

        await batch.commit();
        manualRefetch();

        toast({
            title: "Database Seeded",
            description: `${imagesToSeed.length} placeholder images have been added to Firestore.`,
        });
    } catch (e: any) {
        console.error("Seeding error:", e);
        toast({
            title: "Seeding Failed",
            description: e.message || "Could not add images. Check permissions and Firestore setup.",
            variant: "destructive"
        });
    } finally {
        setIsSeeding(false);
    }
  };
  
  const renderContent = () => {
     if (isLoading) {
      return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-[64px] w-[64px] rounded-md" />
                    </TableCell>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
      );
    }

    if (error) {
       return (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Error Fetching Images</AlertTitle>
          <AlertDescription>
            There was a problem loading your images. It might be a permission issue with Firestore.
          </AlertDescription>
        </Alert>
       );
    }
    
    if (!images || images.length === 0) {
        return (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
                <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-semibold">Your gallery is empty</h3>
                <p className="mt-2 text-muted-foreground">Add an image or seed the database with placeholder content.</p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="hidden w-[100px] sm:table-cell">
                  <span className="sr-only">Image</span>
                </TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {images?.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        alt={image.name}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        src={processImageUrl(image.url)}
                        width="64"
                        data-ai-hint={image.aiHint}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{image.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{image.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openEditDialog(image)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10" onClick={() => openDeleteDialog(image)}>Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
              <CardTitle className="font-headline">Images</CardTitle>
              <CardDescription>Manage your website's photos here.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" disabled={isSeeding}>
                  <UploadCloud className="mr-2 h-4 w-4" />
                  {isSeeding ? 'Seeding...' : 'Seed Database'}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to seed the database?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will delete all current images and replace them with the placeholder content from the JSON file. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSeedDatabase}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Image
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
      
      <AddImageDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
        onFormSubmit={handleAddImage}
        mode="add"
      />

      {selectedImage && (
        <AddImageDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onFormSubmit={handleEditImage}
          initialData={selectedImage}
          mode="edit"
        />
      )}

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the image
              &quot;{selectedImage?.name}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedImage(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteImage} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
