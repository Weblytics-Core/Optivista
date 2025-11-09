'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ArrowRight } from 'lucide-react';
import imageData from '@/lib/placeholder-images.json';
import type { SiteImage } from '@/lib/types';
import { processImageUrl } from '@/lib/utils';

export default function CartPage() {
  const placeholderImages = imageData.placeholderImages as SiteImage[];

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-background">
      {/* Header Section */}
      <section className="relative w-full h-[40vh] flex items-center justify-center text-center text-white">
        <Image
          src={processImageUrl(placeholderImages[1]?.url || '/placeholder.jpg')}
          alt="Cart Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 p-4 flex flex-col items-center">
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 mb-4">
            <ShoppingCart className="w-8 h-8 text-white" />
            <h1 className="text-4xl md:text-6xl font-headline font-bold tracking-tight text-white [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">
              Your Cart
            </h1>
          </div>
          <p className="mt-2 max-w-2xl text-lg md:text-xl text-neutral-100 [text-shadow:0_1px_4px_rgba(0,0,0,0.6)]">
            Review your selected photos before checkout.
          </p>
        </div>
      </section>

      {/* Cart Section */}
      <section className="flex-1 py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-center mb-12">
            Items in Your Cart
          </h2>

          {/* Example Empty State */}
          <div className="flex flex-col items-center justify-center text-center py-24">
            <ShoppingCart className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground mb-6">
              Your cart is currently empty.
            </p>
            <Button asChild size="lg" className="group">
              <Link href="/gallery">
                Browse Gallery
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          {/* Example: When items exist (you can replace this logic later) */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {placeholderImages.slice(0, 3).map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <CardContent className="p-0">
                  <div className="aspect-[4/3] relative">
                    <Image
                      src={processImageUrl(item.url)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                  <div className="p-4 bg-card">
                    <h3 className="font-bold text-lg truncate">{item.name}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-muted-foreground">$25</span>
                      <Button variant="destructive" size="sm">
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div> */}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-headline font-bold mb-4">
            Ready to explore more photos?
          </h2>
          <Button asChild variant="outline" size="lg">
            <Link href="/gallery">Go to Gallery</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
