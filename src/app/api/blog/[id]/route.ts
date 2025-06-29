import { NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { isAdmin } from '@/lib/admin';

// GET a single blog post by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const db = getFirestore(adminApp);
    const docRef = db.collection('blogPosts').doc(params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }

    return NextResponse.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// UPDATE a blog post by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
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
    const docRef = db.collection('blogPosts').doc(params.id);

    await docRef.update({
      ...body,
    });

    return NextResponse.json({ message: 'Blog post updated successfully' });
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE a blog post by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
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
    await db.collection('blogPosts').doc(params.id).delete();

    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}