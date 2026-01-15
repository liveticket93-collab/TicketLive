import { z } from "zod";
import { tool } from "ai";

// ============================================================================
// CONFIGURACIÓN
// ============================================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// ============================================================================
// UTILIDADES (HELPERS)
// ============================================================================

/**
 * Helper para manejar IDs que pueden ser números o UUIDs (strings).
 */
function safeParseId(value: string | number | undefined): string | number | undefined {
    if (value === undefined || value === null) return undefined;
    // Si es un número, devolverlo tal cual
    if (typeof value === 'number') return value;
    // Si es un string que parece número (y no UUID), intentar convertir
    const isNumeric = /^\d+$/.test(value);
    if (isNumeric) {
        return parseInt(value, 10);
    }
    // Si es UUID o string, devolver string
    return value;
}

/**
 * Helper seguro para convertir entradas a número.
 */
function safeParseInt(value: string | number | undefined, defaultValue = 0): number {
    if (value === undefined || value === null) return defaultValue;
    if (typeof value === 'number') return value;
    const parsed = parseInt(value, 10);
    return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Fetch wrapper para manejar errores y timeouts comunes.
 */
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
    try {
        const url = `${API_URL}${endpoint}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        // Manejo básico de errores HTTP
        if (!response.ok) {
            // Intentar leer el error del body
            const errorText = await response.text();
            let errorMessage = `Error ${response.status}: ${response.statusText}`;
            try {
                const json = JSON.parse(errorText);
                if (json.message) errorMessage = json.message;
                else if (json.error) errorMessage = json.error;
            } catch (e) { /* ignore json parse error */ }

            throw new Error(errorMessage);
        }

        // Si es 204 No Content
        if (response.status === 204) return null;

        return await response.json();
    } catch (error: any) {
        console.error(`[Chatbot Tool Error] ${endpoint}:`, error);
        return { error: error.message || "Error de conexión con el servidor." };
    }
}

// ============================================================================
// SCHEMAS (Robustos para LLMs)
// Definimos los tipos como Union(String, Number) para evitar errores de validación
// si el LLM alucina el tipo de dato.
// ============================================================================

const flexibleId = z.union([z.string(), z.number()]).describe("ID numérico (puede venir como string o number)");
const flexibleNumber = z.union([z.string(), z.number()]).describe("Número (puede venir como string o number)");

const searchEventsSchema = z.object({
    category: z.string().optional().describe("Filtro: Nombre de la categoría (ej: 'Conciertos')."),
    title: z.string().optional().describe("Filtro: Título del evento."),
    location: z.string().optional().describe("Filtro: Ubicación."),
    limit: flexibleNumber.optional().default(10).describe("Límite de resultados."),
});

const getDetailsSchema = z.object({
    eventId: flexibleId.describe("ID del evento."),
});

const addToCartSchema = z.object({
    eventId: flexibleId.describe("ID del evento a agregar."),
    quantity: flexibleNumber.optional().default(1).describe("Cantidad de entradas."),
});

const removeFromCartSchema = z.object({
    eventId: flexibleId.describe("ID del evento a remover."),
});

// ============================================================================
// FÁBRICA DE HERRAMIENTAS (TOOL FACTORY)
// ============================================================================

export const createChatbotTools = (cookieHeader: string) => {

    // Header de autenticación para pasar la sesión del usuario
    const authHeaders = {
        'Cookie': cookieHeader
    };

    return {
        // --- BÚSQUEDA ---
        searchEvents: tool({
            description: "Buscar eventos por nombre, categoría o ubicación.",
            parameters: searchEventsSchema,
            execute: async (params) => {
                const query = new URLSearchParams();
                if (params.category) query.append('category', params.category);
                if (params.title) query.append('title', params.title);
                if (params.location) query.append('location', params.location);
                // No enviamos limit al backend si no lo soporta, o lo manejamos post-fetch

                const data = await fetchAPI(`/events?${query.toString()}`);
                if (data.error) return JSON.stringify(data);

                // Limitar resultados manualmente si la API no lo hace
                const limit = safeParseInt(params.limit, 10);
                const results = Array.isArray(data) ? data.slice(0, limit) : data;

                return JSON.stringify({
                    success: true,
                    count: results.length,
                    events: results.map((e: any) => ({
                        id: e.id,
                        title: e.title,
                        date: e.date,
                        location: e.location,
                        price: e.price,
                        available: e.availableTickets !== undefined ? e.availableTickets > 0 : (e.status === true)
                    }))
                });
            },
        }),

        // --- DETALLES ---
        getEventDetails: tool({
            description: "Ver detalle de un evento específico.",
            parameters: getDetailsSchema,
            execute: async ({ eventId }) => {
                const id = safeParseId(eventId);
                const data = await fetchAPI(`/events/${id}`);
                return JSON.stringify(data);
            },
        }),

        // --- CATEGORÍAS ---
        getCategories: tool({
            description: "Listar categorías de eventos.",
            parameters: z.object({}).optional(),
            execute: async () => {
                const data = await fetchAPI('/categories');
                return JSON.stringify(data);
            },
        }),

        // --- CARRITO: VER ---
        getCart: tool({
            description: "Ver el contenido del carrito de compras.",
            parameters: z.object({}).optional(),
            execute: async () => {
                const data = await fetchAPI('/cart', { headers: authHeaders });
                return JSON.stringify(data);
            },
        }),

        // --- CARRITO: AGREGAR ---
        addToCart: tool({
            description: "Agregar entradas al carrito.",
            parameters: addToCartSchema,
            execute: async ({ eventId, quantity }) => {
                const id = safeParseId(eventId);
                const qty = safeParseInt(quantity, 1);

                const data = await fetchAPI('/cart/items', {
                    method: 'POST',
                    headers: authHeaders,
                    body: JSON.stringify({ eventId: id, quantity: qty })
                });

                return JSON.stringify({
                    success: !data.error,
                    action: 'addToCart',
                    message: data.error ? "Error al agregar" : "Agregado correctamente",
                    details: data
                });
            },
        }),

        // --- CARRITO: ELIMINAR ---
        removeFromCart: tool({
            description: "Eliminar un evento del carrito.",
            parameters: removeFromCartSchema,
            execute: async ({ eventId }) => {
                const eId = safeParseId(eventId);

                // 1. Obtener carrito para encontrar el cartItemId
                const cart = await fetchAPI('/cart', { headers: authHeaders });
                if (cart.error || !cart.items) return JSON.stringify({ error: "No se pudo leer el carrito para eliminar." });

                const item = cart.items.find((i: any) => i.eventId === eId || i.event?.id === eId);

                if (!item) {
                    return JSON.stringify({ error: `El evento con ID ${eId} no está en el carrito.` });
                }

                // 2. Eliminar usando cartItemId
                const result = await fetchAPI(`/cart/items/${item.id}`, {
                    method: 'DELETE',
                    headers: authHeaders
                });

                return JSON.stringify({
                    success: !result?.error,
                    action: 'removeFromCart',
                    message: "Eliminado del carrito"
                });
            },
        }),
    };
};
