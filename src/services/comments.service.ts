export interface Comment {
    id?: string;
    name: string;
    role: string;
    content: string;
    rating: number;
    image: string;
    eventImage?: string;
    verified?: boolean;
    event?: string;
    createdAt?: string;
}

// Configuración del Endpoint
// ---------------------------------------------------------
// Ahora apuntamos directamente al Backend NestJS para evitar usar 'fs' en Vercel
const API_URL = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/comments`;
// ---------------------------------------------------------

export const getComments = async (): Promise<Comment[]> => {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error("Error al obtener los comentarios");
    }
    return response.json();
};

export const createComment = async (comment: Comment): Promise<Comment> => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(comment),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Error desconocido al contactar el servidor" }));
        throw new Error(errorData.error || "Error al crear el comentario");
    }
    return response.json();
};
