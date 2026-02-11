import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

let app = null;
let auth = null;

export const isConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId
  );
};

if (isConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
  } catch (err) {
    console.warn('Firebase initialization failed:', err.message);
  }
}

export const signInWithGoogle = async () => {
  if (!isConfigured() || !auth) {
    throw new Error(
      'Firebase is not configured. Add your Firebase config to a .env file.'
    );
  }
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};

export const logOut = async () => {
  if (auth) {
    return signOut(auth);
  }
};

export const onAuthChange = (callback) => {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  }
  // Not configured — call back with null immediately
  callback(null);
  return () => {};
};
