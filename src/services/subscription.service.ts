import { ISubscriber } from "@/interfaces/subscriber.interface"; // Asumiendo que crearás o ya tienes esta interfaz, si no, defínela aquí



export const subscribe = async (email: string): Promise<void> => {
    // ---------------------------------------------------------
    // CONFIGURACIÓN DEL BACKEND
    // ---------------------------------------------------------
    // Reemplaza 'http://localhost:4000' con la URL real de tu backend
    // Reemplaza '/api/subscribers' con tu endpoint específico
    const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';
    const ENDPOINT = `${BACKEND_URL}/api/subscribers`;

    const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ...' // Si tu backend requiere auth
        },
        body: JSON.stringify({ email }),
    });

    if (!res.ok) {
        // Manejo de errores básicos
        if (res.status === 409) {
            // Opcional: El usuario ya existe, no lanzamos error o sí, depende de tu lógica
            console.log("El usuario ya está suscrito");
            return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al suscribirse en el servidor externo');
    }
};

export const getSubscribers = async (): Promise<string[]> => {
    // ---------------------------------------------------------
    // CONFIGURACIÓN DEL BACKEND
    // ---------------------------------------------------------
    const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:4000';
    const ENDPOINT = `${BACKEND_URL}/api/subscribers`;

    const res = await fetch(ENDPOINT, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer ...' // Probablemente necesites una API Key para este endpoint administrativo
        },
    });

    if (!res.ok) {
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

