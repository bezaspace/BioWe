import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, Auth } from 'firebase/auth';

// Direct Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyAstxg88vrLR71TSlqsBQY8N_83u650eas",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "bioweshop-c5a3c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bioweshop-c5a3c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "bioweshop-c5a3c.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "672362857101",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:672362857101:web:9ec3b1e878646a611a98c4",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-K9ETR35WCM"
};

// Client-side Firebase initialization
const initFirebase = () => {
  // Only run on client-side
  if (typeof window === 'undefined') {
    return { app: null, auth: null };
  }

  // Initialize Firebase if it hasn't been initialized yet
  let app: FirebaseApp;
  let auth: Auth;

  if (!getApps().length) {
    console.log('Initializing Firebase client...');
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);

    // Use emulator if enabled
    if (process.env.NEXT_PUBLIC_USE_EMULATOR === 'true') {
      console.log('Using Firebase Auth emulator');
      connectAuthEmulator(auth, 'http://localhost:9099');
    }
  } else {
    app = getApp();
    auth = getAuth(app);
  }

  return { app, auth };
};

const { app, auth } = initFirebase();

export { app, auth };
