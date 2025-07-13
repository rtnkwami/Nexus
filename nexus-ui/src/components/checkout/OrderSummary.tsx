"use client";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Edit } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface OrderSummaryProps {
  cart: CartItem[];
  cartTotal: number;
  isLoading: boolean;
  onConfirmOrder: () => void;
}

export default function OrderSummary({ cart, cartTotal, isLoading, onConfirmOrder }: OrderSummaryProps) {

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Order Summary</CardTitle>
          <Button variant="outline" size="sm" asChild>
            <Link href="/cart">
              <Edit className="h-4 w-4 mr-2" />
              Edit Cart
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="text-gray-500">Loading...</div>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-gray-500">
              <ShoppingCart className="h-12 w-12 mb-2" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                      <div className="w-12 h-12 bg-blue-500 rounded"></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{item.name}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-sm">Qty: {item.quantity}</span>
                        <span className="font-medium">&#8373;{item.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>&#8373;{cartTotal.toFixed(2)}</span>
              </div>

              <div className="text-sm text-gray-600">
                <p>Delivery Estimated Date: 2024/06/12</p>
              </div>

              <Button 
                className="w-full mt-6" 
                size="lg"
                onClick={onConfirmOrder}
                disabled={isLoading || cart.length === 0}
              >
                Confirm Order
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}