
'use client';

import React from 'react';
import { useFirestore, useCollection, useMemoFirebase, useUser, useDoc } from '@/firebase';
import { collection, orderBy, query, doc } from 'firebase/firestore';
import type { ImageDownload, UserProfileData } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert, DownloadCloud, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { processImageUrl } from '@/lib/utils';

export default function AdminDownloadsPage() {
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();

  const userDocRef = useMemoFirebase(() => (user ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc<UserProfileData>(userDocRef);
  
  const isAdmin = userData?.role === 'admin';

  const downloadsCollectionRef = useMemoFirebase(() => {
    if (firestore && isAdmin) {
        return query(collection(firestore, 'downloads'), orderBy('downloadDate', 'desc'));
    }
    return null;
  }, [firestore, isAdmin]);

  const { data: downloads, isLoading: areDownloadsLoading, error } = useCollection<ImageDownload>(downloadsCollectionRef);

  const renderContent = () => {
    if (isUserLoading || isUserDataLoading) {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                <TableCell><Skeleton className="h-5 w-40" /></TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      );
    }
    
    if (!isAdmin) {
       return (
        <Alert variant="destructive">
          <ShieldAlert className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to view this page.
          </AlertDescription>
        </Alert>
       );
    }
    
    if (areDownloadsLoading) {
       return (
        <Table>
          <TableHeader>
             <TableRow>
                <TableHead className="w-[100px]">Image</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Downloaded On</TableHead>
             </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="h-10 w-10 rounded-md" /></TableCell>
                <TableCell>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </TableCell>
                <TableCell><Skeleton className="h-5 w-28" /></TableCell>
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
          <AlertTitle>Error Fetching Downloads</AlertTitle>
          <AlertDescription>
            There was a problem loading the download logs. It might be a permission issue with Firestore.
          </AlertDescription>
        </Alert>
      );
    }

    if (!downloads || downloads.length === 0) {
      return (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <DownloadCloud className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-xl font-semibold">No downloads yet</h3>
          <p className="mt-2 text-muted-foreground">When users download images, the records will appear here.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>User</TableHead>
            <TableHead>Image Name</TableHead>
            <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {downloads.map((download) => (
            <TableRow key={download.id}>
              <TableCell>
                 <Link href={processImageUrl(download.imageUrl)} target="_blank" rel="noopener noreferrer">
                    <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage src={processImageUrl(download.imageUrl)} />
                        <AvatarFallback><ImageIcon /></AvatarFallback>
                    </Avatar>
                 </Link>
              </TableCell>
              <TableCell>
                <div className="font-medium">{download.userName}</div>
                <div className="text-sm text-muted-foreground">{download.userEmail}</div>
              </TableCell>
              <TableCell className="font-medium">{download.imageName}</TableCell>
              <TableCell className="hidden sm:table-cell text-right">
                {download.downloadDate ? format(new Date(download.downloadDate.seconds * 1000), 'dd MMM, yyyy, hh:mm a') : 'N/A'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Download Log</CardTitle>
        <CardDescription>A log of all images downloaded by users.</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
}
