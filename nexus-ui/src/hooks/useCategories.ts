import { useState, useEffect } from 'react';

export const useCategories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/products/categories');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categoriesData: string[] = await response.json();
        setCategories(categoriesData);
      } catch (error: any) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};