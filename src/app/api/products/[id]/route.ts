import { NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { isAdmin } from '@/lib/admin';

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

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const { auth } = await import('firebase-admin');
    let decoded;
    try {
      decoded = await auth().verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const uid = decoded.uid;
    const admin = await isAdmin(uid);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const db = getFirestore(adminApp);
    const docRef = db.collection('products').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    await docRef.update(body);
    return NextResponse.json({ id, ...body });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    const { auth } = await import('firebase-admin');
    let decoded;
    try {
      decoded = await auth().verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    const uid = decoded.uid;
    const admin = await isAdmin(uid);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const db = getFirestore(adminApp);
    const docRef = db.collection('products').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    await docRef.delete();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
