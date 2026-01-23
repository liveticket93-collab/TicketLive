import { NextResponse } from "next/server";
import { subscribe } from "@/services/subscription.service";
import * as z from "zod";

const emailSchema = z.string().email();

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        const validation = emailSchema.safeParse(email);
        if (!validation.success) {
            return NextResponse.json({ error: "Email inválido" }, { status: 400 });
        }

        await subscribe(email);

        return NextResponse.json({ success: true, message: "Suscrito exitosamente" });
    } catch (error: any) {
        console.error("Error en suscripción:", error);

        // Identificar error de conexión (cuando el backend no está corriendo)
        if (error.cause?.code === 'ECONNREFUSED' || error.message.includes('fetch failed')) {
            return NextResponse.json(
                {
                    error: "No se pudo contactar al servidor Backend",
                    details: "Asegúrate de que tu backend (NestJS) esté corriendo en el puerto 3000."
                },
                { status: 503 } // Service Unavailable
            );
        }

        return NextResponse.json(
            { error: "Error interno del servidor", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
