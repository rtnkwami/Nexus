"use client"
import { useParams } from 'next/navigation';
import OrderDetailsPage from '@/components/OrderDetailsPage';

export default function OrderDetailsRoute() {
 const params = useParams();
 const orderId = params.orderId as string;
 
 return <OrderDetailsPage orderId={orderId} />;
}