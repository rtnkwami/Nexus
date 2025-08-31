"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface CartContextType {
  cart: CartItem[];
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateCartItem: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart data from API
  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/carts', {
        credentials: 'include',
        cache: 'no-store',                      // 👈 prevent caching
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCart(data.cart || []);
        setCartTotal(data.cartTotal || 0);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = () => {
  setCart([]);
  setCartTotal(0);
};

  // Add item to cart
  const addToCart = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:5000/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id: productId,
          quantity: quantity,
        }),
      });

      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (productId: string, quantity: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/carts/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          quantity: quantity,
        }),
      });

      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:5000/carts/${productId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        await refreshCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load cart on component mount
  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        isLoading,
        addToCart,
        updateCartItem,
        removeFromCart,
        refreshCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};