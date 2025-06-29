'use client';

import { useParams } from 'next/navigation';
import OrderConfirmation from '@/components/orders/OrderConfirmation';

export default function OrderConfirmationPage() {
  const params = useParams();
  const orderId = params.orderId as string;

  if (!orderId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Invalid Order</h1>
          <p className="text-muted-foreground">No order ID provided.</p>
        </div>
      </div>
    );
  }

  return <OrderConfirmation orderId={orderId} />;
}