"use client";

import AdminGuard from "@/components/guards/AdminGuard";
import Link from "next/link";
import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface Category {
  id: string;
  name: string;
}

type ActionType = "create" | "edit" | "delete";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionModal, setActionModal] = useState<{
    show: boolean;
    type: ActionType | null;
    category: Category | null;
  }>({
    show: false,
    type: null,
    category: null,
  });
  const [categoryName, setCategoryName] = useState("");
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/categories`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      setError(err.message || "Error al cargar categorías");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (type: ActionType, category: Category | null = null) => {
    setActionModal({ show: true, type, category });
    setCategoryName(category?.name || "");
  };

  const handleConfirmAction = async () => {
    if (!actionModal.type) return;
    if ((actionModal.type === "create" || actionModal.type === "edit") && !categoryName.trim()) {
      alert("El nombre de la categoría no puede estar vacío");
      return;
    }

    setProcessing(true);
    try {
      let endpoint = "";
      let method = "";
      let body = null;

      switch (actionModal.type) {
        case "create":
          endpoint = `${API_URL}/categories`;
          method = "POST";
          body = JSON.stringify({ name: categoryName.trim() });
          break;
        case "edit":
          if (!actionModal.category) return;
          endpoint = `${API_URL}/categories/${actionModal.category.id}`;
          method = "PATCH";
          body = JSON.stringify({ name: categoryName.trim() });
          break;
        case "delete":
          if (!actionModal.category) return;
          endpoint = `${API_URL}/categories/${actionModal.category.id}`;
          method = "DELETE";
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
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || response.statusText);
      }

      await fetchCategories();
      
      const actionText = 
        actionModal.type === "create" ? "creada" :
        actionModal.type === "edit" ? "editada" :
        "eliminada";
      
      setSuccessMessage(`Categoría "${categoryName || actionModal.category?.name}" ${actionText}`);
      setTimeout(() => setSuccessMessage(null), 3000);
      
      setActionModal({ show: false, type: null, category: null });
      setCategoryName("");
    } catch (err: any) {
      console.error("Error:", err);
      alert(`Error: ${err.message}`);
    } finally {
      setProcessing(false);
    }
  };

  const getModalContent = () => {
    switch (actionModal.type) {
      case "create":
        return {
          icon: "➕",
          color: "green",
          title: "Crear Nueva Categoría",
          confirmText: "Crear Categoría",
          showInput: true,
        };
      case "edit":
        return {
          icon: "✏️",
          color: "blue",
          title: "Editar Categoría",
          confirmText: "Guardar Cambios",
          showInput: true,
        };
      case "delete":
        return {
          icon: "🗑️",
          color: "red",
          title: "¿Eliminar Categoría?",
          message: (
            <>
              ¿Estás seguro de que quieres eliminar la categoría{" "}
              <span className="font-semibold text-white">"{actionModal.category?.name}"</span>?
              <br /><br />
              <span className="text-yellow-400 font-medium">
                ⚠️ Si hay eventos en esta categoría, puede causar errores.
              </span>
            </>
          ),
          confirmText: "Eliminar",
          showInput: false,
        };
      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-4xl mx-auto">
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white">Categorías</h1>
                <p className="text-gray-400 mt-2">Total: {categories.length} categorías</p>
              </div>
              <button
                onClick={() => handleAction("create")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Nueva Categoría
              </button>
            </div>
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
              <span className="ml-3 text-gray-400">Cargando categorías...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400">❌ {error}</p>
            </div>
          )}

          {/* Categories Grid */}
          {!loading && !error && categories.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 hover:bg-zinc-700/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🏷️</span>
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAction("edit", category)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => handleAction("delete", category)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && categories.length === 0 && (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-12 text-center">
              <div className="text-gray-400 text-lg mb-4">
                No hay categorías creadas aún.
              </div>
              <button
                onClick={() => handleAction("create")}
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Crear Primera Categoría
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Action Modal */}
      {actionModal.show && modalContent && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className={`p-3 rounded-full ${
                modalContent.color === "red" ? "bg-red-500/10" :
                modalContent.color === "blue" ? "bg-blue-500/10" :
                "bg-green-500/10"
              }`}>
                <span className="text-4xl">{modalContent.icon}</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-4">
              {modalContent.title}
            </h3>

            {modalContent.message && (
              <div className="text-gray-400 text-center mb-6">
                {modalContent.message}
              </div>
            )}

            {modalContent.showInput && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nombre de la Categoría:
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Ej: Conciertos, Deportes, Teatro..."
                  maxLength={50}
                  className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  autoFocus
                />
                <p className="text-xs text-gray-500 mt-1">
                  {categoryName.length}/50 caracteres
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setActionModal({ show: false, type: null, category: null });
                  setCategoryName("");
                }}
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
                  modalContent.color === "blue" ? "bg-blue-600 hover:bg-blue-700" :
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