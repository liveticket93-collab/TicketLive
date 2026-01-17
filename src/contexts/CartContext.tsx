"use client";

import { createContext, useContext, useEffect, useState } from "react";
import IEvent from "@/interfaces/event.interface";
import { ICartItem } from "@/interfaces/cart.interface";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  getCart,
  addItemToCart,
  removeCartItem,
  clearCartBackend,
} from "@/services/cart.service";

interface CartContextType {
  cartItems: ICartItem[];
  addToCart: (event: IEvent) => void;
  increaseQuantity: (eventId: number) => void;
  decreaseQuantity: (eventId: number) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  const refreshCart = async () => {
    if (!isLoggedIn) {
      setCartItems([]);
      return;
    }
    try {
      const cart = await getCart();
      setCartItems(cart.items || []);
    } catch (error) {
      console.error("Error al refrescar el carrito:", error);
      setCartItems([]);
    }
  };

  useEffect(() => {
    let cancelled = false;
    const syncCart = async () => {
      if (!isLoggedIn) {
        setCartItems([]);
        return;
      }
      try {
        const cart = await getCart();
        if (!cancelled) {
          setCartItems(cart.items || []);
        }
      } catch {
        if (!cancelled) {
          setCartItems([]);
        }
      }
    };
    syncCart();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const addToCart = (event: IEvent) => {
    if (!isLoggedIn) {
      toast.error("Debes tener una cuenta para agregar productos al carrito");
      return;
    }
    let shouldSyncBackend = false;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.event.id === event.id);
      if (existing) {
        if (existing.quantity >= 6) {
          toast.error("Un usuario no puede comprar más de 6 boletos");
          return prev;
        }
        shouldSyncBackend = true;
        return prev.map((i) =>
          i.event.id === event.id
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      shouldSyncBackend = true;
      return [
        ...prev,
        {
          id: crypto.randomUUID(),
          event,
          quantity: 1,
          unitPrice: event.price,
        },
      ];
    });
    if (shouldSyncBackend) {
      addItemToCart(String(event.id), 1);
      toast.success("Evento agregado al carrito");
    }
  };

  const increaseQuantity = (eventId: number) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.event.id !== eventId) return item;
        if (item.quantity >= 6) {
          toast.error("Un usuario no puede comprar más de 6 boletos");
          return item;
        }
        return { ...item, quantity: item.quantity + 1 };
      })
    );
    addItemToCart(String(eventId), 1);
  };

  const decreaseQuantity = (eventId: number) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.event.id === eventId);
      if (!item) return prev;
      if (item.quantity === 1) {
        removeCartItem(item.id);
        return prev.filter((i) => i.event.id !== eventId);
      }
      return prev.map((i) =>
        i.event.id === eventId
          ? { ...i, quantity: i.quantity - 1 }
          : i
      );
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== cartItemId));
    removeCartItem(cartItemId);
  };

  const clearCart = () => {
    setCartItems([]);
    clearCartBackend();
  };

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.unitPrice * item.quantity,
      0
    );

  const getItemCount = () =>
    cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeFromCart,
        clearCart,
        getTotal,
        getItemCount,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("El useCart debe ser usado dentro de CartProvider");
  }
  return context;
}
