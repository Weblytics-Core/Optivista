
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useDoc, useMemoFirebase, updateDocumentNonBlocking, useStorage } from '@/firebase';
import { doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Loader2 } from 'lucide-react';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  photoURL?: string;
}


export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const storage = useStorage();
  const { toast } = useToast();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return doc(firestore, 'users', user.uid);
  }, [user, firestore]);
  const { data: userData, isLoading: isUserDocLoading } = useDoc<UserProfile>(userDocRef);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const userInitial = userData?.firstName?.charAt(0).toUpperCase();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName);
      setLastName(userData.lastName);
    }
  }, [userData]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDocRef) return;
    setIsSaving(true);
    
    const updatedData = { firstName, lastName };
    updateDocumentNonBlocking(userDocRef, updatedData);

    toast({
      title: 'Profile Updated',
      description: 'Your changes have been saved.',
    });
    setIsSaving(false);
    setIsEditing(false);
  };
  
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user || !storage) return;

    setIsUploading(true);

    try {
      const storageRef = ref(storage, `profile-pictures/${user.uid}/${file.name}`);
      const uploadResult = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      await updateProfile(user, { photoURL: downloadURL });
      
      if(userDocRef) {
        updateDocumentNonBlocking(userDocRef, { photoURL: downloadURL });
      }

      toast({
        title: "Profile Picture Updated",
        description: "Your new picture has been saved.",
      });

    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message || "There was a problem uploading your picture.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (isUserLoading || !user) {
    return (
      <div className="container mx-auto px-4 py-8 sm:py-16">
        <Skeleton className="h-10 w-1/4 mb-8" />
        <Card>
          <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <h1 className="text-4xl md:text-5xl font-headline font-bold mb-8">My Profile</h1>
      <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="items-center text-center">
               <div className="relative">
                <Avatar className="w-24 h-24 text-4xl">
                  <AvatarImage src={user.photoURL ?? userData?.photoURL} alt="Profile Picture" />
                  <AvatarFallback>{userInitial}</AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/jpeg"
                  disabled={isUploading}
                />
                <Button
                  size="icon"
                  className="absolute bottom-0 right-0 rounded-full h-8 w-8"
                  onClick={handleAvatarClick}
                  disabled={isUploading}
                  aria-label="Change profile picture"
                >
                  {isUploading ? <Loader2 className="animate-spin" /> : <Camera className="h-4 w-4" />}
                </Button>
              </div>
              <CardTitle className="font-headline pt-4">Personal Details</CardTitle>
              <CardDescription>View and update your information.</CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                {isUserDocLoading ? (
                  <>
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={!isEditing || isSaving} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={!isEditing || isSaving} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={userData?.email || ''} disabled />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                )}
              </CardFooter>
            </form>
          </Card>
      </div>
    </div>
  );
}
