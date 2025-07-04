import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface UpdateResult {
  success: boolean;
  error?: string;
}

export const useProduct = (productId: string | null) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/shops/products/${productId}`);
        if (!response.ok) throw new Error('Failed to fetch product');
        const productData: Product = await response.json();
        setProduct(productData);
      } catch (error: any) {
        console.error('Error fetching product:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const updateProduct = async (updateData: Partial<Product>): Promise<UpdateResult> => {
    try {
      const response = await fetch(`http://localhost:5000/shops/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) throw new Error('Failed to update product');

      const updatedProduct: Product = await response.json();
      setProduct(updatedProduct);
      return { success: true };
    } catch (error: any) {
      console.error('Error updating product:', error);
      return { success: false, error: error.message };
    }
  };

  return { product, loading, error, updateProduct };
};
