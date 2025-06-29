"use client";

import { Order } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Package, 
  Calendar, 
  MapPin, 
  CreditCard, 
  Eye, 
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderCardProps {
  order: Order;
}

export default function OrderCard({ order }: OrderCardProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'refunded': return <XCircle className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getEstimatedDelivery = () => {
    if (order.estimatedDelivery) {
      return formatDate(order.estimatedDelivery);
    }
    
    // Calculate estimated delivery based on order date (7-10 business days)
    const orderDate = new Date(order.createdAt);
    const estimatedDate = new Date(orderDate);
    estimatedDate.setDate(orderDate.getDate() + 9); // 9 days as average
    
    return formatDate(estimatedDate.toISOString());
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg">Order {order.orderNumber}</h3>
              <OrderStatusBadge status={order.status} />
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>Placed on {formatDate(order.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <CreditCard className="h-4 w-4" />
                <span>${order.summary.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/orders/confirmation/${order.id}`}>
                <Eye className="h-4 w-4 mr-1" />
                View Details
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Order Items Preview */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Items ({order.items.length})
          </h4>
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="relative w-12 h-12 rounded-md overflow-hidden">
                  <Image
                    src={item.productImageSrc}
                    alt={item.productName}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-medium text-sm truncate">{item.productName}</p>
                  <p className="text-xs text-muted-foreground">
                    Qty: {item.quantity} × ${item.productPrice.toFixed(2)}
                  </p>
                </div>
                <div className="text-sm font-medium">
                  ${item.subtotal.toFixed(2)}
                </div>
              </div>
            ))}
            
            {order.items.length > 3 && (
              <div className="text-center py-2">
                <span className="text-sm text-muted-foreground">
                  +{order.items.length - 3} more item{order.items.length - 3 !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Order Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Shipping Address
            </h4>
            <div className="text-sm text-muted-foreground space-y-1">
              <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Order Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal:</span>
                <span>${order.summary.subtotal.toFixed(2)}</span>
              </div>
              {order.summary.discountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-${order.summary.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping:</span>
                <span>${order.summary.shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tax:</span>
                <span>${order.summary.taxAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${order.summary.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-medium">
                {order.status === 'pending' && 'Order Pending Confirmation'}
                {order.status === 'confirmed' && 'Order Confirmed'}
                {order.status === 'processing' && 'Order Being Prepared'}
                {order.status === 'shipped' && 'Order Shipped'}
                {order.status === 'delivered' && 'Order Delivered'}
                {order.status === 'cancelled' && 'Order Cancelled'}
                {order.status === 'refunded' && 'Order Refunded'}
              </span>
            </div>
            
            {(order.status === 'confirmed' || order.status === 'processing' || order.status === 'shipped') && (
              <div className="text-sm text-muted-foreground">
                Est. delivery: {getEstimatedDelivery()}
              </div>
            )}
          </div>

          {order.trackingNumber && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Tracking Number:</span>
                <span className="text-sm font-mono">{order.trackingNumber}</span>
              </div>
            </div>
          )}

          {order.status === 'delivered' && order.deliveredAt && (
            <div className="mt-2 pt-2 border-t border-gray-200">
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>Delivered on {formatDate(order.deliveredAt)}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}