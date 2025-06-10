import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/firebase/admin';

export async function GET(req: NextRequest) {
  try {
    // Get the ID token from the Authorization header (Bearer token)
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const idToken = authHeader.split(' ')[1];

    // Verify the token and get the decoded claims
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Check for admin claim
    if (!decodedToken.admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // List all users (up to 1000, adjust as needed)
    const listUsersResult = await adminAuth.listUsers(1000);
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      creationTime: userRecord.metadata.creationTime,
      lastSignInTime: userRecord.metadata.lastSignInTime,
      disabled: userRecord.disabled,
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
