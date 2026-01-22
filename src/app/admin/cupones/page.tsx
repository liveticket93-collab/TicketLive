"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit, X, Tag, TrendingDown, Loader2, AlertTriangle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface Coupon {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  isActive: boolean;
  maxRedemptions: number;
  createdAt: string;
  updatedAt: string;
  events?: Array<{ id: string; title: string }>;
  categories?: Array<{ id: string; name: string }>;
}

interface CouponFormData {
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  maxRedemptions: number;
  isActive: boolean;
}

export default function AdminCuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [couponToDelete, setCouponToDelete] = useState<Coupon | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState<CouponFormData>({
    code: '',
    type: 'PERCENT',
    value: 0,
    maxRedemptions: 10,
    isActive: true,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/coupons`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setCoupons(data);
      }
    } catch (err) {
      console.error('Error loading coupons:', err);
      showToast("Error al cargar cupones", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error" = "success") => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
      type === 'success' ? 'bg-green-600' : 'bg-red-600'
    } text-white`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  };

  const openCreateModal = () => {
    setEditingCoupon(null);
    setFormData({
      code: '',
      type: 'PERCENT',
      value: 0,
      maxRedemptions: 10,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      maxRedemptions: coupon.maxRedemptions,
      isActive: coupon.isActive,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCoupon(null);
  };

  const openDeleteModal = (coupon: Coupon) => {
    setCouponToDelete(coupon);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCouponToDelete(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingCoupon
        ? `${API_URL}/coupons/${editingCoupon.id}`
        : `${API_URL}/coupons`;

      const method = editingCoupon ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast(editingCoupon ? 'Cupón actualizado' : 'Cupón creado', 'success');
        closeModal();
        loadCoupons();
      } else {
        const error = await response.json();
        showToast(error.message || 'Error al guardar cupón', 'error');
      }
    } catch (err) {
      console.error('Error saving coupon:', err);
      showToast('Error al guardar cupón', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`${API_URL}/coupons/${couponToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        showToast('Cupón eliminado correctamente', 'success');
        closeDeleteModal();
        loadCoupons();
      } else {
        const error = await response.json();
        showToast(error.message || 'Error al eliminar cupón', 'error');
      }
    } catch (err) {
      console.error('Error deleting coupon:', err);
      showToast('Error al eliminar cupón', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const handleToggleActive = async (coupon: Coupon) => {
    try {
      const response = await fetch(`${API_URL}/coupons/${coupon.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isActive: !coupon.isActive,
        }),
      });

      if (response.ok) {
        showToast(coupon.isActive ? 'Cupón desactivado' : 'Cupón activado', 'success');
        loadCoupons();
      } else {
        const error = await response.json();
        showToast(error.message || 'Error al cambiar estado', 'error');
      }
    } catch (err) {
      console.error('Error toggling active:', err);
      showToast('Error al cambiar estado', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black px-4 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Administración de Cupones
            </h1>
            <p className="text-gray-400">
              Gestiona todos los cupones de descuento
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Crear Cupón
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-zinc-800/50 rounded-xl p-6 border border-purple-500/20">
            <p className="text-gray-400 text-sm mb-1">Total Cupones</p>
            <p className="text-3xl font-bold text-white">{coupons.length}</p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-6 border border-green-500/20">
            <p className="text-gray-400 text-sm mb-1">Activos</p>
            <p className="text-3xl font-bold text-green-400">
              {coupons.filter(c => c.isActive).length}
            </p>
          </div>
          <div className="bg-zinc-800/50 rounded-xl p-6 border border-red-500/20">
            <p className="text-gray-400 text-sm mb-1">Inactivos</p>
            <p className="text-3xl font-bold text-red-400">
              {coupons.filter(c => !c.isActive).length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
          </div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-12 bg-zinc-800/50 rounded-xl border border-zinc-700">
            <Tag className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No hay cupones creados</p>
            <button
              onClick={openCreateModal}
              className="mt-4 text-purple-400 hover:text-purple-300"
            >
              Crear el primero
            </button>
          </div>
        ) : (
          <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-700">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Código</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Valor</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Límite</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-400">Estado</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-400">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-700">
                  {coupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-zinc-700/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Tag className="w-4 h-4 text-purple-400" />
                          <span className="font-mono font-bold text-white">{coupon.code}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">
                          {coupon.type === 'PERCENT' ? 'Porcentaje' : 'Fijo'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <TrendingDown className="w-4 h-4 text-green-400" />
                          <span className="font-bold text-white">
                            {coupon.type === 'PERCENT' ? `${coupon.value}%` : `$${coupon.value}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-300">{coupon.maxRedemptions} usos</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            coupon.isActive
                              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                          }`}
                        >
                          {coupon.isActive ? 'Activo' : 'Inactivo'}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(coupon)}
                            className="p-2 hover:bg-zinc-600 rounded-lg transition-colors text-gray-400 hover:text-white"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(coupon)}
                            className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-gray-400 hover:text-red-400"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Modal Crear/Editar */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full border border-zinc-700">
            <div className="flex items-center justify-between p-6 border-b border-zinc-700">
              <h2 className="text-xl font-bold text-white">
                {editingCoupon ? 'Editar Cupón' : 'Crear Nuevo Cupón'}
              </h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Código del Cupón</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="VERANO2026"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Descuento</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'PERCENT' | 'FIXED' })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value="PERCENT">Porcentaje (%)</option>
                  <option value="FIXED">Monto Fijo ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor {formData.type === 'PERCENT' ? '(%)' : '($)'}
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  min="1"
                  max={formData.type === 'PERCENT' ? 100 : undefined}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Límite de Usos</label>
                <input
                  type="number"
                  value={formData.maxRedemptions}
                  onChange={(e) => setFormData({ ...formData, maxRedemptions: parseInt(e.target.value) || 10 })}
                  className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  min="1"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-purple-600"
                />
                <label htmlFor="isActive" className="text-sm text-gray-300">Cupón activo</label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </span>
                  ) : (
                    editingCoupon ? 'Actualizar' : 'Crear Cupón'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {isDeleteModalOpen && couponToDelete && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 rounded-2xl max-w-md w-full border border-red-500/30">
            <div className="flex items-center gap-3 p-6 border-b border-zinc-700">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">¿Eliminar cupón?</h2>
                <p className="text-sm text-gray-400 mt-1">Esta acción no se puede deshacer</p>
              </div>
            </div>

            <div className="p-6">
              <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Código:</span>
                  <span className="font-mono font-bold text-white">{couponToDelete.code}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Descuento:</span>
                  <span className="font-bold text-purple-400">
                    {couponToDelete.type === 'PERCENT' 
                      ? `${couponToDelete.value}%` 
                      : `$${couponToDelete.value}`
                    }
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-400">Estado:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    couponToDelete.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {couponToDelete.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-6">
                Al eliminar este cupón, los usuarios ya no podrán utilizarlo. 
                Si prefieres mantener el historial, considera desactivarlo en su lugar.
              </p>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={closeDeleteModal}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-all disabled:opacity-50"
                >
                  {deleting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Eliminando...
                    </span>
                  ) : (
                    'Eliminar cupón'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}