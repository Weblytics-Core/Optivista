
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { SiteImage, CartItem } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ToastInfo {
  title: string;
  description: string;
  variant?: 'default' | 'destructive';
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: SiteImage) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const [toastInfo, setToastInfo] = useState<ToastInfo | null>(null);
  
  useEffect(() => {
    const savedCart = localStorage.getItem('optivista_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('optivista_cart', JSON.stringify(cartItems));
  }, [cartItems]);
  
  useEffect(() => {
    if (toastInfo) {
      toast({
        title: toastInfo.title,
        description: toastInfo.description,
        variant: toastInfo.variant,
      });
      setToastInfo(null);
    }
  }, [toastInfo, toast]);


  const addToCart = (item: SiteImage) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        setToastInfo({ title: "Already in Cart", description: `"${item.name}" is already in your cart.` });
        return prevItems;
      }
      setToastInfo({ title: "Added to Cart", description: `"${item.name}" has been added to your cart.` });
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === itemId);
      if(itemToRemove) {
        setToastInfo({ title: "Removed from Cart", description: `"${itemToRemove.name}" has been removed.`, variant: 'destructive' });
      }
      return prevItems.filter(item => item.id !== itemId)
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setToastInfo({ title: "Cart Cleared", description: "Your shopping cart is now empty." });
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);


  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, cartCount }}>
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
