import { NextResponse } from "next/server";
import { sendWeeklyNewsletter } from "@/lib/newsletter";

// NOTA: En un caso real, aquí verificarías la sesión del usuario (cookie) para ver si es ADMIN.
// Por simplicidad para la demo y evitar problemas de headers, lo dejamos abierto o confiamos en el Frontend.
export async function POST(req: Request) {
    try {
        const result = await sendWeeklyNewsletter();

        if (!result.success) {
            return NextResponse.json({ message: result.message }, { status: 200 });
        }

        return NextResponse.json({
            success: true,
            message: `Newsletter enviado a ${result.recipientCount} suscriptores.`
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Error enviando newsletter", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}
