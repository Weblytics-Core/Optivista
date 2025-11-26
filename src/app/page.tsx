import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import imageData from '@/lib/placeholder-images.json';
import type { SiteImage } from '@/lib/types';
import { ContactForm } from '@/components/contact-form';
import { processImageUrl } from '@/lib/utils';
import { WatermarkedImage } from '@/components/watermarked-image';
import { getAdminFirestore } from '@/firebase/server';

export const metadata: Metadata = {
  title: 'Optivista',
  description: 'A modern photography portfolio.',
};

type Settings = {
  siteName?: string;
  heroHeadline?: string;
  heroSubheadline?: string;
  [key: string]: string | undefined;
};

async function getSettings(): Promise<Settings> {
  try {
    const firestore = getAdminFirestore();

    // Admin SDK style: use .collection(...).get()
    const configSnapshot = await firestore.collection('configurations').get();

    const settings = configSnapshot.docs.reduce<Settings>((acc, doc) => {
      const data = doc.data() as { key?: string; value?: unknown };

      if (data.key) {
        acc[data.key] =
          typeof data.value === 'string'
            ? data.value
            : String(data.value ?? '');
      }

      return acc;
    }, {});

    return settings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);

    // Default settings on error
    return {
      siteName: 'Optivista',
      heroHeadline:
        'Discover stunning, high-resolution photography from around India.',
    };
  }
}

export default async function Home() {
  const images = (imageData.placeholderImages as SiteImage[]).slice(2, 5);
  const heroImage =
    (imageData.placeholderImages as SiteImage[]).find((img) => img.id === '1') ||
    (imageData.placeholderImages as SiteImage[])[0];

  const settings = await getSettings();

  const siteName = settings.siteName || 'Optivista';
  const heroHeadline =
    settings.heroHeadline ||
    'Discover stunning, high-resolution photography from around the world.';
  const heroSubheadline =
    settings.heroSubheadline ||
    'Explore our curated collection of fine art photography.';

  return (
    <>
      <section className="relative w-full h-[calc(100vh-4rem)]">
        <WatermarkedImage
          src={processImageUrl(heroImage.url)}
          alt={heroImage.name}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.aiHint}
          watermarkText={siteName}
          watermarkEnabled={false}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <h1 className="text-3xl md:text-5xl font-headline font-bold text-white mb-4 max-w-3xl">
              {heroHeadline}
            </h1>
            <p className="text-base md:text-lg text-gray-200 max-w-2xl mb-6">
              {heroSubheadline}
            </p>
            <Button asChild>
              <Link href="/gallery">
                Explore Gallery
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <div className="flex flex-col">
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
              Featured Photos
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {images.map((image) => (
                <Card
                  key={image.id}
                  className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                >
                  <CardContent className="p-0">
                    <div className="aspect-[4/3] relative">
                      <WatermarkedImage
                        src={processImageUrl(image.url)}
                        alt={image.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        data-ai-hint={image.aiHint}
                        watermarkText={siteName}
                        watermarkEnabled={false}
                      />
                    </div>
                    <div className="p-4 bg-card">
                      <h3 className="font-bold text-lg truncate">{image.name}</h3>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-12">
              <Button asChild variant="outline">
                <Link href="/gallery">View All</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">
                Contact Me
              </h2>
              <p className="text-lg text-muted-foreground">
                Have a question or a project in mind? I&apos;d love to hear from you.
              </p>
            </div>
            <div className="max-w-2xl mx-auto mt-12">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
