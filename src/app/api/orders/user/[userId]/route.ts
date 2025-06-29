"use server";

import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { auth } from 'firebase-admin';
import { isAdmin } from '@/lib/admin';
import { Order } from '@/types';

const db = getFirestore(adminApp);

// GET - Fetch orders for a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = await auth().verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const requestingUserId = decoded.uid;
    const targetUserId = params.userId;

    // Check if user is requesting their own orders or is admin
    const admin = await isAdmin(requestingUserId);
    if (!admin && requestingUserId !== targetUserId) {
      return NextResponse.json({ 
        error: 'Forbidden - You can only view your own order history' 
      }, { status: 403 });
    }

    // Get query parameters for filtering and pagination
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const sortBy = url.searchParams.get('sortBy') || 'createdAt';
    const sortOrder = url.searchParams.get('sortOrder') || 'desc';

    // Build query
    let query = db.collection('orders')
      .where('userId', '==', targetUserId)
      .orderBy(sortBy, sortOrder as 'asc' | 'desc');

    // Add status filter if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    // Execute query with pagination
    const snapshot = await query.limit(limit).offset(offset).get();
    
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];

    // Get total count for pagination (this is a separate query)
    let totalQuery = db.collection('orders').where('userId', '==', targetUserId);
    if (status) {
      totalQuery = totalQuery.where('status', '==', status);
    }
    const totalSnapshot = await totalQuery.get();
    const total = totalSnapshot.size;

    // Calculate pagination info
    const hasMore = offset + limit < total;
    const page = Math.floor(offset / limit) + 1;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      orders,
      pagination: {
        total,
        page,
        totalPages,
        limit,
        offset,
        hasMore,
      },
    });

  } catch (error) {
    console.error('Error fetching user orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}