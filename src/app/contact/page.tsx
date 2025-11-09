
import { ContactForm } from '@/components/contact-form';

export default function ContactPage() {
  
  return (
    <div className="container mx-auto px-4 py-8 sm:py-16">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-2">Contact Us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question or a project in mind? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
        </p>
      </div>
      <div className="max-w-2xl mx-auto mt-12">
        <ContactForm />
      </div>
    </div>
  );
}
