"use client";

import { useState } from "react";
import { useCartCoupons } from "@/hooks/useCartCoupons";
import { CouponType } from "@/interfaces/coupon.interface";

export default function CouponSection() {
  const { appliedCoupon, removeCoupon, applyCoupon, getDiscount } = useCartCoupons();
  const [couponCode, setCouponCode] = useState("");
  const [applying, setApplying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setErrorMessage("Por favor ingresa un código de cupón");
      return;
    }

    setApplying(true);
    setErrorMessage(null);
    
    const success = await applyCoupon(couponCode.toUpperCase());
    
    if (success) {
      setCouponCode("");
    } else {
      // El toast ya muestra el error específico
      setErrorMessage("No se pudo aplicar el cupón. Verifica el código e intenta nuevamente.");
    }
    
    setApplying(false);
  };

  return (
    <div className="border-t border-white/5 px-6 py-6">
      <h3 className="text-lg font-bold text-white mb-4">🎫 Cupón de Descuento</h3>

      {appliedCoupon ? (
        // Cupón aplicado
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/50 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-sm text-gray-400 mb-1">Cupón aplicado:</p>
              <p className="text-xl font-mono font-bold text-white">
                {appliedCoupon.coupon.code}
              </p>
            </div>
            <button
              onClick={removeCoupon}
              className="text-red-400 hover:text-red-500 transition-colors"
              title="Remover cupón"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {appliedCoupon.coupon.type === CouponType.PERCENT ? (
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-400">Descuento</p>
                <p className="text-lg font-bold text-purple-400">
                  {appliedCoupon.coupon.type === CouponType.PERCENT
                    ? `${appliedCoupon.coupon.value}% OFF`
                    : `$${appliedCoupon.coupon.value} OFF`}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-400">Ahorras</p>
              <p className="text-2xl font-bold text-green-400">
                -${getDiscount().toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Input para aplicar cupón
        <div>
          <div className="flex gap-3">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => {
                setCouponCode(e.target.value.toUpperCase());
                setErrorMessage(null); // Limpiar error al escribir
              }}
              placeholder="CODIGO DEL CUPON"
              className="flex-1 px-4 py-3 bg-zinc-700/50 border border-zinc-600 rounded-lg text-white font-mono uppercase placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleApplyCoupon();
                }
              }}
            />
            <button
              onClick={handleApplyCoupon}
              disabled={applying}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {applying ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Aplicando...
                </span>
              ) : (
                "Aplicar"
              )}
            </button>
          </div>

          {/* Mensaje de error visual */}
          {errorMessage && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-2">
              <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-400">{errorMessage}</p>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-gray-500 mt-2">
        ¿No tienes un cupón?{" "}
        <a href="/promociones" className="text-purple-400 hover:text-purple-300 transition-colors">
          Ver promociones disponibles
        </a>
      </p>
    </div>
  );
}