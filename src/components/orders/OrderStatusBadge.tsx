"use client";

import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';
import { 
  Clock, 
  CheckCircle, 
  RefreshCw, 
  Truck, 
  Package, 
  XCircle 
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  showIcon?: boolean;
}

export default function OrderStatusBadge({ status, showIcon = true }: OrderStatusBadgeProps) {
  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
          icon: <Clock className="h-3 w-3" />,
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
          icon: <CheckCircle className="h-3 w-3" />,
        };
      case 'processing':
        return {
          label: 'Processing',
          className: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
          icon: <RefreshCw className="h-3 w-3" />,
        };
      case 'shipped':
        return {
          label: 'Shipped',
          className: 'bg-indigo-100 text-indigo-800 hover:bg-indigo-200',
          icon: <Truck className="h-3 w-3" />,
        };
      case 'delivered':
        return {
          label: 'Delivered',
          className: 'bg-green-100 text-green-800 hover:bg-green-200',
          icon: <Package className="h-3 w-3" />,
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          className: 'bg-red-100 text-red-800 hover:bg-red-200',
          icon: <XCircle className="h-3 w-3" />,
        };
      case 'refunded':
        return {
          label: 'Refunded',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          icon: <XCircle className="h-3 w-3" />,
        };
      default:
        return {
          label: 'Unknown',
          className: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
          icon: <Package className="h-3 w-3" />,
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge className={config.className}>
      <span className="flex items-center gap-1">
        {showIcon && config.icon}
        {config.label}
      </span>
    </Badge>
  );
}