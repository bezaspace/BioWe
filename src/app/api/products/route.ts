"use server";
import { NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { isAdmin } from '@/lib/admin';

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

  

export async function POST(request: Request) {
  try {
    // Admin check (expects Authorization: Bearer <token>)
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    // Decode token to get UID (assume Firebase Auth JWT)
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

    // Parse and validate product data
    const body = await request.json();
    if (
      !body.name ||
      !body.description ||
      typeof body.price !== 'number' ||
      !body.imageSrc ||
      !body.imageAlt ||
      !body.category
    ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = getFirestore(adminApp);
    const docRef = await db.collection('products').add({
      name: body.name,
      description: body.description,
      price: body.price,
      imageSrc: body.imageSrc,
      imageAlt: body.imageAlt,
      category: body.category,
      dataAiHint: body.dataAiHint || '',
      rating: body.rating || 0,
      reviewCount: body.reviewCount || 0,
      availability: body.availability || 'In Stock',
      features: body.features || [],
      howToUse: body.howToUse || '',
      ingredients: body.ingredients || '',
      safetyInfo: body.safetyInfo || '',
    });

    return NextResponse.json({ id: docRef.id, ...body }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json({ error: 'Failed to add product' }, { status: 500 });
  }
}
