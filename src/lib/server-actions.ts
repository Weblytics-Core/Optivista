'use server';

import { z } from "zod";
import { getApps, getApp, initializeApp } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// ====================================================================
// Internal, Server-Only Firebase Initialization
// ====================================================================
function initializeFirebaseServer() {
  // Check if the app is already initialized to prevent errors
  if (!getApps().length) {
    // When deployed to App Hosting, environment variables are automatically set.
    // This allows initializeApp() to authenticate without any config object.
    initializeApp();
  }
  return getApp();
}


const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
};

export async function submitContactForm(
  data: { name: string; email: string; message: string; }
): Promise<FormState> {
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return {
      message: "Invalid form data",
      fields: data,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  const { name, email, message } = parsed.data;

  try {
    const app = initializeFirebaseServer();
    const firestore = getFirestore(app);
    
    const submissionsCollection = firestore.collection('contact_form_submissions');

    await submissionsCollection.add({
      name,
      email,
      message,
      submissionDate: FieldValue.serverTimestamp(),
    });

    return {
      message: "Message sent successfully and saved!",
    };

  } catch (e: any) {
    console.error("Error submitting form to Firestore:", e);
    return {
      message: `An error occurred: ${e.message}`,
    };
  }
}
