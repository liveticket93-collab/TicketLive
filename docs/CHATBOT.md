# Integración del Chatbot e IA - TicketLive

El asistente inteligente es un pilar central de la experiencia en TicketLive, permitiendo a los usuarios interactuar con la plataforma de forma conversacional.

## 🧠 Modelos y Proveedores

- **Motor Principal**: Llama 3.3 70B Versatile (vía Groq).
- **Fallback/Opcional**: Gemini 2.0 Flash (Google Generative AI).
- **Framework**: Vercel AI SDK (`ai`, `@ai-sdk/openai`).

## 🛠️ Herramientas Disponibles (Tools)

El LLM tiene capacidad para ejecutar las siguientes funciones en nombre del usuario:

1. **searchEvents**: Busca eventos por título o categoría en la base de datos real.
2. **getEventDetails**: Obtiene información detallada de un evento específico por su ID.
3. **getCategories**: Lista todas las categorías disponibles.
4. **addToCart**: Añade un ticket al carrito (requiere autenticación).
5. **getCart**: Consulta los items actuales del carrito.
6. **clearCart**: Vacía el carrito del usuario.

## 🎛️ Configuración Técnica

La lógica reside en:
- `src/app/api/chat/route.ts`: Endpoint de streaming y selección de modelo.
- `src/lib/chatbot-tools.ts`: Definición de esquemas Zod y llamadas a servicios.
- `src/components/ui/ChatBot.tsx`: Interfaz de chat y manejo de efectos secundarios de las herramientas.

## 🧪 Modo Mock
En entornos de desarrollo sin API keys configuradas, el sistema entra automáticamente en un **Modo Mock** que simula respuestas del asistente y ejecuciones de herramientas para facilitar el testing de UI.
