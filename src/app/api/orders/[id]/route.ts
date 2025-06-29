"use server";

import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { auth } from 'firebase-admin';
import { isAdmin } from '@/lib/admin';
import { Order, UpdateOrderStatusRequest } from '@/types';

const db = getFirestore(adminApp);

// GET - Fetch single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const userId = decoded.uid;
    const orderId = params.id;

    // Get the order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = { id: orderDoc.id, ...orderDoc.data() } as Order;

    // Check if user owns this order or is admin
    const admin = await isAdmin(userId);
    if (!admin && order.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only view your own orders' }, { status: 403 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}

// PUT - Update order status (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const userId = decoded.uid;
    const admin = await isAdmin(userId);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    const orderId = params.id;
    const body: UpdateOrderStatusRequest = await request.json();

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    // Get current order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const currentOrder = orderDoc.data() as Order;
    const now = new Date().toISOString();

    // Prepare update data
    const updateData: any = {
      status: body.status,
      updatedAt: now,
    };

    // Add optional fields
    if (body.adminNotes !== undefined) {
      updateData.adminNotes = body.adminNotes;
    }
    if (body.trackingNumber !== undefined) {
      updateData.trackingNumber = body.trackingNumber;
    }
    if (body.estimatedDelivery !== undefined) {
      updateData.estimatedDelivery = body.estimatedDelivery;
    }

    // Set timestamp fields based on status changes
    if (body.status === 'confirmed' && currentOrder.status !== 'confirmed') {
      updateData.confirmedAt = now;
    }
    if (body.status === 'shipped' && currentOrder.status !== 'shipped') {
      updateData.shippedAt = now;
    }
    if (body.status === 'delivered' && currentOrder.status !== 'delivered') {
      updateData.deliveredAt = now;
    }

    // Update payment status based on order status
    if (body.status === 'confirmed' || body.status === 'processing') {
      updateData.paymentStatus = 'paid';
    } else if (body.status === 'cancelled' || body.status === 'refunded') {
      updateData.paymentStatus = 'refunded';
    }

    // Update the order
    await db.collection('orders').doc(orderId).update(updateData);

    // Fetch updated order
    const updatedOrderDoc = await db.collection('orders').doc(orderId).get();
    const updatedOrder = { id: updatedOrderDoc.id, ...updatedOrderDoc.data() } as Order;

    return NextResponse.json({ 
      order: updatedOrder,
      message: `Order status updated to ${body.status}` 
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

// DELETE - Cancel order (User can cancel pending orders, Admin can delete any)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const userId = decoded.uid;
    const orderId = params.id;

    // Get the order
    const orderDoc = await db.collection('orders').doc(orderId).get();
    if (!orderDoc.exists) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = { id: orderDoc.id, ...orderDoc.data() } as Order;
    const admin = await isAdmin(userId);

    // Check permissions
    if (!admin && order.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden - You can only cancel your own orders' }, { status: 403 });
    }

    // Users can only cancel pending orders, admins can delete any
    if (!admin && order.status !== 'pending') {
      return NextResponse.json({ 
        error: 'You can only cancel orders that are still pending' 
      }, { status: 400 });
    }

    if (admin) {
      // Admin can delete the order completely
      await db.collection('orders').doc(orderId).delete();
      return NextResponse.json({ message: 'Order deleted successfully' });
    } else {
      // User cancels the order (update status)
      await db.collection('orders').doc(orderId).update({
        status: 'cancelled',
        paymentStatus: 'refunded',
        updatedAt: new Date().toISOString(),
      });
      return NextResponse.json({ message: 'Order cancelled successfully' });
    }

  } catch (error) {
    console.error('Error deleting/cancelling order:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}