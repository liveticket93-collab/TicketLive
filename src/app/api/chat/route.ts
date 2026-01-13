import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Validate OpenAI API Key
if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured in environment variables');
}

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Force dynamic to ensure fresh data if we add logic later
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        // Validate request body
        let body;
        try {
            body = await req.json();
        } catch {
            return new Response(
                JSON.stringify({ error: 'Invalid JSON in request body' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        const { messages } = body;

        // Validate messages array
        if (!messages || !Array.isArray(messages)) {
            return new Response(
                JSON.stringify({ error: 'Messages must be an array' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // System prompt configuration
        const systemMessage: OpenAI.Chat.ChatCompletionSystemMessageParam = {
            role: 'system',
            content: `Eres el asistente oficial de TicketLive. 
Tu objetivo es ayudar a los usuarios a encontrar eventos, conciertos y festivales.
Sé amable, servicial y utiliza un tono moderno y profesional.
Por ahora, si te preguntan por eventos específicos que no conoces, diles que no puedes consultar la base de datos en tiempo real en este momento, pero que pueden buscar en la página principal.`,
        };

        // Filter out any existing system messages and prepend our system message
        const conversationMessages = messages.filter((m: OpenAI.Chat.ChatCompletionMessageParam) => m.role !== 'system');
        const allMessages = [systemMessage, ...conversationMessages];

        // API Call to OpenAI
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            stream: true,
            messages: allMessages,
        });

        // Convert the response into a friendly text-stream
        // Type assertion needed due to OpenAI SDK response type compatibility
        const stream = OpenAIStream(response as Parameters<typeof OpenAIStream>[0]);

        // Respond with the stream
        return new StreamingTextResponse(stream);
    } catch (error) {
        console.error('Error in chat route:', error);
        
        // Improved error handling with specific error types
        let errorMessage = 'Error al procesar tu solicitud';
        let statusCode = 500;
        
        if (error instanceof Error) {
            if (error.message.includes('API key') || error.message.includes('authentication')) {
                errorMessage = 'Error de configuración del servidor. Por favor contacta al soporte.';
                statusCode = 500;
            } else if (error.message.includes('rate limit')) {
                errorMessage = 'Demasiadas solicitudes. Por favor intenta más tarde.';
                statusCode = 429;
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = 'Error de conexión. Por favor verifica tu internet.';
                statusCode = 503;
            } else {
                errorMessage = error.message;
            }
        }
        
        return new Response(
            JSON.stringify({ 
                error: errorMessage,
                type: 'chat_error'
            }),
            { 
                status: statusCode,
                headers: { 'Content-Type': 'application/json' } 
            }
        );
    }
}
