"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { useCartCoupons } from "@/hooks/useCartCoupons";
import { getAllCoupons } from "@/services/coupon.service";
import { Coupon, CouponType } from "@/interfaces/coupon.interface";

export default function PromocionesPage() {
  const router = useRouter();
  const { isLoggedIn } = useAuth();
  const { cartItems } = useCart();
  const { applyCoupon, appliedCoupon } = useCartCoupons();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ⭐ Actualizar cuando la página vuelva a estar visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchCoupons();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const data = await getAllCoupons();
      setCoupons(data);
    } catch (error) {
      console.error("Error loading coupons:", error);
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

  const isExpired = (coupon: Coupon): boolean => {
    const used = getUsedRedemptions(coupon);
    return used >= coupon.maxRedemptions;
  };

  const handleUseCoupon = async (code: string) => {
    if (!isLoggedIn) {
      alert("Debes iniciar sesión para usar cupones");
      router.push("/login");
      return;
    }

    setApplying(code);
    const success = await applyCoupon(code);
    
    if (success) {
      // ⭐ Actualizar lista de cupones para reflejar el nuevo contador
      await fetchCoupons();
      
      // Si el carrito está vacío, redirigir a eventos
      // Si tiene productos, redirigir al carrito
      if (cartItems.length === 0) {
        setTimeout(() => {
          router.push("/events");
        }, 1500);
      } else {
        setTimeout(() => {
          router.push("/cart");
        }, 1000);
      }
    } else {
      // Si falla, también actualizar por si el error fue que ya lo usó
      await fetchCoupons();
    }
    
    setApplying(null);
  };

  const activeCoupons = coupons.filter((c) => c.isActive && !isExpired(c));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Cargando promociones...</p>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            🎫 Promociones Disponibles
          </h1>
          <p className="text-gray-400 text-lg">
            Usa estos cupones para obtener descuentos en tus compras
          </p>
        </div>

        {activeCoupons.length === 0 ? (
          <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-12 text-center">
            <div className="w-16 h-16 bg-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No hay promociones disponibles</h3>
            <p className="text-gray-400">Vuelve pronto para ver nuevas ofertas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCoupons.map((coupon) => {
              const used = getUsedRedemptions(coupon);
              const remaining = coupon.maxRedemptions - used;
              const usagePercentage = (used / coupon.maxRedemptions) * 100;
              const isApplied = appliedCoupon?.coupon.code === coupon.code;

              return (
                <div
                  key={coupon.id}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-lg hover:shadow-purple-500/20"
                >
                  {/* Header del cupón */}
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/80 text-sm font-medium">CUPÓN DE DESCUENTO</span>
                      {isApplied && (
                        <span className="px-2 py-1 bg-green-500 text-white text-xs rounded-full font-bold">
                          ✓ APLICADO
                        </span>
                      )}
                    </div>
                    <h3 className="text-3xl font-mono font-bold text-white tracking-wider">
                      {coupon.code}
                    </h3>
                  </div>

                  {/* Contenido */}
                  <div className="p-6">
                    {/* Descuento */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-sm">Descuento</p>
                        <p className="text-3xl font-bold text-purple-400">
                          {coupon.type === CouponType.PERCENT
                            ? `${coupon.value}%`
                            : `$${coupon.value}`}
                        </p>
                      </div>
                      {coupon.type === CouponType.PERCENT ? (
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Usos disponibles */}
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-400">Usos disponibles</span>
                        <span className="text-white font-medium">{remaining} / {coupon.maxRedemptions}</span>
                      </div>
                      <div className="w-full bg-zinc-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            usagePercentage >= 90
                              ? "bg-red-500"
                              : usagePercentage >= 70
                              ? "bg-orange-500"
                              : "bg-green-500"
                          }`}
                          style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Restricciones */}
                    {((coupon.events && coupon.events.length > 0) ||
                      (coupon.categories && coupon.categories.length > 0)) && (
                      <div className="mb-4 p-3 bg-zinc-700/30 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Válido para:</p>
                        {coupon.events && coupon.events.length > 0 && (
                          <p className="text-sm text-white">
                            📅 {coupon.events.length} evento(s) específico(s)
                          </p>
                        )}
                        {coupon.categories && coupon.categories.length > 0 && (
                          <p className="text-sm text-white">
                            🏷️ {coupon.categories.length} categoría(s)
                          </p>
                        )}
                      </div>
                    )}

                    {/* Botón */}
                    <button
                      onClick={() => handleUseCoupon(coupon.code)}
                      disabled={applying === coupon.code || isApplied}
                      className={`w-full py-3 rounded-lg font-bold transition-all ${
                        isApplied
                          ? "bg-green-500 text-white cursor-default"
                          : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {applying === coupon.code ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                          Aplicando...
                        </span>
                      ) : isApplied ? (
                        "✓ Cupón Aplicado"
                      ) : (
                        "Usar Cupón"
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Instrucciones */}
        <div className="mt-12 bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📖 ¿Cómo usar un cupón?</h3>
          <div className="grid md:grid-cols-3 gap-4 text-gray-400">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                1
              </span>
              <div>
                <p className="text-white font-medium mb-1">Agrega productos</p>
                <p className="text-sm">Agrega eventos a tu carrito de compras</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                2
              </span>
              <div>
                <p className="text-white font-medium mb-1">Usa el cupón</p>
                <p className="text-sm">Click en "Usar Cupón" en la promoción deseada</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 font-bold">
                3
              </span>
              <div>
                <p className="text-white font-medium mb-1">Completa tu compra</p>
                <p className="text-sm">El descuento se aplicará automáticamente</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}