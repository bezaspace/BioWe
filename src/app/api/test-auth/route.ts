import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';

export async function POST(request: NextRequest) {
  // Only log in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('TEST AUTH API - Starting');
  }
  
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'No authorization header',
        success: false 
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = await auth().verifyIdToken(token);
      
      // Only log success in development
      if (process.env.NODE_ENV === 'development') {
        console.log('TEST AUTH API - Token verified successfully for user');
      }
      
      return NextResponse.json({
        success: true,
        user: {
          uid: decoded.uid,
          email: decoded.email,
          name: decoded.name
        }
      });
    } catch (tokenError) {
      // Log errors but don't expose sensitive details in production
      if (process.env.NODE_ENV === 'development') {
        console.error('TEST AUTH API - Token verification failed:', tokenError);
      }
      return NextResponse.json({ 
        error: 'Invalid token',
        success: false 
      }, { status: 401 });
    }
  } catch (error) {
    // Log errors but don't expose sensitive details in production
    if (process.env.NODE_ENV === 'development') {
      console.error('TEST AUTH API - General error:', error);
    }
    return NextResponse.json({ 
      error: 'Server error',
      success: false 
    }, { status: 500 });
  }
}