"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, DollarSign, ArrowLeft, ShoppingBag, Edit3 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { getAccessToken } from '@auth0/nextjs-auth0';

interface OrderProduct {
  id: string;
  name: string;
  quantity: number;
  priceAtTime: number;
}

interface Order {
  id: string;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
  ShopId: string;
  UserId: string;
}

interface OrderDetailsPageProps {
  homeUrl: string;
  fetchUrl: string;
  updateStatus?: boolean;
}

export default function OrderDetailsPage({ homeUrl, fetchUrl, updateStatus = false }: OrderDetailsPageProps) {
  const { id } = useParams();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [products, setProducts] = useState<OrderProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setIsLoading(true);
      const token = await getAccessToken();
      
      const response = await fetch(`${fetchUrl}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch order');

      const data = await response.json();
      console.log(data);
      setOrder(data.order);
      setProducts(data.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order || !updateStatus) return;
    
    try {
      setIsUpdatingStatus(true);
      const token = await getAccessToken();
      
      const response = await fetch(`${fetchUrl}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      const updatedData = await response.json();
      
      // Update the local order state
      setOrder(prev => prev ? { ...prev, status: newStatus as Order['status'] } : null);
      
      // You could show a success message here if needed
      console.log('Order status updated successfully');
      
    } catch (err) {
      console.error('Error updating status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (!id) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading order details...</div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-red-600 mb-4">{error || 'Order not found'}</p>
            <Button asChild>
              <Link href={`${homeUrl}`}>Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const subtotal = products.reduce((sum, product) => sum + (product.priceAtTime * product.quantity), 0);

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href={`${homeUrl}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Order #{order.id.slice(-8)}</h1>
            <p className="text-gray-600 mt-2">Placed on {formatDate(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
            {updateStatus && (
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-gray-500" />
                <Select 
                  value={order.status} 
                  onValueChange={handleStatusUpdate}
                  disabled={isUpdatingStatus}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Update status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5" />
                Items ({products.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={product.id}>
                    <div className="flex justify-between items-center">
                      {/* Left side: image + info */}
                      <div className="flex items-center gap-3">
                        {product.images?.length > 0 ? (
                          <div className="relative w-16 h-16">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover rounded-md border"
                              sizes="64px" // tells Next.js the expected display size
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded-md text-gray-400 text-xs">
                            No Image
                          </div>
                        )}
                        <div>
                          <h3 className="font-medium">{product.name}</h3>
                          <p className="text-sm text-gray-600">
                            Qty: {product.quantity} × &#8373;{product.priceAtTime.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      {/* Right side: subtotal */}
                      <p className="font-semibold">
                        &#8373;{(product.priceAtTime * product.quantity).toFixed(2)}
                      </p>
                    </div>

                    {index < products.length - 1 && <Separator className="mt-4" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>&#8373;{subtotal.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>&#8373;{order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="font-medium">Order ID:</span>
                  <p className="text-gray-600 font-mono">{order.id}</p>
                </div>
                <div>
                  <span className="font-medium">Status:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-gray-600">{order.status}</p>
                    {updateStatus && isUpdatingStatus && (
                      <span className="text-xs text-blue-600">Updating...</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="font-medium">Last Updated:</span>
                  <p className="text-gray-600">{formatDate(order.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}