const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

/**
 * Obtener el carrito activo del usuario
 */
export const getActiveCart = async () => {
  const response = await fetch(`${API_URL}/cart`, {
    method: "GET",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Error al obtener carrito");
  }

  return response.json();
};

/**
 * Obtener el carrito (alias de getActiveCart para compatibilidad)
 */
export const getCart = async () => {
  return getActiveCart();
};

/**
 * Agregar item al carrito
 */
export const addItemToCart = async (eventId: string, quantity: number = 1) => {
  const response = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ eventId, quantity }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al agregar al carrito");
  }

  return response.json();
};

/**
 * Remover item del carrito
 */
export const removeCartItem = async (itemId: string) => {
  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al eliminar item");
  }

  return response.json();
};

/**
 * Limpiar todo el carrito
 */
export const clearCartBackend = async () => {
  const response = await fetch(`${API_URL}/cart/clear`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al limpiar carrito");
  }

  return response.json();
};

/**
 * Actualizar cantidad de un item
 */
export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  const response = await fetch(`${API_URL}/cart/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Error al actualizar cantidad");
  }

  return response.json();
};