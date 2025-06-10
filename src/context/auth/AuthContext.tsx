'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, Auth } from 'firebase/auth';
import { auth } from '@/firebase/client';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to safely use auth
const withAuth = <T,>(callback: (auth: Auth) => Promise<T>) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized');
  }
  return callback(auth);
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!auth) {
      console.error('Firebase Auth is not initialized');
      setLoading(false);
      return;
    }

    console.log('AuthProvider - Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        console.log('Auth state changed:', user ? 'User signed in' : 'No user');
        setUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error('Auth state error:', error);
        setError(error as Error);
        setLoading(false);
      }
    );

    return () => {
      console.log('AuthProvider - Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      setError(null);
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }
    try {
      setLoading(true);
      setError(null);
      // Dynamically import to avoid SSR issues
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    if (!auth) {
      throw new Error('Firebase Auth is not initialized');
    }

    try {
      setLoading(true);
      setError(null);
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getIdToken = async () => {
    if (user) {
      return user.getIdToken();
    }
    return null;
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    getIdToken,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
