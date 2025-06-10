import { getAuth } from 'firebase-admin/auth';
import { adminApp } from '@/firebase/admin';

export async function isAdmin(uid: string): Promise<boolean> {
  try {
    const auth = getAuth(adminApp);
    const user = await auth.getUser(uid);
    // For now, we'll just check if the user exists
    // In a real app, you would check custom claims or a Firestore document
    return !!user;
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}
