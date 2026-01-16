"use client";

import AdminGuard from "@/components/guards/AdminGuard";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  createdAt: string;
  isAdmin: boolean;
  isActive: boolean;
  bannedAt: string | null;
  banReason: string | null;
}

type ActionType = "delete" | "ban" | "unban";

export default function UsuariosPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    show: boolean;
    type: ActionType | null;
    user: User | null;
  }>({
    show: false,
    type: null,
    user: null,
  });
  const [banReason, setBanReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users?page=${currentPage}&limit=50`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching users:", err);
      setError(err.message || "Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: ActionType, user: User) => {
    setActionModal({ show: true, type, user });
    setBanReason("");
  };

  const handleConfirmAction = async () => {
    if (!actionModal.user || !actionModal.type) return;

    setProcessing(true);
    try {
      let endpoint = "";
      let method = "";
      let body = null;

      switch (actionModal.type) {
        case "delete":
          endpoint = `${API_URL}/users/${actionModal.user.id}`;
          method = "DELETE";
          break;
        case "ban":
          endpoint = `${API_URL}/users/${actionModal.user.id}/ban`;
          method = "PATCH";
          body = JSON.stringify({ reason: banReason || "Sin razón especificada" });
          break;
        case "unban":
          endpoint = `${API_URL}/users/${actionModal.user.id}/unban`;
          method = "PATCH";
          break;
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body,
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      // Actualizar la lista
      if (actionModal.type === "delete") {
        setUsers(users.filter((u) => u.id !== actionModal.user!.id));
        setSuccessMessage(`Usuario "${actionModal.user.name}" eliminado`);
      } else {
        await fetchUsers(); // Recargar lista completa
        const action = actionModal.type === "ban" ? "baneado" : "desbaneado";
        setSuccessMessage(`Usuario "${actionModal.user.name}" ${action}`);
      }

      setTimeout(() => setSuccessMessage(null), 3000);
      setActionModal({ show: false, type: null, user: null });
    } catch (err: any) {
      console.error("Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-AR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getModalContent = () => {
    if (!actionModal.user) return null;

    switch (actionModal.type) {
      case "delete":
        return {
          icon: "🗑️",
          color: "red",
          title: "¿Eliminar Usuario?",
          message: (
            <>
              Estás a punto de eliminar permanentemente a{" "}
              <span className="font-semibold text-white">{actionModal.user.name}</span>
              {" "}({actionModal.user.email}).
              <br /><br />
              <span className="text-red-400 font-medium">
                Esta acción NO se puede deshacer. Se perderán todos sus datos.
              </span>
            </>
          ),
          confirmText: "Eliminar Permanentemente",
          showReasonInput: false,
        };
      case "ban":
        return {
          icon: "🚫",
          color: "orange",
          title: "¿Banear Usuario?",
          message: (
            <>
              Vas a banear a{" "}
              <span className="font-semibold text-white">{actionModal.user.name}</span>
              {" "}({actionModal.user.email}).
              <br /><br />
              El usuario no podrá:
              <ul className="list-disc list-inside mt-2 text-sm">
                <li>Acceder a su perfil</li>
                <li>Realizar compras</li>
                <li>Usar endpoints protegidos</li>
              </ul>
            </>
          ),
          confirmText: "Confirmar Baneo",
          showReasonInput: true,
        };
      case "unban":
        return {
          icon: "✅",
          color: "green",
          title: "¿Desbanear Usuario?",
          message: (
            <>
              Vas a desbanear a{" "}
              <span className="font-semibold text-white">{actionModal.user.name}</span>.
              <br /><br />
              El usuario recuperará el acceso completo a la plataforma.
            </>
          ),
          confirmText: "Confirmar Desbaneo",
          showReasonInput: false,
        };
    }
  };

  const modalContent = getModalContent();

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
              Volver al Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white">Usuarios Registrados</h1>
            <p className="text-gray-400 mt-2">Total: {users.length} usuarios en esta página</p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-500/10 border border-green-500 rounded-lg p-4 mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-400">✅ {successMessage}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              <span className="ml-3 text-gray-400">Cargando usuarios...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400">❌ {error}</p>
            </div>
          )}

          {/* Users Table */}
          {!loading && !error && users.length > 0 && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-zinc-700/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Teléfono
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Registro
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-700">
                    {users.map((user) => {
                      const isBanned = !user.isActive;

                      return (
                        <tr key={user.id} className="hover:bg-zinc-700/30 transition-colors">
                          {/* Usuario */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user.name ? user.name.charAt(0).toUpperCase() : "?"}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  {user.name || "Sin nombre"}
                                </div>
                                {user.address && (
                                  <div className="text-sm text-gray-400">
                                    📍 {user.address}
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">{user.email}</div>
                          </td>

                          {/* Estado */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              {/* Rol Badge */}
                              {user.isAdmin ? (
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/50 w-fit">
                                  Admin
                                </span>
                              ) : (
                                <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/50 w-fit">
                                  Usuario
                                </span>
                              )}

                              {/* Ban Badge */}
                              {isBanned && (
                                <span
                                  className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-500/20 text-red-400 border border-red-500/50 w-fit cursor-help"
                                  title={user.banReason || "Sin razón especificada"}
                                >
                                  🚫 Baneado
                                  {user.bannedAt && ` (${formatDate(user.bannedAt)})`}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Teléfono */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-300">
                              {user.phone || (
                                <span className="text-gray-500 italic">Sin teléfono</span>
                              )}
                            </div>
                          </td>

                          {/* Registro */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-400">
                              {formatDate(user.createdAt)}
                            </div>
                          </td>

                          {/* Acciones */}
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex gap-2 justify-end">
                              {/* Botón Banear/Desbanear */}
                              {isBanned ? (
                                <button
                                  onClick={() => handleAction("unban", user)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg transition-colors"
                                  title="Desbanear usuario"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span className="text-sm">Desbanear</span>
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleAction("ban", user)}
                                  className="inline-flex items-center gap-2 px-3 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg transition-colors"
                                  title="Banear usuario"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  <span className="text-sm">Banear</span>
                                </button>
                              )}

                              {/* Botón Eliminar */}
                              <button
                                onClick={() => handleAction("delete", user)}
                                className="inline-flex items-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg transition-colors"
                                title="Eliminar usuario permanentemente"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                <span className="text-sm">Eliminar</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && users.length === 0 && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-12 text-center">
              <div className="text-gray-400 text-lg">
                No hay usuarios registrados aún.
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModal.show && actionModal.user && modalContent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 max-w-md w-full">
            {/* Icon */}
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full ${
                modalContent.color === "red" ? "bg-red-500/10" :
                modalContent.color === "orange" ? "bg-orange-500/10" :
                "bg-green-500/10"
              }`}>
                <span className="text-4xl">{modalContent.icon}</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white text-center mb-4">
              {modalContent.title}
            </h3>

            {/* Message */}
            <div className="text-gray-400 text-center mb-6">
              {modalContent.message}
            </div>

            {/* Reason Input (solo para ban) */}
            {modalContent.showReasonInput && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Razón del Baneo (opcional):
                </label>
                <textarea
                  value={banReason}
                  onChange={(e) => setBanReason(e.target.value)}
                  placeholder="Ej: Comportamiento inapropiado, spam, fraude..."
                  rows={3}
                  className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setActionModal({ show: false, type: null, user: null })}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={processing}
                className={`flex-1 px-4 py-2 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
                  modalContent.color === "red" ? "bg-red-600 hover:bg-red-700" :
                  modalContent.color === "orange" ? "bg-orange-600 hover:bg-orange-700" :
                  "bg-green-600 hover:bg-green-700"
                }`}
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Procesando...
                  </>
                ) : (
                  modalContent.confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}