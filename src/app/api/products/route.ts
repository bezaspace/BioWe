import { NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';

export async function GET() {
  try {
    const db = getFirestore(adminApp);
    const snapshot = await db.collection('products').get();
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
