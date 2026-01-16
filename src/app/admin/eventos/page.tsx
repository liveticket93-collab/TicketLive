"use client";

import AdminGuard from "@/components/guards/AdminGuard";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  status: boolean;
  imageUrl?: string;
}

export default function AdminEventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(`${API_URL}/events`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este evento?")) return;

    try {
      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setEvents(events.filter((e) => e.id !== id));
        alert("Evento eliminado correctamente");
      } else {
        alert("Error al eliminar evento");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Error al eliminar evento");
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/admin"
                className="text-purple-400 hover:text-purple-300 mb-2 inline-flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver al Panel
              </Link>
              <h1 className="text-4xl font-bold text-white">Gestionar Eventos</h1>
              <p className="text-gray-400 mt-2">Administra todos los eventos de la plataforma</p>
            </div>
            <Link
              href="/admin/eventos/crear"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-lg flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Crear Evento
            </Link>
          </div>

          {/* Events Table */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-12 text-center">
              <p className="text-gray-400 mb-4">No hay eventos creados</p>
              <Link
                href="/admin/eventos/crear"
                className="text-purple-400 hover:text-purple-300"
              >
                Crear primer evento
              </Link>
            </div>
          ) : (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-900/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Ubicación
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Precio
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Capacidad
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {events.map((event) => (
                      <tr key={event.id} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {event.imageUrl && (
                              <img
                                src={event.imageUrl}
                                alt={event.title}
                                className="w-12 h-12 rounded-lg object-cover"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-white">{event.title}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {new Date(event.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {event.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          ${event.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {event.capacity}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              event.status
                                ? "bg-green-900/30 text-green-400"
                                : "bg-red-900/30 text-red-400"
                            }`}
                          >
                            {event.status ? "Activo" : "Inactivo"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/admin/eventos/${event.id}/editar`}
                              className="text-purple-400 hover:text-purple-300"
                            >
                              Editar
                            </Link>
                            <button
                              onClick={() => handleDelete(event.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminGuard>
  );
}