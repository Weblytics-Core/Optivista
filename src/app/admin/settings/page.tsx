
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { collection, doc, query, writeBatch } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface Config {
  id: string;
  key: string;
  value: string;
}

type Settings = {
  siteName: string;
  heroHeadline: string;
  heroSubheadline: string;
};

export default function AdminSettingsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const configCollectionRef = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'configurations');
  }, [firestore]);
  
  const { data: configs, isLoading } = useCollection<Config>(configCollectionRef);

  const [settings, setSettings] = useState<Settings>({
    siteName: '',
    heroHeadline: '',
    heroSubheadline: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (configs) {
      const settingsData = configs.reduce((acc, config) => {
        // Since key is a valid key of Settings, we can assert the type.
        (acc as any)[config.key as keyof Settings] = config.value;
        return acc;
      }, {} as Settings);
      setSettings(settingsData);
    }
  }, [configs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings(prev => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    if (!firestore) {
        toast({ title: "Error", description: "Firestore not available.", variant: "destructive" });
        return;
    }
    setIsSaving(true);
    try {
        const batch = writeBatch(firestore);
        for (const key in settings) {
            const docRef = doc(firestore, 'configurations', key);
            batch.set(docRef, { key, value: (settings as any)[key] });
        }
        await batch.commit();
        toast({
            title: "Settings Saved",
            description: "Your site settings have been updated.",
        });
    } catch (e: any) {
        toast({
            title: "Error Saving",
            description: e.message || "Could not save settings.",
            variant: "destructive",
        });
    } finally {
        setIsSaving(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
        return (
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="grid gap-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                 <div className="grid gap-3">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        )
    }
    return (
        <form className="grid gap-6">
          <div className="grid gap-3">
            <Label htmlFor="siteName">Site Name</Label>
            <Input
              id="siteName"
              type="text"
              className="w-full"
              value={settings.siteName}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="heroHeadline">Hero Headline</Label>
            <Input
              id="heroHeadline"
              type="text"
              className="w-full"
              value={settings.heroHeadline}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="heroSubheadline">Hero Sub-headline</Label>
            <Textarea
              id="heroSubheadline"
              className="min-h-32"
              value={settings.heroSubheadline}
              onChange={handleInputChange}
              disabled={isSaving}
            />
          </div>
        </form>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Site Settings</CardTitle>
        <CardDescription>
          Manage key-value pairs for your site content.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleSave} disabled={isSaving || isLoading}>
            {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </CardFooter>
    </Card>
  );
}
