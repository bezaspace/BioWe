import { NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const db = getFirestore(adminApp);
    const docRef = db.collection('products').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
