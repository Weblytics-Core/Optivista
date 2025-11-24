
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

let app: App;
let adminDb: Firestore;

if (getApps().length === 0) {
  try {
    // Attempt to initialize with service account credentials from environment
    app = initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string)),
      databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
    });
  } catch (e: any) {
    console.warn(
      `Firebase Admin SDK initialization failed with service account. This is expected in a local development environment. Falling back to client-side config. Error: ${e.message}`
    );
    // Fallback for local/dev environments where service account might not be available
    app = initializeApp(firebaseConfig as any);
  }
} else {
  app = getApp();
}

adminDb = getFirestore(app);

export { app as adminApp };
export function getAdminFirestore(): Firestore {
    return adminDb;
}
