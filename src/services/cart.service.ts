const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const res = await fetch(`${API_URL}${url}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error en carrito");
  }

  return res.json();
};

export const getCart = () => fetchWithAuth("/cart");

export const addItemToCart = (eventId: string, quantity = 1) =>
  fetchWithAuth("/cart/items", {
    method: "POST",
    body: JSON.stringify({ eventId, quantity }),
  });

export const removeCartItem = (cartItemId: string) =>
  fetchWithAuth(`/cart/items/${cartItemId}`, {
    method: "DELETE",
  });

export const clearCartBackend = () =>
  fetchWithAuth("/cart", { method: "DELETE" });
