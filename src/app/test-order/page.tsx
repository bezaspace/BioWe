'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import { Product } from '@/types';

export default function TestOrderPage() {
  const { user, getIdToken } = useAuth();
  const { cartItems, placeOrder, addToCart } = useCart();
  const [testResults, setTestResults] = useState<string[]>([]);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testProfile = () => {
    const userProfile = localStorage.getItem('bioWeUserProfile');
    if (!userProfile) {
      addTestResult('ERROR: No profile found in localStorage');
      return;
    }

    try {
      const profile = JSON.parse(userProfile);
      addTestResult('SUCCESS: Profile found in localStorage');
      addTestResult(`Profile UID: ${profile.uid}`);
      addTestResult(`User UID: ${user?.uid}`);
      
      if (profile.shippingAddress) {
        const addr = profile.shippingAddress;
        const checks = [
          `Name: ${addr.fullName ? 'OK' : 'MISSING'}`,
          `Address1: ${addr.addressLine1 ? 'OK' : 'MISSING'}`,
          `City: ${addr.city ? 'OK' : 'MISSING'}`,
          `State: ${addr.state ? 'OK' : 'MISSING'}`,
          `Postal: ${addr.postalCode ? 'OK' : 'MISSING'}`,
          `Country: ${addr.country ? 'OK' : 'MISSING'}`
        ];
        addTestResult(`Shipping Address: ${checks.join(', ')}`);
      } else {
        addTestResult('ERROR: No shipping address in profile');
      }
    } catch (error) {
      addTestResult(`ERROR: Error parsing profile: ${error}`);
    }
  };

  const testAuth = async () => {
    if (!user) {
      addTestResult('ERROR: No user logged in');
      return;
    }

    addTestResult('SUCCESS: User logged in');
    addTestResult(`User email: ${user.email}`);
    addTestResult(`User name: ${user.displayName}`);

    try {
      const token = await getIdToken();
      addTestResult(token ? 'SUCCESS: Got auth token' : 'ERROR: Failed to get auth token');
      
      if (token) {
        // Test the auth API
        addTestResult('INFO: Testing auth API...');
        const response = await fetch('/api/test-auth', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        const result = await response.json();
        if (response.ok && result.success) {
          addTestResult('SUCCESS: Auth API test passed');
          addTestResult(`API returned user: ${result.user.email}`);
        } else {
          addTestResult(`ERROR: Auth API test failed: ${result.error}`);
          addTestResult(`Details: ${result.details || 'No details'}`);
        }
      }
    } catch (error) {
      addTestResult(`ERROR: Auth token error: ${error}`);
    }
  };

  const testCart = () => {
    addTestResult(`Cart items: ${cartItems.length}`);
    cartItems.forEach((item, index) => {
      addTestResult(`Item ${index + 1}: ${item.product.name} (ID: ${item.product.id}) x${item.quantity}`);
    });
  };

  const addTestProduct = () => {
    const testProduct: Product = {
      id: 'test-product-1',
      name: 'Test Bio Fertilizer',
      description: 'A test product for order placement',
      price: 99.99,
      imageSrc: '/images/products/placeholder.jpg',
      imageAlt: 'Test product',
      category: 'fertilizers',
      dataAiHint: 'test product fertilizer',
      rating: 4.5,
      reviewCount: 10,
      availability: 'In Stock'
    };

    addToCart(testProduct, 1);
    addTestResult('SUCCESS: Added test product to cart');
  };

  const testOrderAPI = async () => {
    if (!user) {
      addTestResult('ERROR: No user logged in');
      return;
    }

    try {
      const token = await getIdToken();
      if (!token) {
        addTestResult('ERROR: No auth token');
        return;
      }

      // Test with minimal valid data
      const testOrderData = {
        items: [{ productId: 'test-product-1', quantity: 1 }],
        shippingAddress: {
          fullName: 'Test User',
          addressLine1: '123 Test St',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country'
        }
      };

      addTestResult('INFO: Testing orders API...');
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testOrderData)
      });

      const result = await response.json();
      addTestResult(`API Response Status: ${response.status}`);
      addTestResult(`API Response: ${JSON.stringify(result, null, 2)}`);

      if (response.ok) {
        addTestResult('SUCCESS: Orders API test passed');
      } else {
        addTestResult(`ERROR: Orders API test failed`);
      }
    } catch (error: any) {
      addTestResult(`ERROR: Orders API test error: ${error.message}`);
    }
  };

  const testOrderPlacement = async () => {
    if (cartItems.length === 0) {
      addTestResult('ERROR: Cart is empty - cannot test order placement');
      return;
    }

    try {
      addTestResult('INFO: Attempting to place order...');
      const orderId = await placeOrder();
      addTestResult(`SUCCESS: Order placed successfully! Order ID: ${orderId}`);
    } catch (error: any) {
      addTestResult(`ERROR: Order placement failed: ${error.message}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Order Placement Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Functions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testAuth} className="w-full">
                Test Authentication
              </Button>
              <Button onClick={testProfile} className="w-full">
                Test Profile Data
              </Button>
              <Button onClick={testCart} className="w-full">
                Test Cart Data
              </Button>
              <Button onClick={addTestProduct} className="w-full" variant="outline">
                Add Test Product to Cart
              </Button>
              <Button onClick={testOrderAPI} className="w-full" variant="secondary">
                Test Orders API
              </Button>
              <Button onClick={testOrderPlacement} className="w-full" variant="destructive">
                Test Order Placement
              </Button>
              <Button onClick={clearResults} variant="outline" className="w-full">
                Clear Results
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {testResults.length === 0 ? (
                  <p className="text-muted-foreground">No test results yet. Click a test button to start.</p>
                ) : (
                  testResults.map((result, index) => (
                    <div key={index} className="text-sm font-mono bg-gray-100 p-2 rounded">
                      {result}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Quick Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              To test order placement, you need:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Be logged in (go to any page and sign in)</li>
              <li>Complete your profile with shipping address (go to /profile)</li>
              <li>Add items to cart (use the button above or go to /products)</li>
              <li>Then test order placement</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}