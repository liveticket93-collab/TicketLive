import { NextResponse } from "next/server";
import { getSubscribers } from "@/services/subscription.service";
import { getEvents } from "@/services/events.service";
import nodemailer from "nodemailer";

export const maxDuration = 60; // Allow longer execution for sending bulk emails

export async function GET(req: Request) {
    // 1. Verify Authentication
    const authHeader = req.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        // 2. Fetch Data
        const [subscribers, events] = await Promise.all([
            getSubscribers(),
            getEvents(),
        ]);

        if (subscribers.length === 0) {
            return NextResponse.json({ message: "No subscribers to email" });
        }

        // 3. Configure Transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS, // App Password
            },
        });

        // 4. Prepare Email Content
        const featuredEvents = events.slice(0, 3);
        const eventHtml = featuredEvents
            .map(
                (e) => `
      <div style="margin-bottom: 20px; border-bottom: 1px solid #444; padding-bottom: 20px;">
        <h3 style="color: #8B5CF6;">${e.title}</h3>
        <p>${e.description || "Evento exclusivo de TicketLive."}</p>
        <p><strong>Fecha:</strong> ${new Date(e.date).toLocaleDateString("es-CO")}</p>
        <p><strong>Precio:</strong> $${e.price}</p>
      </div>
    `
            )
            .join("");

        const emailTemplate = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #fff; padding: 20px; border-radius: 10px;">
        <h1 style="color: #8B5CF6; text-align: center;">TicketLive Weekly</h1>
        <p>Hola,</p>
        <p>Aquí tienes los eventos más destacados de esta semana. ¡No te quedes fuera!</p>
        
        <div style="background: #2a2a2a; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${eventHtml}
        </div>

        <p style="text-align: center; color: #888; font-size: 12px;">
            Estás recibiendo esto porque te suscribiste a TicketLive.
        </p>
      </div>
    `;

        // 5. Send Emails
        // Usamos BCC para privacidad y eficiencia
        await transporter.sendMail({
            from: `"TicketLive Hub" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Enviamos a nosotros mismos
            bcc: subscribers, // Copia oculta a todos los suscriptores
            subject: "📅 Eventos Destacados de la Semana",
            html: emailTemplate,
        });

        return NextResponse.json({
            success: true,
            message: `Newsletter sent to ${subscribers.length} subscribers`,
        });
    } catch (error) {
        console.error("Cron Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
