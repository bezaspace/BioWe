import { NextRequest, NextResponse } from 'next/server';
import { auth } from 'firebase-admin';

export async function POST(request: NextRequest) {
  console.log('TEST AUTH API - Starting');
  
  try {
    const authHeader = request.headers.get('authorization');
    console.log('TEST AUTH API - Auth header present:', !!authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ 
        error: 'No authorization header',
        success: false 
      }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('TEST AUTH API - Token length:', token.length);
    
    try {
      const decoded = await auth().verifyIdToken(token);
      console.log('TEST AUTH API - Token verified successfully for:', decoded.uid);
      
      return NextResponse.json({
        success: true,
        user: {
          uid: decoded.uid,
          email: decoded.email,
          name: decoded.name
        }
      });
    } catch (tokenError) {
      console.error('TEST AUTH API - Token verification failed:', tokenError);
      return NextResponse.json({ 
        error: 'Invalid token',
        details: tokenError instanceof Error ? tokenError.message : 'Unknown token error',
        success: false 
      }, { status: 401 });
    }
  } catch (error) {
    console.error('TEST AUTH API - General error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }, { status: 500 });
  }
}