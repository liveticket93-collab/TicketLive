"use client";

import AdminGuard from "@/components/guards/AdminGuard";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Order {
  id: string;
  user: {
    name: string;
    email: string;
  };
  total: number;
  date: string;
  status: string;
}

export default function AdminVentasPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Por ahora datos de ejemplo
    // TODO: Endpoint para listar órdenes
    setLoading(false);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="text-purple-400 hover:text-purple-300 mb-2 inline-flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Volver al Panel
            </Link>
            <h1 className="text-4xl font-bold text-white">Historial de Ventas</h1>
            <p className="text-gray-400 mt-2">Todas las órdenes procesadas en la plataforma</p>
          </div>

          {/* Orders Table */}
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
              </div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-400">
                  No hay ventas registradas aún
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID Orden
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-400">
                            {order.id.slice(0, 8)}...
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-white">{order.user.name}</div>
                          <div className="text-sm text-gray-400">{order.user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-white font-semibold">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              order.status === "PAID"
                                ? "bg-green-900/30 text-green-400"
                                : order.status === "PENDING"
                                ? "bg-yellow-900/30 text-yellow-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}