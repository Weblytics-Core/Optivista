
import { NextResponse } from 'next/server';
import { submitContactForm } from '@/lib/server-actions';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }
    
    // Call the server action from the API route
    const result = await submitContactForm({ name, email, message });

    if (result.issues) {
      return NextResponse.json({ message: 'Invalid form data', issues: result.issues }, { status: 400 });
    }

    return NextResponse.json({ message: 'Message sent successfully!' });

  } catch (error: any) {
    console.error('API Route Error:', error);
    return NextResponse.json({ message: error.message || 'An unexpected error occurred.' }, { status: 500 });
  }
}
