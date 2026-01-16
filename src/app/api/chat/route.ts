import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { createChatbotTools } from '@/lib/chatbot-tools'; // Import factory function
import { cookies } from 'next/headers'; // Import cookies

// Forzar dinámico para asegurar datos frescos
export const dynamic = 'force-dynamic';
// Usando Gemini 2.0 Flash - Último modelo optimizado para eficiencia y rendimiento

// Función para generar respuesta mock en desarrollo
// Simula el formato de stream del AI SDK: "0:" seguido de JSON con el texto incremental
// Función para generar respuesta mock en desarrollo
// Función para generar respuesta mock en desarrollo
function createMockResponse(userMessage: string, isLoggedIn: boolean): ReadableStream {
    const lowerMessage = userMessage.toLowerCase();
    const encoder = new TextEncoder();

    return new ReadableStream({
        async start(controller) {
            const sendText = (text: string) => {
                controller.enqueue(encoder.encode(`0:${JSON.stringify(text)}\n`));
            };
            const sendToolCall = (id: string, name: string, args: any) => {
                controller.enqueue(encoder.encode(`9:${JSON.stringify({ toolCallId: id, toolName: name, args })}\n`));
            };
            const sendToolResult = (id: string, result: any) => {
                controller.enqueue(encoder.encode(`a:${JSON.stringify({ toolCallId: id, result: JSON.stringify(result) })}\n`));
            };

            try {
                // 1. Saludos
                if (lowerMessage.match(/\b(hola|buen|buenas|hi|hello)\b/)) {
                    sendText("¡Hola! Soy tu asistente virtual de TicketLive. ¿Buscas algún evento en especial o quieres ver tu carrito?");
                }
                // 2. Búsqueda de eventos
                else if (lowerMessage.match(/\b(concierto|evento|show|teatro|deporte|partido|entradas|tickets)\b/) || lowerMessage.includes('buscar')) {
                    // Intento muy básico de extraer el término de búsqueda
                    let searchTerm = 'evento';
                    if (lowerMessage.includes('rock')) searchTerm = 'rock';
                    else if (lowerMessage.includes('pop')) searchTerm = 'pop';
                    else if (lowerMessage.includes('teatro')) searchTerm = 'teatro';

                    const toolId = `call_${Date.now()}`;
                    sendToolCall(toolId, 'searchEvents', { title: searchTerm });

                    await new Promise(r => setTimeout(r, 1000));

                    const mockEvents = [
                        { id: 101, title: 'Festival de Rock 2024', price: 150, location: 'Estadio Nacional', date: '2024-11-20' },
                        { id: 102, title: 'Orquesta Sinfónica', price: 80, location: 'Teatro Municipal', date: '2024-12-05' }
                    ];

                    sendToolResult(toolId, {
                        success: true,
                        count: 2,
                        events: mockEvents
                    });

                    sendText(`He encontrado algunos eventos que podrían interesarte. El "Festival de Rock" se ve genial. ¿Quieres más detalles?`);
                }
                // 3. Agregar al carrito
                else if (lowerMessage.match(/\b(agreg[aá]r?|añad[ií]r?|comprar?|quiero ir)\b/)) {
                    if (!isLoggedIn) {
                        sendText("Para comprar entradas, necesitas iniciar sesión primero. ¿Tienes cuenta?");
                    } else {
                        const toolId = `call_${Date.now()}`;
                        sendToolCall(toolId, 'addToCart', { eventId: 101, quantity: 1 });

                        await new Promise(r => setTimeout(r, 1000));

                        sendToolResult(toolId, {
                            success: true,
                            action: 'addToCart',
                            event: { id: 101, title: 'Festival de Rock 2024', price: 150 },
                            quantity: 1,
                            message: "Entrada agregada al carrito exitosamente."
                        });

                        sendText("¡Listo! He agregado una entrada para el Festival de Rock a tu carrito.");
                    }
                }
                // 4. Ver carrito
                else if (lowerMessage.match(/\b(carrito|cesta|mis compras)\b/) && !lowerMessage.match(/\b(agreg[aá]r?|añad[ií]r?)\b/)) {
                    if (!isLoggedIn) {
                        sendText("Inicia sesión para ver tu carrito.");
                    } else {
                        const toolId = `call_${Date.now()}`;
                        sendToolCall(toolId, 'getCart', {});
                        await new Promise(r => setTimeout(r, 800));
                        sendToolResult(toolId, {
                            success: true,
                            cart: { items: [{ id: 'item_1', eventId: 101, quantity: 1, event: { title: 'Festival de Rock 2024', price: 150 } }] }
                        });
                        sendText("Tienes una entrada para el Festival de Rock en tu carrito.");
                    }
                }
                // Default
                else {
                    sendText("Entiendo. Puedes preguntarme por eventos, buscar conciertos, o gestionar tu carrito de compras.");
                }
            } catch (e) {
                console.error("Error en Mock", e);
                sendText("Lo siento, tuve un error interno simulado.");
            } finally {
                controller.enqueue(encoder.encode(`d:{"finishReason":"stop"}\n`));
                controller.close();
            }
        }
    });
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { messages, isLoggedIn } = body;

        // Validar que messages sea un array
        if (!Array.isArray(messages)) {
            return new Response(
                JSON.stringify({
                    error: 'Formato de mensajes inválido. Se espera un array de mensajes.',
                    type: 'validation_error'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // MODO MOCK: Activo en desarrollo cuando:
        // 1. USE_CHAT_MOCK=true está configurado, O
        // 2. No hay API key configurada (para desarrollo sin credenciales)
        // Esto evita llamadas innecesarias a la API real durante desarrollo
        const useMock = process.env.NODE_ENV === 'development' &&
            (process.env.USE_CHAT_MOCK === 'true' || !process.env.GOOGLE_GENERATIVE_AI_API_KEY);

        if (useMock) {
            const lastMessage = messages[messages.length - 1];
            const userMessage = lastMessage?.content || '';

            console.log('🤖 [MODO MOCK] API de Chat llamada con herramientas mock');
            console.log('Mensaje del usuario:', userMessage, '| Sesión iniciada:', isLoggedIn);

            return new Response(createMockResponse(userMessage, !!isLoggedIn), {
                headers: {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'X-Mock-Response': 'true',
                },
            });
        }

        const apiKey = process.env.GROQ_API_KEY;

        // Validar que la API key esté presente
        if (!apiKey) {
            console.error('API Key de Groq no encontrada en las variables de entorno');
            return new Response(
                JSON.stringify({
                    error: 'La configuración del servicio de IA (Groq) no está completa.',
                    type: 'configuration_error'
                }),
                { status: 500, headers: { 'Content-Type': 'application/json' } }
            );
        }

        console.log('API de Chat llamada (Groq). API Key presente:', !!apiKey, 'Sesión iniciada:', isLoggedIn);
        console.log('Conteo de mensajes:', messages?.length || 0);

        // Obtener cookies para solicitudes autenticadas
        const cookieStore = await cookies();
        const cookieHeader = cookieStore.toString();

        // Manejador de errores personalizado para obtener mensajes detallados
        const errorHandler = (error: unknown): string => {
            if (error == null) {
                return 'Error desconocido';
            }
            if (typeof error === 'string') {
                return error;
            }
            if (error instanceof Error) {
                console.error('Detalles del error de streaming:', {
                    message: error.message,
                    name: error.name,
                    stack: error.stack
                });
                return error.message;
            }
            return JSON.stringify(error);
        };

        try {
            // Usar Groq Llama 3.1
            const systemPrompt = `Eres el asistente virtual experto de TicketLive. Tu objetivo es ayudar a los usuarios a descubrir eventos increíbles y gestionar sus compras sin fricciones.

            REGLAS DE COMPORTAMIENTO:
            1. BÚSQUEDA: Usa 'searchEvents' para encontrar eventos. Si el usuario pide un género (ej: rock), úsalo como parámetro 'category'.
            2. DETALLES: Si el usuario muestra interés en un evento, usa 'getEventDetails' para darle información completa (precios, capacidad, etc).
            3. CARRITO: 
               - Puedes ver el carrito con 'getCart'.
               - Para agregar, usa 'addToCart'. 
               - ${isLoggedIn
                    ? 'El usuario está AUTENTICADO. Puedes proceder con acciones de carrito.'
                    : 'El usuario NO está autenticado. SIEMPRE dile que debe iniciar sesión antes de intentar agregar algo al carrito.'}
            4. TONO: Sé amable, profesional y usa emojis ocasionalmente para mantener la energía del mundo del entretenimiento. ✨`;


            // Configurar cliente Groq
            const groq = createOpenAI({
                baseURL: 'https://api.groq.com/openai/v1',
                apiKey: apiKey,
            });

            const result = await streamText({
                model: groq('llama-3.3-70b-versatile'),
                system: systemPrompt,
                messages,
                tools: createChatbotTools(cookieHeader), // Pasar cookies a las herramientas
                maxSteps: 5,
            });

            console.log('Objeto de respuesta creado. Devolviendo stream...');
            return result.toDataStreamResponse({
                getErrorMessage: errorHandler,
            });
        } catch (streamError: unknown) {
            // Capturar errores específicos del stream
            const streamErrorMessage = streamError instanceof Error ? streamError.message : String(streamError);
            console.error('Error en streamText:', streamErrorMessage);
            console.error('Detalles del error de streaming:', streamError);

            // Si el error es de autenticación o configuración, devolverlo como JSON
            if (streamErrorMessage.includes('API key') ||
                streamErrorMessage.includes('authentication') ||
                streamErrorMessage.includes('401') ||
                streamErrorMessage.includes('403')) {
                return new Response(
                    JSON.stringify({
                        error: 'Error de autenticación con el servicio de IA. Por favor, verifica tu API key.',
                        type: 'authentication_error'
                    }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } }
                );
            }

            // Re-lanzar el error para que sea manejado por el catch externo
            throw streamError;
        }
    } catch (error: unknown) {
        // Extraer información del error de forma segura
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorObj = error as { status?: number; statusCode?: number; responseBody?: unknown; body?: unknown };
        const errorStatus = errorObj?.status || errorObj?.statusCode;
        const errorName = error instanceof Error ? error.name : 'UnknownError';
        const errorBody = errorObj?.responseBody || errorObj?.body;

        console.error('Detalles de error de la API de Chat:', {
            message: errorMessage,
            status: errorStatus,
            name: errorName,
            provider: 'google',
            stack: error instanceof Error ? error.stack : undefined,
            body: errorBody
        });

        // Verificar errores de la API Key
        if (errorMessage.includes('API key') || errorMessage.includes('authentication')) {
            return new Response(
                JSON.stringify({
                    error: 'Error de autenticación con el servicio de IA. Por favor, verifica la configuración.',
                    type: 'authentication_error'
                }),
                { status: 401, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verificar errores de Límite de Tasa (Rate Limit)
        const isRateLimit =
            errorStatus === 429 ||
            errorMessage.toLowerCase().includes('rate limit');

        if (isRateLimit) {
            console.warn('Límite de tasa de Google/Proveedor excedido:', errorMessage);
            return new Response(
                JSON.stringify({
                    error: 'El servicio de IA (Google Gemini) está saturado momentáneamente. Por favor, intenta de nuevo en unos minutos.',
                    type: 'rate_limit_error'
                }),
                { status: 429, headers: { 'Content-Type': 'application/json' } }
            );
        }

        // Verificar errores de solicitud inválida
        if (errorStatus === 400) {
            return new Response(
                JSON.stringify({
                    error: 'Solicitud inválida. Por favor, verifica tu mensaje e intenta de nuevo.',
                    type: 'invalid_request_error'
                }),
                { status: 400, headers: { 'Content-Type': 'application/json' } }
            );
        }

        return new Response(
            JSON.stringify({
                error: errorMessage || 'Error al procesar tu solicitud. Por favor intenta de nuevo.',
                type: 'chat_error',
                details: process.env.NODE_ENV === 'development' ? String(error) : undefined
            }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
