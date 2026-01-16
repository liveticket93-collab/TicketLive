"use client";

import { useAuth } from "@/contexts/AuthContext";
import AdminGuard from "@/components/guards/AdminGuard";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aquí podrías hacer fetch de estadísticas desde el backend
    // Por ahora usamos datos de ejemplo
    setLoading(false);
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Panel de Administración
            </h1>
            <p className="text-gray-400">
              Bienvenido, <span className="text-purple-400">{user?.email}</span>
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Usuarios */}
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border border-purple-500/30 rounded-2xl p-6 hover:border-purple-400/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className="text-sm text-purple-400 font-medium">+12%</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Usuarios</h3>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </div>

            {/* Total Eventos */}
            <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 border border-pink-500/30 rounded-2xl p-6 hover:border-pink-400/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-pink-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-sm text-pink-400 font-medium">+8%</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Total Eventos</h3>
              <p className="text-3xl font-bold text-white">{stats.totalEvents}</p>
            </div>

            {/* Total Órdenes */}
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border border-blue-500/30 rounded-2xl p-6 hover:border-blue-400/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <span className="text-sm text-blue-400 font-medium">+23%</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Órdenes Totales</h3>
              <p className="text-3xl font-bold text-white">{stats.totalOrders}</p>
            </div>

            {/* Ingresos */}
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 border border-green-500/30 rounded-2xl p-6 hover:border-green-400/50 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-600/30 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm text-green-400 font-medium">+15%</span>
              </div>
              <h3 className="text-gray-400 text-sm mb-1">Ingresos Totales</h3>
              <p className="text-3xl font-bold text-white">${stats.totalRevenue}</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Acciones Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Crear Evento */}
              <Link
                href="/admin/eventos/crear"
                className="bg-zinc-800/50 border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/50 hover:bg-zinc-800/70 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center group-hover:bg-purple-600/30 transition-all">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Crear Evento</h3>
                    <p className="text-gray-400 text-sm">Agregar nuevo evento</p>
                  </div>
                </div>
              </Link>

              {/* Gestionar Eventos */}
              <Link
                href="/admin/eventos"
                className="bg-zinc-800/50 border border-pink-500/20 rounded-xl p-6 hover:border-pink-500/50 hover:bg-zinc-800/70 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-pink-600/20 rounded-xl flex items-center justify-center group-hover:bg-pink-600/30 transition-all">
                    <svg className="w-6 h-6 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Gestionar Eventos</h3>
                    <p className="text-gray-400 text-sm">Ver y editar eventos</p>
                  </div>
                </div>
              </Link>

              {/* Ver Usuarios */}
              <Link
                href="/admin/usuarios"
                className="bg-zinc-800/50 border border-blue-500/20 rounded-xl p-6 hover:border-blue-500/50 hover:bg-zinc-800/70 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center group-hover:bg-blue-600/30 transition-all">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Ver Usuarios</h3>
                    <p className="text-gray-400 text-sm">Lista de usuarios</p>
                  </div>
                </div>
              </Link>

              {/* Ver Ventas */}
              <Link
                href="/admin/ventas"
                className="bg-zinc-800/50 border border-green-500/20 rounded-xl p-6 hover:border-green-500/50 hover:bg-zinc-800/70 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-600/20 rounded-xl flex items-center justify-center group-hover:bg-green-600/30 transition-all">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Ver Ventas</h3>
                    <p className="text-gray-400 text-sm">Historial de órdenes</p>
                  </div>
                </div>
              </Link>

              {/* Categorías */}
              <Link
                href="/admin/categorias"
                className="bg-zinc-800/50 border border-yellow-500/20 rounded-xl p-6 hover:border-yellow-500/50 hover:bg-zinc-800/70 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-600/20 rounded-xl flex items-center justify-center group-hover:bg-yellow-600/30 transition-all">
                    <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Categorías</h3>
                    <p className="text-gray-400 text-sm">Gestionar categorías</p>
                  </div>
                </div>
              </Link>

              {/* Mi Perfil */}
              <Link
                href="/dashboard"
                className="bg-zinc-800/50 border border-gray-500/20 rounded-xl p-6 hover:border-gray-500/50 hover:bg-zinc-800/70 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600/20 rounded-xl flex items-center justify-center group-hover:bg-gray-600/30 transition-all">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">Mi Perfil</h3>
                    <p className="text-gray-400 text-sm">Ver mi perfil</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Actividad Reciente</h2>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
              <div className="p-6">
                <p className="text-gray-400 text-center py-8">
                  No hay actividad reciente
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminGuard>
  );
}