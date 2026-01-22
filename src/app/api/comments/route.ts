import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// PASO 2: ELIMINAR ESTE ARCHIVO
// Una vez que el backend real esté funcionando y hayas actualizado src/services/comments.service.ts,
// debes BORRAR este archivo (src/app/api/comments/route.ts) y la carpeta src/data entera.
// Este código es solo una simulación temporal.

const dataFilePath = path.join(process.cwd(), "src", "data", "comments.json");

// Helper para leer comentarios
const getComments = () => {
    if (!fs.existsSync(dataFilePath)) {
        return [];
    }
    const fileContent = fs.readFileSync(dataFilePath, "utf8");
    try {
        return JSON.parse(fileContent);
    } catch (error) {
        return [];
    }
};

// Helper para guardar comentarios
const saveComments = (comments: any[]) => {
    fs.writeFileSync(dataFilePath, JSON.stringify(comments, null, 2), "utf8");
};

export async function GET() {
    try {
        const comments = getComments();
        return NextResponse.json(comments);
    } catch (error) {
        return NextResponse.json({ error: "Error al obtener los comentarios" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, content, rating, image, eventImage, verified, event } = body;

        if (!name || !content || !rating) {
            return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
        }

        const newComment = {
            id: Date.now().toString(),
            name,
            role: role || "Usuario",
            content,
            rating,
            image, // Avatar del usuario
            eventImage, // Foto del evento (Base64)
            verified: verified || false,
            event: event || "Evento General",
            createdAt: new Date().toISOString(),
        };

        const comments = getComments();
        comments.push(newComment);
        saveComments(comments);

        return NextResponse.json(newComment, { status: 201 });
    } catch (error) {
        console.error("Error detallado al guardar comentario:", error);
        return NextResponse.json(
            { error: "Error al guardar el comentario: " + (error instanceof Error ? error.message : String(error)) },
            { status: 500 }
        );
    }
}
