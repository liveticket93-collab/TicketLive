"use client";

import { useState, useEffect } from "react";
import { Tag, Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface SimpleCoupon {
  id: string;
  code: string;
  type: 'PERCENT' | 'FIXED';
  value: number;
  isActive: boolean;
  maxRedemptions: number;
}

interface SimpleCheckoutCouponsProps {
  onSelectCoupon: (code: string) => void;
  selectedCode?: string;
}

export default function SimpleCheckoutCoupons({ 
  onSelectCoupon, 
  selectedCode 
}: SimpleCheckoutCouponsProps) {
  const [coupons, setCoupons] = useState<SimpleCoupon[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && coupons.length === 0) {
      loadCoupons();
    }
  }, [isOpen]);

  const loadCoupons = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/coupons`, {
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        const activeCoupons = data.filter((c: SimpleCoupon) => c.isActive);
        setCoupons(activeCoupons);
      }
    } catch (err) {
      console.error('Error loading coupons:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl bg-zinc-900/50 border border-purple-500/20 overflow-hidden">
      {/* Header - Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-white">
            Ver cupones disponibles {coupons.length > 0 && `(${coupons.length})`}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Lista de cupones */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : coupons.length === 0 ? (
            <p className="text-center py-4 text-sm text-gray-400">
              No hay cupones disponibles
            </p>
          ) : (
            coupons.map((coupon) => (
              <button
                key={coupon.id}
                onClick={() => {
                  onSelectCoupon(coupon.code);
                  setIsOpen(false);
                }}
                className={`w-full p-3 rounded-lg border transition-all text-left ${
                  selectedCode === coupon.code
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-zinc-700 hover:border-purple-500/50 bg-zinc-800/50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3 h-3 text-purple-400" />
                    <span className="text-sm font-bold text-white font-mono">
                      {coupon.code}
                    </span>
                  </div>
                  <span className="text-lg font-bold text-purple-400">
                    {coupon.type === 'PERCENT' ? `${coupon.value}%` : `$${coupon.value}`}
                  </span>
                </div>
                <p className="text-xs text-gray-400">
                  Límite: {coupon.maxRedemptions} usos
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}