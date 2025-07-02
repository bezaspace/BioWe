"use client";

import { useCart } from '@/context/CartContext';
import { CartItemCard } from '@/components/cart/CartItemCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import PromoCodeForm from '@/components/cart/PromoCodeForm';
import { RecommendedProducts } from '@/components/products/RecommendedProducts';
import { Product } from '@/types';

export default function CartPage() {
  const { cartItems, getCartTotal, getCartItemCount, clearCart, discount, placeOrder } = useCart();
  const { user, getIdToken } = useAuth();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  
  const itemCount = getCartItemCount();
  // Subtotal before discount
  const subtotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const total = getCartTotal();

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
      variant: "destructive",
    });
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      toast({
        title: "Please Sign In",
        description: "You need to be signed in to place an order.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    setIsPlacingOrder(true);
    try {
      const orderId = await placeOrder();
      if (orderId) {
        router.push(`/orders/confirmation/${orderId}`);
      }
    } catch (error: any) {
      toast({
        title: "Order Failed",
        description: error.message || "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPlacingOrder(false);
    }
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

  const cartProducts = cartItems.map(item => item.product);

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
              <PromoCodeForm />
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount && (
                <div className="flex justify-between text-green-700">
                  <span>Discount ({discount.code})</span>
                  <span>
                    -$
                    {discount.discountType === "percentage"
                      ? ((subtotal * discount.amount) / 100).toFixed(2)
                      : discount.amount.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-3">
              <Button 
                onClick={handleProceedToCheckout} 
                className="w-full" 
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Place Order
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleClearCart} className="w-full" disabled={isPlacingOrder}>
                <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className="mt-16">
        <RecommendedProducts cartProducts={cartProducts} />
      </div>
    </div>
  );
}
