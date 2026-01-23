import { ISubscriber } from "@/interfaces/subscriber.interface";
import { includes } from "zod/v4";

// ---------------------------------------------------------
// CONFIGURACIÓN DEL BACKEND
// ---------------------------------------------------------
// Reemplaza 'http://localhost:4000' con la URL real de tu backend
// Reemplaza '/api/subscribers' con tu endpoint específico
const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3000';
const ENDPOINT = `${BACKEND_URL}/api/subscribers`;

export const subscribe = async (email: string): Promise<void> => {
    try {
        const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': 'Bearer ...' // Si tu backend requiere auth
            },
            credentials: "include",
            body: JSON.stringify({ email }),
        });

        if (!res.ok) {
            console.error(`Backend Error: ${res.status} ${res.statusText}`);
            // Manejo de errores básicos
            if (res.status === 409) {
                // Opcional: El usuario ya existe, no lanzamos error o sí, depende de tu lógica
                console.log("El usuario ya está suscrito");
                return;
            }
            const errorData = await res.json().catch(() => ({}));
            console.error('Backend Error Body:', errorData);
            throw new Error(errorData.message || 'Error al suscribirse en el servidor externo');
        }
    } catch (error) {
        console.error("Fetch Error in subscribe service:", error);
        throw error;
    }
};

export const getSubscribers = async (): Promise<string[]> => {
    const res = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!res.ok) {
        console.error(`GetSubscribers Error: ${res.status} ${res.statusText}`);
        throw new Error('Error al obtener suscriptores del servidor externo');
    }

    // Asumimos que el backend devuelve un array de objetos o strings.
    // Ajusta esto según la respuesta real de tu backend.
    // Ejemplo respuesta backend: [{ email: "a@a.com" }, { email: "b@b.com" }]
    const data = await res.json();

    // Si la API devuelve objetos, mapeamos a strings
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        return data.map((s: any) => s.email);
    }

    // Si ya devuelve strings
    return data;
};


