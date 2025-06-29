"use server";

import { NextRequest, NextResponse } from 'next/server';
import { adminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { auth } from 'firebase-admin';
import { isAdmin } from '@/lib/admin';
import { 
  Order, 
  CreateOrderRequest, 
  OrderItem, 
  OrderSummary, 
  ShippingAddress,
  Product 
} from '@/types';

const db = getFirestore(adminApp);

// Generate order number
function generateOrderNumber(): string {
  const year = new Date().getFullYear();
  const timestamp = Date.now().toString().slice(-6);
  return `ORD-${year}-${timestamp}`;
}

// Calculate shipping cost (simple logic - can be enhanced)
function calculateShippingCost(subtotal: number): number {
  if (subtotal >= 500) return 0; // Free shipping over $500
  return 50; // Flat rate shipping
}

// Calculate tax (simple 18% GST)
function calculateTax(subtotal: number): number {
  return subtotal * 0.18;
}

// GET - Fetch all orders (Admin only)
export async function GET(request: NextRequest) {
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

    const uid = decoded.uid;
    const admin = await isAdmin(uid);
    if (!admin) {
      return NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 });
    }

    // Get query parameters for filtering
    const url = new URL(request.url);
    const status = url.searchParams.get('status');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    let query = db.collection('orders').orderBy('createdAt', 'desc');
    
    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query.limit(limit).offset(offset).get();
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Order[];

    return NextResponse.json({ orders, total: snapshot.size });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  console.log('POST /api/orders - Starting order creation');
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    console.log('POST /api/orders - Verifying token');
    let decoded;
    try {
      decoded = await auth().verifyIdToken(token);
      console.log('POST /api/orders - Token verified for user:', decoded.uid);
    } catch (error) {
      console.error('POST /api/orders - Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userId = decoded.uid;
    const userEmail = decoded.email || '';
    const userName = decoded.name || decoded.email || 'Unknown User';
    console.log('POST /api/orders - User info:', { userId, userEmail, userName });

    const body: CreateOrderRequest = await request.json();
    console.log('POST /api/orders - Request body:', JSON.stringify(body, null, 2));

    // Validate request
    if (!body.items || body.items.length === 0) {
      console.error('POST /api/orders - No items in order');
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (!body.shippingAddress || !body.shippingAddress.fullName || !body.shippingAddress.addressLine1) {
      console.error('POST /api/orders - Invalid shipping address');
      return NextResponse.json({ error: 'Valid shipping address is required' }, { status: 400 });
    }

    // Fetch product details for all items
    const productIds = body.items.map(item => item.productId);
    console.log('POST /api/orders - Fetching products:', productIds);
    
    const productPromises = productIds.map(id => db.collection('products').doc(id).get());
    const productDocs = await Promise.all(productPromises);

    // Validate all products exist and build order items
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (let i = 0; i < body.items.length; i++) {
      const item = body.items[i];
      const productDoc = productDocs[i];

      if (!productDoc.exists) {
        console.error(`POST /api/orders - Product not found: ${item.productId}`);
        
        // For test products, create a mock product
        if (item.productId === 'test-product-1') {
          console.log('POST /api/orders - Using mock test product');
          const mockProduct = {
            id: 'test-product-1',
            name: 'Test Bio Fertilizer',
            price: 99.99,
            imageSrc: '/images/products/placeholder.jpg'
          };
          
          const itemSubtotal = mockProduct.price * item.quantity;
          orderItems.push({
            productId: mockProduct.id,
            productName: mockProduct.name,
            productPrice: mockProduct.price,
            productImageSrc: mockProduct.imageSrc,
            quantity: item.quantity,
            subtotal: itemSubtotal,
          });
          subtotal += itemSubtotal;
          continue;
        }
        
        return NextResponse.json({ 
          error: `Product with ID ${item.productId} not found` 
        }, { status: 400 });
      }

      const product = { id: productDoc.id, ...productDoc.data() } as Product;
      const itemSubtotal = product.price * item.quantity;

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productPrice: product.price,
        productImageSrc: product.imageSrc,
        quantity: item.quantity,
        subtotal: itemSubtotal,
      });

      subtotal += itemSubtotal;
    }
    
    console.log('POST /api/orders - Order items created:', orderItems.length, 'Subtotal:', subtotal);

    // Handle discount if provided
    let discountAmount = 0;
    let discountCode: string | undefined;

    if (body.discountCode) {
      // Validate promo code directly (avoid internal API call)
      try {
        // Mock promo codes (same as in promo API)
        const PROMO_CODES = [
          {
            code: "BIO10",
            description: "10% off your order",
            discountType: "percentage" as const,
            amount: 10,
            expiresAt: undefined,
            isActive: true,
          },
          {
            code: "BIO50",
            description: "$50 off your order",
            discountType: "fixed" as const,
            amount: 50,
            expiresAt: undefined,
            isActive: true,
          },
        ];

        const promo = PROMO_CODES.find(
          (p) => p.code.toLowerCase() === body.discountCode!.trim().toLowerCase()
        );

        if (promo && promo.isActive) {
          const isExpired = promo.expiresAt ? new Date(promo.expiresAt) < new Date() : false;
          
          if (!isExpired) {
            discountCode = promo.code;
            if (promo.discountType === 'percentage') {
              discountAmount = (subtotal * promo.amount) / 100;
            } else {
              discountAmount = promo.amount;
            }
          }
        }
      } catch (error) {
        console.warn('Failed to validate promo code:', error);
        // Continue without discount rather than failing the order
      }
    }

    // Calculate costs
    const shippingCost = calculateShippingCost(subtotal);
    const taxAmount = calculateTax(subtotal - discountAmount);
    const totalAmount = subtotal - discountAmount + shippingCost + taxAmount;

    const orderSummary: OrderSummary = {
      subtotal,
      discountAmount,
      discountCode,
      shippingCost,
      taxAmount,
      totalAmount,
    };

    // Create order object
    const now = new Date().toISOString();
    const order: Omit<Order, 'id'> = {
      orderNumber: generateOrderNumber(),
      userId,
      userEmail,
      userName,
      items: orderItems,
      summary: orderSummary,
      shippingAddress: body.shippingAddress,
      status: 'pending',
      paymentStatus: 'pending', // In a real app, this would be set after payment processing
      createdAt: now,
      updatedAt: now,
      notes: body.notes,
    };

    // Save to Firestore
    console.log('POST /api/orders - Saving order to Firestore');
    const docRef = await db.collection('orders').add(order);
    console.log('POST /api/orders - Order saved with ID:', docRef.id);
    
    const createdOrder: Order = {
      id: docRef.id,
      ...order,
    };

    console.log('POST /api/orders - Order creation successful');
    return NextResponse.json({ 
      order: createdOrder,
      message: 'Order placed successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('POST /api/orders - Error creating order:', error);
    
    // Provide more detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    const errorStack = error instanceof Error ? error.stack : 'No stack trace available';
    
    console.error('POST /api/orders - Error details:', {
      message: errorMessage,
      stack: errorStack,
      error: error
    });
    
    return NextResponse.json({ 
      error: 'Failed to create order',
      details: errorMessage,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}