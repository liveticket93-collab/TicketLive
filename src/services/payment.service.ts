const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const checkoutPayment = async (): Promise<string> => {
  const res = await fetch(`${API_URL}/payment/checkout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "No se pudo iniciar el pago");
  }

  const data = await res.json();
  return data.url;
};
