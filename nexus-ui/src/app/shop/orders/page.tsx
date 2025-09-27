"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Calendar, Eye, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAccessToken } from '@auth0/nextjs-auth0';
import SalesPerformanceFilter from '@/components/analytics/salesPerformance/SalesPerformanceFilter';

interface Order {
  id: string;
  status: 'pending' | 'completed' | 'cancelled';
  total: number;
  createdAt: string;
  updatedAt: string;
  ShopId: string;
  UserId: string;
  User: {
    name: string;
  }
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalOrders: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface OrdersResponse {
  orders: Order[];
  pagination: Pagination;
}

export default function ShopOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // You can make this adjustable if needed

  const [filterParams, setFilterParams] = useState<{
    from: Date;
    to: Date;
    granularity: string;
  } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, filterParams]);

  const fetchOrders = async () => {
    try {
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (filterParams) {
        params.append("fromDate", filterParams.from.toISOString());
        params.append("toDate", filterParams.to.toISOString());
        params.append("granularity", filterParams.granularity);
      }

      const token = await getAccessToken();

      const response = await fetch(
        `http://localhost:5000/shops/orders?${params.toString()}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      

      if (!response.ok) throw new Error("Failed to fetch orders");

      const data: OrdersResponse = await response.json();
      setOrders(data.orders);
      setPagination(data.pagination);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch orders");
      setOrders([]);
    }
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    return <Package className="h-4 w-4" />;
  };

  const renderPagination = () => {
    const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;
    
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-600">
          Showing page {currentPage} of {totalPages} ({pagination.totalOrders} total orders)
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };


  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-red-600">
              <p className="text-lg font-medium">Error loading orders</p>
              <p className="text-sm mt-2">{error}</p>
              <Button 
                onClick={fetchOrders} 
                variant="outline" 
                className="mt-4"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-600 mt-2">Track and manage your recent orders</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-700">
              Filter by status:
            </label>
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All orders</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="text-sm text-gray-600">
            {pagination.totalOrders} orders found
          </div>
          <SalesPerformanceFilter onFilterChange={setFilterParams} />
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-gray-500">
              <ShoppingBag className="h-12 w-12 mx-auto mb-4" />
              <p className="text-lg font-medium">
                {statusFilter === 'all' ? 'No orders yet' : `No ${statusFilter} orders`}
              </p>
              <p className="text-sm mt-2">
                {statusFilter === 'all' 
                  ? "When you place orders, they'll appear here" 
                  : `Try selecting a different status filter`
                }
              </p>
              {statusFilter === 'all' && (
                <Button asChild className="mt-4">
                  <Link href="/">Start Shopping</Link>
                </Button>
              )}
              {statusFilter !== 'all' && (
                <Button 
                  onClick={() => handleStatusFilterChange('all')} 
                  variant="outline" 
                  className="mt-4"
                >
                  Show All Orders
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order #{order.id.slice(-8)}
                    </CardTitle>
                    <Badge 
                      variant="outline" 
                      className={getStatusColor(order.status)}
                    >
                      <span className="flex items-center gap-1">
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Order Date</p>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-sm font-medium">Total Amount</p>
                        <p className="text-sm text-gray-600 font-semibold">&#8373;{order.total.toFixed(2)}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">Last Updated</p>
                        <p className="text-sm text-gray-600">{formatDate(order.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <p>Customer: {order.User.name}</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/shop/orders/${order.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
        </>
      )}
    </div>
  );
}