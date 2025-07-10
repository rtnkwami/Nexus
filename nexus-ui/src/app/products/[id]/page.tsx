'use client';

import ProductView from '@/components/ProductView';
import { useParams } from 'next/navigation';

export default function ProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  if (!productId) {
    return <div>Loading...</div>;
  }

  return <ProductView productId={productId} />;
}