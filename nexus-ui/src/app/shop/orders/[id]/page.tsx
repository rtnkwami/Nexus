"use client"
import { useParams } from 'next/navigation';
import OrderDetailsPage from '@/components/OrderDetailsPage';

export default function OrderDetailsRoute() {

 const { id } = useParams();
 
 return <OrderDetailsPage 
            orderId={id} 
            homeUrl={"/shop/orders"}
        />;
}