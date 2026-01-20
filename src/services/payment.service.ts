const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Procesar pago en Mercado Pago
 * El backend buscará el cupón usando cart.id automáticamente
 */
export const checkoutPayment = async (): Promise<string> => {
  const response = await fetch(`${API_URL}/payment/checkout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    // No enviamos cartId, el backend usa cart.id directamente
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No se pudo iniciar el pago");
  }

  const data = await response.json();
  return data.url;
};