"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface TicketItem {
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  eventLocation: string;
  quantity: number;
  unitPrice: number;
}

interface Order {
  id: string;
  date: string;
  items: TicketItem[];
  total: number;
  discount: number;
  couponCode?: string;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  paymentMethod: string;
}

interface TicketsContextType {
  orders: Order[];
  addOrder: (order: Omit<Order, "id" | "date" | "status">) => string;
  completeOrder: (orderId: string) => void;
  cancelOrder: (orderId: string) => void;
  getCompletedOrders: () => Order[];
  getPendingOrders: () => Order[];
  getOrderById: (orderId: string) => Order | undefined;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

export function TicketsProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);

  // Cargar órdenes desde localStorage
  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      try {
        const parsed = JSON.parse(storedOrders);
        setOrders(parsed);
      } catch (error) {
        console.error("Error loading orders:", error);
        localStorage.removeItem("orders");
      }
    }
  }, []);

  // Guardar en localStorage cada vez que cambian las órdenes
  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem("orders", JSON.stringify(orders));
    }
  }, [orders]);

  const addOrder = (orderData: Omit<Order, "id" | "date" | "status">): string => {
    const newOrder: Order = {
      ...orderData,
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      date: new Date().toISOString(),
      status: "PENDING",
    };

    setOrders((prev) => [...prev, newOrder]);
    return newOrder.id;
  };

  const completeOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "COMPLETED" as const } : order
      )
    );
    toast.success("¡Compra confirmada! 🎉");
  };

  const cancelOrder = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "CANCELLED" as const } : order
      )
    );
  };

  const getCompletedOrders = () => {
    return orders.filter((order) => order.status === "COMPLETED");
  };

  const getPendingOrders = () => {
    return orders.filter((order) => order.status === "PENDING");
  };

  const getOrderById = (orderId: string) => {
    return orders.find((order) => order.id === orderId);
  };

  return (
    <TicketsContext.Provider
      value={{
        orders,
        addOrder,
        completeOrder,
        cancelOrder,
        getCompletedOrders,
        getPendingOrders,
        getOrderById,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
}

export function useTickets() {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error("useTickets must be used within TicketsProvider");
  }
  return context;
}