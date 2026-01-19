import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();
        const coreMessages = await convertToModelMessages(messages);

        const result = await streamText({
            model: groq("llama-3.3-70b-versatile"),
            messages: coreMessages,
            system: `
Sos el asistente oficial de TicketLive.
Respondé de forma clara, profesional y amigable.
Usá Markdown cuando ayude a la lectura.
Si no sabés algo, decilo con honestidad.
      `.trim(),
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error("[CHAT_ERROR]", error);

        return new Response(
            JSON.stringify({
                error: error instanceof Error ? error.message : "Unknown error",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
