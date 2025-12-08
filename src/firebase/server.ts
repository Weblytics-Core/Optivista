
import { initializeApp, getApps, getApp, App, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { firebaseConfig } from './config';

let adminDb: Firestore;

if (getApps().length === 0) {
  let app: App;
  try {
    // This will only work in an environment where the service account is set.
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
       app = initializeApp({
          credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)),
          databaseURL: `https://${firebaseConfig.projectId}.firebaseio.com`
       });
    } else {
        // Fallback for local dev without service account, limited capabilities.
        app = initializeApp({ projectId: firebaseConfig.projectId });
    }
  } catch (e: any) {
    if (process.env.NODE_ENV === 'production') {
      console.warn(
        `Firebase Admin SDK initialization failed during build. Error: ${e.message}`
      );
    }
    // Fallback for local dev if the above fails
    app = initializeApp({ projectId: firebaseConfig.projectId });
  }
  adminDb = getFirestore(app);
} else {
  adminDb = getFirestore(getApp());
}

export function getAdminFirestore(): Firestore {
    return adminDb;
}
