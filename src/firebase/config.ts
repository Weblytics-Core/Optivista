export const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || ''
} as const;

// Warn in development when env vars are missing to help debugging
if (process.env.NODE_ENV !== 'production') {
  const missing = Object.entries(firebaseConfig).filter(([, v]) => !v).map(([k]) => k);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.warn('[firebase] missing environment variables:', missing.join(', '));
  }
}
