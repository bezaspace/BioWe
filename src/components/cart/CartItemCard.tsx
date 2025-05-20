"use client";

import Image from 'next/image';
import type { CartItem } from '@/types';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MinusCircle, PlusCircle, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CartItemCardProps {
  item: CartItem;
}

export function CartItemCard({ item }: CartItemCardProps) {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateQuantity(item.product.id, newQuantity);
  };

  const handleRemoveItem = () => {
    removeFromCart(item.product.id);
    toast({
      title: "Item removed",
      description: `${item.product.name} has been removed from your cart.`,
      variant: "destructive"
    });
  };

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      <div className="relative w-24 h-24 rounded-md overflow-hidden">
        <Image
          src={item.product.imageSrc}
          alt={item.product.imageAlt}
          fill
          sizes="100px"
          className="object-cover"
          data-ai-hint={item.product.dataAiHint}
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-lg font-semibold">{item.product.name}</h3>
        <p className="text-sm text-muted-foreground">Price: ${item.product.price.toFixed(2)}</p>
        <div className="flex items-center space-x-2 mt-2">
          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity - 1)} disabled={item.quantity <= 1}>
            <MinusCircle className="h-5 w-5" />
          </Button>
          <Input
            type="number"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value, 10))}
            className="w-16 text-center h-9"
            min="1"
          />
          <Button variant="ghost" size="icon" onClick={() => handleQuantityChange(item.quantity + 1)}>
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
        <Button variant="ghost" size="icon" onClick={handleRemoveItem} className="text-destructive hover:text-destructive mt-2">
          <Trash2 className="h-5 w-5" />
          <span className="sr-only">Remove item</span>
        </Button>
      </div>
    </div>
  );
}
