import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/firebase/admin';
import { Product } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const cartProducts: Product[] = await req.json();

    if (!cartProducts || cartProducts.length === 0) {
      return NextResponse.json([]);
    }

    const cartProductIds = cartProducts.map(p => p.id);
    const categories = [...new Set(cartProducts.map(p => p.category))];

    if (categories.length === 0) {
      return NextResponse.json([]);
    }

    const productsRef = adminFirestore.collection('products');
    const recommendedProducts: Product[] = [];

    for (const category of categories) {
      const querySnapshot = await productsRef.where('category', '==', category).limit(5).get();
      querySnapshot.forEach((doc: FirebaseFirestore.DocumentData) => {
        const product = { id: doc.id, ...doc.data() } as Product;
        if (!cartProductIds.includes(product.id) && !recommendedProducts.some(p => p.id === product.id)) {
          recommendedProducts.push(product);
        }
      });
    }

    const finalRecommendations = recommendedProducts.slice(0, 4);

    return NextResponse.json(finalRecommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}
