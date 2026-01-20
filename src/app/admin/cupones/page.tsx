"use client";

import AdminGuard from "@/components/guards/AdminGuard";
import { useState, useEffect } from "react";
import { getAllCoupons, createCoupon } from "@/services/coupon.service";
import { Coupon, CouponType } from "@/interfaces/coupon.interface";

export default function AdminCuponesPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    type: CouponType.PERCENT,
    value: "",
    maxRedemptions: "10",
  });
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data);
      setError(null);
    } catch (err: any) {
      console.error("Error fetching coupons:", err);
      setError(err.message || "Error al cargar cupones");
    } finally {
      setLoading(false);
    }
  };

  const getUsedRedemptions = (coupon: Coupon): number => {
    if (!coupon.redemptions) return 0;
    return coupon.redemptions.filter(
      (r) => r.status === "RESERVED" || r.status === "APPLIED"
    ).length;
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.code.trim() || !formData.value) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    setProcessing(true);
    try {
      await createCoupon({
        code: formData.code.trim().toUpperCase(),
        type: formData.type,
        value: parseInt(formData.value),
        maxRedemptions: parseInt(formData.maxRedemptions),
      });

      await fetchCoupons();
      setSuccessMessage(`Cupón "${formData.code}" creado exitosamente`);
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowCreateModal(false);
      setFormData({
        code: "",
        type: CouponType.PERCENT,
        value: "",
        maxRedemptions: "10",
      });
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
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando cupones...</p>
          </div>
        </div>
      </AdminGuard>
    );
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400">
              ✓ {successMessage}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
              ✗ {error}
            </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Gestión de Cupones
              </h1>
              <p className="text-gray-400">Administra los cupones de descuento</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold flex items-center gap-2"
            >
              <span className="text-xl">+</span>
              Crear Cupón
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Cupones</p>
              <p className="text-3xl font-bold text-white">{coupons.length}</p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Activos</p>
              <p className="text-3xl font-bold text-green-400">
                {coupons.filter((c) => c.isActive).length}
              </p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Inactivos</p>
              <p className="text-3xl font-bold text-red-400">
                {coupons.filter((c) => !c.isActive).length}
              </p>
            </div>
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm mb-1">Total Usos</p>
              <p className="text-3xl font-bold text-blue-400">
                {coupons.reduce((sum, c) => sum + getUsedRedemptions(c), 0)}
              </p>
            </div>
          </div>

          {/* Coupons Grid */}
          {coupons.length === 0 ? (
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-12 text-center">
              <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🎫</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No hay cupones creados
              </h3>
              <p className="text-gray-400 mb-6">
                Crea tu primer cupón para comenzar
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold"
              >
                Crear Primer Cupón
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coupons.map((coupon) => {
                const used = getUsedRedemptions(coupon);
                const usagePercent = Math.round((used / coupon.maxRedemptions) * 100);
                const isExpired = used >= coupon.maxRedemptions;

                return (
                  <div
                    key={coupon.id}
                    className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white/80 text-sm font-medium">
                          CUPÓN
                        </span>
                        {coupon.isActive && !isExpired ? (
                          <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                            ● ACTIVO
                          </span>
                        ) : isExpired ? (
                          <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full font-bold">
                            ⏰ AGOTADO
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded-full font-bold">
                            ⏸ INACTIVO
                          </span>
                        )}
                      </div>
                      <h3 className="text-2xl font-mono font-bold text-white tracking-wider">
                        {coupon.code}
                      </h3>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      {/* Discount */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <p className="text-gray-400 text-sm">Descuento</p>
                          <p className="text-2xl font-bold text-purple-400">
                            {coupon.type === CouponType.PERCENT
                              ? `${coupon.value}%`
                              : `$${coupon.value}`}
                          </p>
                        </div>
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            coupon.type === CouponType.PERCENT
                              ? "bg-blue-500/20"
                              : "bg-green-500/20"
                          }`}
                        >
                          <span className="text-2xl">
                            {coupon.type === CouponType.PERCENT ? "%" : "$"}
                          </span>
                        </div>
                      </div>

                      {/* Usage */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-400">Usos</span>
                          <span className="text-white font-medium">
                            {used} / {coupon.maxRedemptions}
                          </span>
                        </div>
                        <div className="w-full bg-zinc-700 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              usagePercent >= 100
                                ? "bg-red-500"
                                : usagePercent >= 75
                                ? "bg-orange-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${Math.min(usagePercent, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Date */}
                      <div className="text-sm text-gray-400">
                        <span className="mr-2">📅</span>
                        Creado: {formatDate(coupon.createdAt)}
                      </div>

                      {/* Restrictions */}
                      {((coupon.events && coupon.events.length > 0) ||
                        (coupon.categories && coupon.categories.length > 0)) && (
                        <div className="mt-4 p-3 bg-zinc-700/30 rounded-lg">
                          <p className="text-xs text-gray-400 mb-1">Restricciones:</p>
                          {coupon.events && coupon.events.length > 0 && (
                            <p className="text-sm text-white">
                              📅 {coupon.events.length} evento(s)
                            </p>
                          )}
                          {coupon.categories && coupon.categories.length > 0 && (
                            <p className="text-sm text-white">
                              🏷️ {coupon.categories.length} categoría(s)
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-green-500/10">
                <span className="text-4xl">🎟️</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white text-center mb-4">
              Crear Nuevo Cupón
            </h3>

            <form onSubmit={handleCreateCoupon} className="space-y-4 mb-6">
              {/* Code */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Código del Cupón *
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  placeholder="VERANO2026"
                  maxLength={50}
                  className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white font-mono focus:outline-none focus:border-purple-500 uppercase"
                  required
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Descuento *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      type: e.target.value as CouponType,
                    })
                  }
                  className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                >
                  <option value={CouponType.PERCENT}>Porcentaje (%)</option>
                  <option value={CouponType.FIXED}>Monto Fijo ($)</option>
                </select>
              </div>

              {/* Value */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Valor del Descuento *
                </label>
                <input
                  type="number"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  min="1"
                  max={formData.type === CouponType.PERCENT ? "100" : undefined}
                  placeholder={formData.type === CouponType.PERCENT ? "10" : "1000"}
                  className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
                {formData.type === CouponType.PERCENT && (
                  <p className="text-xs text-gray-500 mt-1">Máximo 100%</p>
                )}
              </div>

              {/* Max Redemptions */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Máximo de Usos *
                </label>
                <input
                  type="number"
                  value={formData.maxRedemptions}
                  onChange={(e) =>
                    setFormData({ ...formData, maxRedemptions: e.target.value })
                  }
                  min="1"
                  placeholder="10"
                  className="w-full px-3 py-2 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>
            </form>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateCoupon}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Creando...
                  </>
                ) : (
                  "Crear Cupón"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminGuard>
  );
}