"use server";
import { NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { isAdmin } from '@/lib/admin';

export async function GET() {
  try {
    const db = getFirestore(adminApp);
    const snapshot = await db.collection('blogPosts').orderBy('date', 'desc').get();
    const posts = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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
    if (
      !body.title ||
      !body.slug ||
      !body.excerpt ||
      !body.content ||
      !body.imageSrc ||
      !body.imageAlt ||
      !body.author ||
      !body.date
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getFirestore(adminApp);
    const docRef = await db.collection('blogPosts').add({
      title: body.title,
      slug: body.slug,
      excerpt: body.excerpt,
      content: body.content,
      imageSrc: body.imageSrc,
      imageAlt: body.imageAlt,
      dataAiHint: body.dataAiHint || '',
      author: body.author,
      date: body.date,
    });

    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
  } catch (error) {
    console.error('Error adding blog post:', error);
    return NextResponse.json({ error: 'Failed to add blog post' }, { status: 500 });
  }
}