"use client";
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, ShoppingCart, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CartPage() {
  const { cart, cartTotal, isLoading, updateCartItem, removeFromCart } = useCart();

  const handleQuantityChange = async (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartItem(productId, newQuantity);
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {totalItems} {totalItems === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingCart className="h-24 w-24 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some items to your cart to get started</p>
            <Button asChild>
              <Link href="/">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cart.map((item, index) => (
                      <div key={item.id}>
                        <div className="flex items-center space-x-4 py-4">
                          {/* Product Image Placeholder */}
                          <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <div className="w-16 h-16 bg-blue-500 rounded"></div>
                          </div>
                          
                          {/* Product Info */}
                          <div className="flex-1">
                            <Link 
                              href={`/products/${item.id}`}
                              className="block hover:text-blue-600 transition-colors"
                            >
                              <h3 className="font-semibold text-lg">{item.name}</h3>
                            </Link>
                            <p className="text-lg font-medium mt-2">${item.price.toFixed(2)}</p>
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={isLoading}
                                className="h-8 w-8 p-0"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center font-medium">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                disabled={isLoading}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {/* Remove Button */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFromCart(item.id)}
                              disabled={isLoading}
                              className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          {/* Item Subtotal */}
                          <div className="text-right">
                            <p className="font-semibold text-lg">${item.subtotal.toFixed(2)}</p>
                          </div>
                        </div>
                        
                        {index < cart.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cart Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Subtotal ({totalItems} items)</span>
                      <span className="font-medium">${cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Delivery */}
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Delivery Charge</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </div>

                    <Separator />

                    {/* Total */}
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>Delivery Estimated Date: 2024/06/12</p>
                    </div>

                    <Button 
                      className="w-full mt-6" 
                      size="lg"
                      asChild
                    >
                      <Link href="/checkout">
                        Proceed to Checkout
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>

                    <Button 
                      variant="outline"
                      className="w-full"
                      asChild
                    >
                      <Link href="/">
                        Continue Shopping
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}