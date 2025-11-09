
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Camera } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import imageData from '@/lib/placeholder-images.json';
import type { SiteImage } from '@/lib/types';
import { ContactForm } from '@/components/contact-form';
import { processImageUrl } from '@/lib/utils';

export default function Home() {
  const images = (imageData.placeholderImages as SiteImage[]).slice(2, 4);
  const heroImage = (imageData.placeholderImages as SiteImage[]).find(img => img.id === '1') || (imageData.placeholderImages as SiteImage[])[0];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="relative w-full h-[60vh] md:h-[75vh] flex items-center justify-center text-center text-white">
        <Image
          src={processImageUrl(heroImage.url)}
          alt={heroImage.name}
          fill
          className="object-cover"
          priority
          data-ai-hint={heroImage.aiHint}
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4 flex flex-col items-center">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 mb-4">
            <Camera className="w-8 h-8 text-white" />
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
              Optivista
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-neutral-100 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            Discover stunning, high-resolution photography from around the world.
          </p>
          <Button asChild size="lg" className="mt-8 group">
            <Link href="/gallery">
              Explore Gallery <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Featured Photos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={processImageUrl(image.url)}
                      alt={image.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      data-ai-hint={image.aiHint}
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
            <h2 className="text-3xl md:text-4xl font-headline font-bold mb-2">Contact Me</h2>
            <p className="text-lg text-muted-foreground">
              Have a question or a project in mind? I'd love to hear from you.
            </p>
          </div>
          <div className="max-w-2xl mx-auto mt-12">
            <ContactForm />
          </div>
        </div>
      </section>
    </div>
  );
}
