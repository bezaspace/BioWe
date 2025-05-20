"use client";

import { useCart } from '@/context/CartContext';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, getCartTotal, getCartItemCount, clearCart } = useCart();
  const itemCount = getCartItemCount();
  const subtotal = getCartTotal();
  // For MVP, taxes and shipping are 0 or not shown.
  const total = subtotal;

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "destructive",
    });
  };

  const handleProceedToCheckout = () => {
    toast({
      title: "Checkout Not Implemented",
      description: "This is an MVP. Payment gateway integration is not available yet.",
    });
  };

  if (itemCount === 0) {
    return (
      <div className="text-center py-10">
        <ShoppingCart className="mx-auto h-24 w-24 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4 text-[#228B22]">Your Cart is Empty</h1>
        <p className="text-muted-foreground mb-6">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild>
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 text-center tracking-tight text-[#228B22]">Your Shopping Cart</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Cart Items ({itemCount})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {cartItems.map(item => (
                <CartItemCard key={item.product.id} item={item} />
              ))}
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button onClick={handleProceedToCheckout} className="w-full">Proceed to Checkout</Button>
              <Button variant="outline" onClick={handleClearCart} className="w-full">
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
