import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import * as z from "zod";

const contactSchema = z.object({
    name: z.string().min(2, "El nombre es muy corto"),
    email: z.string().email("Email inválido"),
    subject: z.string().min(3, "El asunto es muy corto"),
    message: z.string().min(10, "El mensaje es muy corto"),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const result = contactSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Datos inválidos", details: result.error.errors },
                { status: 400 }
            );
        }

        const { name, email, subject, message } = result.data;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        // Email para el administrador (TicketLive)
        await transporter.sendMail({
            from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
            to: "ticketlive38@gmail.com", // El email que pidió el usuario
            replyTo: email, // Para responderle directo al usuario
            subject: `[Contacto Web] ${subject}`,
            html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #8B5CF6;">Nuevo Mensaje de Contacto</h2>
          <p><strong>De:</strong> ${name} (${email})</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <div style="background: #f4f4f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="white-space: pre-wrap; margin: 0;">${message}</p>
          </div>
          <p style="font-size: 12px; color: #888;">Enviado desde ticketlive.com</p>
        </div>
      `,
        });

        return NextResponse.json({ success: true, message: "Mensaje enviado" });
    } catch (error) {
        console.error("Contact API Error:", error);
        return NextResponse.json(
            { error: "Error al enviar el mensaje" },
            { status: 500 }
        );
    }
}
