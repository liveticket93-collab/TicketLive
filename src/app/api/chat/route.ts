import { groq } from "@ai-sdk/groq";
import { streamText, convertToModelMessages, tool, stepCountIs } from "ai";
import { z } from "zod";
import { getEvents, getEventCategories, dateFormatter } from "@/services/events.service";

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
Usá Markdown para estructurar tu respuesta.
IMPORTANTE: Siempre usá títulos (## o ###) para los nombres de los eventos y negrita (**) para datos clave como precios o fechas.
Si no sabés algo, decilo con honestidad.
Tenés acceso a herramientas para consultar eventos reales y categorías. Úsalas cuando el usuario pregunte por eventos, fechas, precios o disponibilidad.
      `.trim(),
            stopWhen: stepCountIs(5),
            tools: {
                getEvents: tool({
                    description: "Obtener la lista de todos los eventos disponibles, incluyendo título, fecha, precio y ubicación.",
                    inputSchema: z.object({}),
                    execute: async () => {
                        console.log("Executing getEvents tool...");
                        try {
                            const [events, categories] = await Promise.all([
                                getEvents(),
                                getEventCategories()
                            ]);
                            console.log(`Fetched ${events.length} events and ${categories.length} categories.`);

                            return events.map(e => ({
                                id: e.id,
                                title: e.title,
                                date: dateFormatter(e.date),
                                time: e.start_time,
                                location: e.location,
                                price: `$${e.price}`,
                                category: categories.find(c => c.id === e.categoryId)?.name || e.categoryId
                            }));
                        } catch (error) {
                            console.error("Error in getEvents tool:", error);
                            throw error;
                        }
                    },
                }),
                getCategories: tool({
                    description: "Obtener las categorías de eventos disponibles.",
                    inputSchema: z.object({}),
                    execute: async () => await getEventCategories(),
                }),
            },
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
