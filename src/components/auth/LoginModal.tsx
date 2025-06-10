'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Loader2 } from 'lucide-react';

export function LoginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const { signInWithGoogle, signInWithEmail, error: authError } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleGoogleSignIn = async () => {
    try {
      console.log('LoginModal - Starting Google sign in');
      setError(null);
      setIsSigningIn(true);
      await signInWithGoogle();
      console.log('LoginModal - Google sign in successful');
      // Check for admin claim and redirect if present
      if (typeof window !== "undefined") {
        const { getAuth } = await import('firebase/auth');
        const user = getAuth().currentUser;
        if (user) {
          const token = await user.getIdTokenResult(true);
          if (token.claims.admin) {
            window.location.href = "/admin";
          }
        }
      }
      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      console.error('LoginModal - Failed to sign in with Google:', error);
      setError(errorMessage);
    } finally {
      console.log('LoginModal - Sign in process completed');
      setIsSigningIn(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      setIsSigningIn(true);
      await signInWithEmail(email, password);
      // Check for admin claim and redirect if present
      if (typeof window !== "undefined") {
        const { getAuth } = await import('firebase/auth');
        const user = getAuth().currentUser;
        if (user) {
          const token = await user.getIdTokenResult(true);
          if (token.claims.admin) {
            window.location.href = "/admin";
          }
        }
      }
      setIsOpen(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with email';
      setError(errorMessage);
    } finally {
      setIsSigningIn(false);
    }
  };

  // Update error state if authError changes
  useEffect(() => {
    if (authError) {
      setError(authError.message);
    }
  }, [authError]);

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Sign In</Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Welcome to BioWe</DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col space-y-4 py-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <form className="flex flex-col space-y-2" onSubmit={handleEmailSignIn}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="border rounded px-3 py-2"
                disabled={isSigningIn}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="border rounded px-3 py-2"
                disabled={isSigningIn}
              />
              <Button
                type="submit"
                disabled={isSigningIn}
                className="w-full flex items-center justify-center gap-2"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign in with Email</>
                )}
              </Button>
            </form>
            <div className="relative flex items-center justify-center my-2">
              <span className="absolute left-0 w-full border-t border-gray-200"></span>
              <span className="bg-white px-2 text-gray-400 z-10">or</span>
            </div>
            <Button 
              variant="outline" 
              onClick={handleGoogleSignIn}
              disabled={isSigningIn}
              className="w-full flex items-center justify-center gap-2"
            >
              {isSigningIn ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
