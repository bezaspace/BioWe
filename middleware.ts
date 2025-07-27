import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { adminApp } from './src/firebase/admin';

export async function middleware(request: NextRequest) {
  // Skip middleware for non-admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Get the session cookie
  const sessionCookie = request.cookies.get('session')?.value;

  if (!sessionCookie) {
    // Redirect to login if no session cookie
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const auth = getAuth(adminApp);
    const decoded = await auth.verifySessionCookie(sessionCookie, true);

    // Check for admin claim
    if (!decoded.admin) {
      // Not an admin, redirect to login or unauthorized page
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }

    // If we get here, the session is valid and user is admin
    return NextResponse.next();
  } catch (error) {
    // Log error in development but avoid exposing details in production
    if (process.env.NODE_ENV === 'development') {
      console.error('Authentication error:', error);
    }
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
