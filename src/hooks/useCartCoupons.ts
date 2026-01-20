"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { claimCoupon, confirmCoupon } from "@/services/coupon.service";
import { getActiveCart } from "@/services/cart.service";
import { Coupon, CouponType } from "@/interfaces/coupon.interface";

interface AppliedCoupon {
  coupon: Coupon;
  cartId: string;
}

/**
 * Hook para manejar cupones en el carrito
 * Adaptado para usar cart.id del backend
 */
export function useCartCoupons() {
  const { isLoggedIn } = useAuth();
  const { cartItems, getTotal } = useCart();
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const previousLoginStatus = useRef<boolean | null>(null);

  // Cargar cupón guardado al montar
  useEffect(() => {
    const loadCoupon = () => {
      const storedCoupon = localStorage.getItem("appliedCoupon");
      if (storedCoupon) {
        try {
          const parsed = JSON.parse(storedCoupon);
          setAppliedCoupon(parsed);
        } catch (error) {
          localStorage.removeItem("appliedCoupon");
          setAppliedCoupon(null);
        }
      }
    };

    loadCoupon();

    // Revisar cada 500ms por cambios
    const interval = setInterval(loadCoupon, 500);

    return () => clearInterval(interval);
  }, []);

  // Limpiar cupón SOLO al hacer logout (no al inicializar)
  useEffect(() => {
    if (previousLoginStatus.current === null) {
      previousLoginStatus.current = isLoggedIn;
      return;
    }

    if (previousLoginStatus.current === true && isLoggedIn === false) {
      setAppliedCoupon(null);
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("pendingCoupon");
    }

    previousLoginStatus.current = isLoggedIn;
  }, [isLoggedIn]);

  // Aplicar cupón pendiente cuando se agregan productos al carrito
  useEffect(() => {
    const applyPendingCoupon = async () => {
      const pendingCode = localStorage.getItem("pendingCoupon");
      
      if (pendingCode && cartItems.length > 0 && !appliedCoupon) {
        try {
          // ⭐ Obtener cart.id real del backend
          const cart = await getActiveCart();
          const cartId = cart.id;

          // Reclamar cupón con cart.id real
          const response = await claimCoupon(pendingCode, cartId);

          const newCoupon = {
            coupon: response.coupon,
            cartId: cartId,
          };

          setAppliedCoupon(newCoupon);
          localStorage.setItem("appliedCoupon", JSON.stringify(newCoupon));

          localStorage.removeItem("pendingCoupon");

          toast.success(`¡Cupón ${pendingCode} aplicado automáticamente!`);
        } catch (error: any) {
          localStorage.removeItem("pendingCoupon");
        }
      }
    };

    applyPendingCoupon();
  }, [cartItems.length, appliedCoupon]);

  // Aplicar cupón
  const applyCoupon = useCallback(async (code: string): Promise<boolean> => {
    if (!isLoggedIn) {
      toast.error("Debes estar logueado para usar cupones");
      return false;
    }

    // Si el carrito está vacío, guardar cupón como pendiente
    if (cartItems.length === 0) {
      localStorage.setItem("pendingCoupon", code);
      toast.success(`Cupón ${code} guardado. Agrega productos al carrito para aplicarlo.`);
      return true;
    }

    try {
      // ⭐ Obtener cart.id real del backend
      const cart = await getActiveCart();
      const cartId = cart.id;

      // Reclamar cupón con cart.id real
      const response = await claimCoupon(code, cartId);

      const newCoupon = {
        coupon: response.coupon,
        cartId: cartId,
      };

      setAppliedCoupon(newCoupon);
      localStorage.setItem("appliedCoupon", JSON.stringify(newCoupon));

      window.dispatchEvent(new Event('storage'));

      localStorage.removeItem("pendingCoupon");

      toast.success(`¡Cupón ${code} aplicado!`);
      return true;
    } catch (error: any) {
      const errorMessage = error.message || "Error al aplicar cupón";
      
      if (errorMessage.toLowerCase().includes("ya usaste") || 
          errorMessage.toLowerCase().includes("ya activaste")) {
        toast.error(`🚫 Ya usaste el cupón ${code}. Cada cupón solo puede usarse una vez por usuario.`, {
          duration: 5000,
        });
      } else if (errorMessage.toLowerCase().includes("no existe") || 
                 errorMessage.toLowerCase().includes("not found")) {
        toast.error(`❌ El cupón ${code} no existe. Verifica el código e intenta nuevamente.`);
      } else if (errorMessage.toLowerCase().includes("agotado") || 
                 errorMessage.toLowerCase().includes("máximo")) {
        toast.error(`⏰ El cupón ${code} ya alcanzó su límite de usos.`);
      } else if (errorMessage.toLowerCase().includes("inactivo") || 
                 errorMessage.toLowerCase().includes("desactivado")) {
        toast.error(`⏸️ El cupón ${code} no está activo actualmente.`);
      } else {
        toast.error(`❌ ${errorMessage}`);
      }
      
      return false;
    }
  }, [isLoggedIn, cartItems]);

  // Remover cupón
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    localStorage.removeItem("appliedCoupon");
    toast.info("Cupón removido");
  }, []);

  // Calcular descuento
  const getDiscount = useCallback(() => {
    if (!appliedCoupon) return 0;

    const total = getTotal();
    const coupon = appliedCoupon.coupon;

    if (coupon.type === CouponType.PERCENT) {
      const discount = Math.floor((total * coupon.value) / 100);
      return Math.max(0, Math.min(discount, total));
    } else {
      return Math.max(0, Math.min(coupon.value, total));
    }
  }, [appliedCoupon, getTotal]);

  // Total con descuento
  const getTotalWithDiscount = useCallback(() => {
    return Math.max(0, getTotal() - getDiscount());
  }, [getTotal, getDiscount]);

  // Confirmar uso del cupón
  const confirmCouponUsage = useCallback(async () => {
    if (!appliedCoupon) return;

    try {
      await confirmCoupon(appliedCoupon.cartId);
    } catch (error) {
      console.error("Error confirming coupon:", error);
    }
  }, [appliedCoupon]);

  return {
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    getDiscount,
    getTotalWithDiscount,
    confirmCouponUsage,
  };
}