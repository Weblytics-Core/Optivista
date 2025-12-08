import type { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import imageData from '@/lib/placeholder-images.json';
import type { SiteImage } from '@/lib/types';
import { ContactForm } from '@/components/contact-form';
import { processImageUrl } from '@/lib/utils';
import { WatermarkedImage } from '@/components/watermarked-image';

export const metadata: Metadata = {
    title: {
        default: 'Optivista',
        template: `%s | Optivista`,
    },
    description: 'A modern photography portfolio.',
};

export default async function Home() {
    const images = (imageData.placeholderImages as SiteImage[]).slice(2, 5);
    const heroImage = (imageData.placeholderImages as SiteImage[]).find(img => img.id === '1') || (imageData.placeholderImages as SiteImage[])[0];

    // Using default settings directly to avoid build errors
    const settings = {
        siteName: 'Optivista',
        heroHeadline: 'Discover stunning, high-resolution photography from around India.',
        heroSubheadline: 'Explore our curated collection of fine art photography.',
    };

    const siteName = settings.siteName;

    return (
        <>
            <section className="relative w-full h-[60vh] min-h-[400px] max-h-[800px] flex items-center justify-center">
                <div className="absolute inset-0">
                    <WatermarkedImage
                        src={processImageUrl(heroImage.url)}
                        alt={heroImage.name}
                        fill
                        objectFit="cover"
                        priority
                        data-ai-hint={heroImage.aiHint}
                        watermarkText={siteName}
                        watermarkEnabled={false}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
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
                                <Card key={image.id} className="overflow-hidden group transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                                    <CardContent className="p-0">
                                        <div className="aspect-[4/3] relative">
                                            <WatermarkedImage
                                                src={processImageUrl(image.url)}
                                                alt={image.name}
                                                fill
                                                objectFit="cover"
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
        </>
    );
}
