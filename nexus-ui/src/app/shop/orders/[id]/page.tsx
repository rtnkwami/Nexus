"use client"
import { useParams } from 'next/navigation';
import OrderDetailsPage from '@/components/OrderDetailsPage';

export default function OrderDetailsRoute() {

 const { id } = useParams();
 
 return <OrderDetailsPage 
            homeUrl={"/shop/orders"}
            fetchUrl={`http://localhost:5000/shops/orders/${id}`}
        />;
}