import { Coupon, CreateCouponDto } from "@/interfaces/coupon.interface";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Obtener todos los cupones (Admin)
 */
export async function getAllCoupons(): Promise<Coupon[]> {
  const response = await fetch(`${API_URL}/coupons`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al obtener cupones");
  }

  return response.json();
}

/**
 * Crear cupón (Admin)
 */
export async function createCoupon(data: CreateCouponDto): Promise<Coupon> {
  const response = await fetch(`${API_URL}/coupons`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al crear cupón");
  }

  return response.json();
}

/**
 * Reclamar cupón (Usuario)
 */
export async function claimCoupon(code: string, cartId: string) {
  const response = await fetch(`${API_URL}/coupons/claim`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ code, cartId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al reclamar cupón");
  }

  return response.json();
}

/**
 * Confirmar uso de cupón (Usuario)
 */
export async function confirmCoupon(cartId: string) {
  const response = await fetch(`${API_URL}/coupons/confirm`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ cartId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al confirmar cupón");
  }

  return response.json();
}