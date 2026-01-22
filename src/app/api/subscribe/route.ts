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
    } catch (error) {
        console.error("Error en suscripción:", error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
