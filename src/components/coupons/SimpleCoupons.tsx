"use client";

import { useState, useEffect } from "react";
import { Tag, TrendingDown, Sparkles, Copy, Check, Gift } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface SimpleCoupon {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  isActive: boolean;
  maxRedemptions: number;
  events?: Array<{ id: string; title: string }>;
  categories?: Array<{ id: string; name: string }>;
}

interface SimpleCouponsProps {
  onApplyCoupon?: (code: string) => void;
  showApplyButton?: boolean;
}

export default function SimpleCoupons({ 
  onApplyCoupon, 
  showApplyButton = true 
}: SimpleCouponsProps) {
  const [coupons, setCoupons] = useState<SimpleCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCoupons, setCopiedCoupons] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    // Generar o recuperar ID único del usuario
    let userIdFromStorage = localStorage.getItem('user_visual_id');
    if (!userIdFromStorage) {
      userIdFromStorage = generateUserId();
      localStorage.setItem('user_visual_id', userIdFromStorage);
    }
    setUserId(userIdFromStorage);
    
    loadCoupons();
  }, []);

  const generateUserId = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const generateVisualId = (couponCode: string, userSeed: string) => {
    // Genera un ID único basado en el cupón + usuario
    const prefix = couponCode.substring(0, 3).toUpperCase();
    const hash = (couponCode + userSeed).split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    const uniqueId = Math.abs(hash).toString(36).substring(0, 4).toUpperCase();
    return `${prefix}-${uniqueId}`;
  };

  const getCouponName = (coupon: SimpleCoupon) => {
    // Generar nombre basado en el descuento
    if (coupon.type === 'PERCENT') {
      if (coupon.value >= 50) return `🔥 Super Descuento ${coupon.value}%`;
      if (coupon.value >= 30) return `⚡ Gran Descuento ${coupon.value}%`;
      return `💫 Descuento ${coupon.value}%`;
    } else {
      return `💰 Descuento $${coupon.value}`;
    }
  };

  const loadCoupons = async () => {
    try {
      const response = await fetch(`${API_URL}/coupons`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar cupones');
      }

      const data = await response.json();
      
      // Filtrar solo activos
      const activeCoupons = data.filter((c: SimpleCoupon) => c.isActive);
      setCoupons(activeCoupons);
    } catch (err: any) {
      console.error('Error loading coupons:', err);
      toast.error("Error al cargar cupones");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = (couponId: string, realCode: string, visualId: string) => {
    // Copiar el código REAL al portapapeles (pero no mostrarlo)
    navigator.clipboard.writeText(realCode);
    
    // Mostrar como copiado
    setCopiedCoupons(prev => new Set([...prev, couponId]));
    toast.success(`¡Código #${visualId} copiado!`, {
      description: 'Pégalo en el checkout para aplicar tu descuento',
    });
    
    // Resetear el estado de "copiado" después de 3 segundos
    setTimeout(() => {
      setCopiedCoupons(prev => {
        const newSet = new Set(prev);
        newSet.delete(couponId);
        return newSet;
      });
    }, 3000);

    // Callback opcional
    if (onApplyCoupon) {
      onApplyCoupon(realCode);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400">
        No hay cupones disponibles en este momento
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-xl font-bold text-white">Cupones Disponibles</h3>
        <span className="text-sm text-gray-400">({coupons.length})</span>
      </div>

      {/* Info de cupones personalizados */}
      <div className="bg-purple-600/10 border border-purple-500/20 rounded-lg p-4 mb-6">
        <p className="text-sm text-purple-300">
          ✨ Tus cupones personalizados están listos. Haz click para copiar y pégalos en el checkout.
        </p>
      </div>

      {/* Cupones Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => {
          const visualId = generateVisualId(coupon.code, userId);
          const isCopied = copiedCoupons.has(coupon.id);
          const couponName = getCouponName(coupon);

          return (
            <div
              key={coupon.id}
              className="relative rounded-xl bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20 p-5 hover:border-purple-500/40 transition-all group"
            >
              {/* Badge de ID único */}
              <div className="absolute top-3 right-3">
                <div className="bg-purple-600/20 border border-purple-500/30 rounded-full px-3 py-1">
                  <p className="text-xs font-mono font-bold text-purple-300">
                    #{visualId}
                  </p>
                </div>
              </div>

              {/* Header del cupón */}
              <div className="flex items-start gap-3 mb-4 pr-20">
                <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Gift className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-1">Cupón Exclusivo</p>
                  <p className="text-base font-bold text-white leading-tight">
                    {couponName}
                  </p>
                </div>
              </div>

              {/* Valor del descuento */}
              <div className="flex items-center gap-2 mb-4 bg-zinc-800/50 rounded-lg p-3">
                <TrendingDown className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-xs text-gray-400">Ahorras</p>
                  <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    {coupon.type === 'PERCENT' ? `${coupon.value}%` : `$${coupon.value}`}
                  </p>
                </div>
              </div>

              {/* Info de límites */}
              <div className="mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Tag className="w-3 h-3" />
                  <span>Límite: {coupon.maxRedemptions} usos totales</span>
                </div>
              </div>

              {/* Restricciones */}
              {(coupon.events && coupon.events.length > 0) || (coupon.categories && coupon.categories.length > 0) ? (
                <div className="mb-4 space-y-1">
                  {coupon.events && coupon.events.length > 0 && (
                    <p className="text-xs text-gray-400">
                      📍 {coupon.events.map(e => e.title).join(', ')}
                    </p>
                  )}
                  {coupon.categories && coupon.categories.length > 0 && (
                    <p className="text-xs text-gray-400">
                      🏷️ {coupon.categories.map(c => c.name).join(', ')}
                    </p>
                  )}
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-xs text-green-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Válido para todos los eventos
                  </p>
                </div>
              )}

              {/* Botón de copiar */}
              {showApplyButton && (
                <button
                  onClick={() => handleCopyCode(coupon.id, coupon.code, visualId)}
                  disabled={isCopied}
                  className={`w-full px-4 py-3 rounded-lg font-medium transition-all ${
                    isCopied
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group-hover:shadow-lg group-hover:shadow-purple-500/50'
                  }`}
                >
                  <span className="flex items-center justify-center gap-2">
                    {isCopied ? (
                      <>
                        <Check className="w-4 h-4" />
                        ¡Código copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copiar código
                      </>
                    )}
                  </span>
                </button>
              )}

              {isCopied && (
                <p className="text-xs text-center text-gray-400 mt-2">
                  Pégalo en el checkout 🎉
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer explicativo */}
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          💡 Cada cupón tiene un código único asignado a tu cuenta
        </p>
      </div>
    </div>
  );
}
