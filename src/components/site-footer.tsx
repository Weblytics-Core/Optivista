
import { Mail, MapPin, Twitter, Linkedin } from 'lucide-react';
import Link from 'next/link';

const PinterestIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        {...props}
    >
        <title>Pinterest icon</title>
        <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.027-.655 2.56-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
);


export function SiteFooter() {
  const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "optivista@subhadipghosh.co.in";
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
          <div className="space-y-4 lg:col-span-2">
            <h4 className="font-headline text-lg font-semibold tracking-wide">Optivista</h4>
            <p className="text-muted-foreground">
              A modern photography portfolio to showcase and sell your work. Built with Next.js and Firebase.
            </p>
            <div className="flex space-x-4 pt-2">
                <Link href="https://twitter.com/subhadipdotcom/" className="text-muted-foreground hover:text-foreground">
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                </Link>
                <Link href="https://pin.it/4V5hoF5Mq" className="text-muted-foreground hover:text-foreground">
                    <PinterestIcon className="h-5 w-5" />
                    <span className="sr-only">Pinterest</span>
                </Link>
                <Link href="https://linkedin.com/in/subhadotcom" className="text-muted-foreground hover:text-foreground">
                    <Linkedin className="h-5 w-5" />
                    <span className="sr-only">LinkedIn</span>
                </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground">Home</Link></li>
              <li><Link href="/gallery" className="hover:text-foreground">Gallery</Link></li>
              <li><Link href="/contact" className="hovertext-foreground">Contact</Link></li>
              <li><Link href="/login" className="hover:text-foreground">Login / Sign Up</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-headline text-lg font-semibold tracking-wide">Contact</h4>
            <div className="space-y-3 text-muted-foreground">
              <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 hover:text-foreground">
                <Mail className="h-5 w-5" />
                <span>{contactEmail}</span>
              </a>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <span>Bengaluru, India</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-muted/50 py-4">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Optivista By Subhadip Ghosh. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 sm:mt-0">
                <Link href="/privacy-policy" className="hover:text-foreground">Privacy Policy</Link>
                <Link href="/terms-of-service" className="hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </div>
    </footer>
  );
}
