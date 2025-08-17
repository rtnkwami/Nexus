"use client"
import { useParams } from 'next/navigation';
import OrderDetailsPage from '@/components/OrderDetailsPage';

export default function OrderDetailsRoute() {
 const { id } = useParams();
 
 return <OrderDetailsPage
            homeUrl={"/dashboard/orders"}
            fetchUrl={`http://localhost:5000/users/orders/${id}`}
        />;
}