# Arquitectura del Sistema - TicketLive

Este documento describe la estructura técnica y el flujo de información de la plataforma TicketLive.

## 🧱 Componentes Principales

### 1. Frontend (Next.js App Router)
La interfaz de usuario está construida con Next.js, utilizando el App Router para el manejo de rutas y componentes de servidor/cliente según sea necesario.

### 2. Gestión de Estado (React Context)
- **AuthContext**: Gestiona la sesión del usuario, persistencia mediante cookies y comunicación con el servicio de autenticación.
- **CartContext**: Controla el estado del carrito de compras, sincronización con `localStorage` y cálculo de totales.

### 3. Capa de Servicios
Ubicada en `src/services`, centraliza las peticiones a la API externa (`fetchAPI` personalizada) para:
- Autenticación (`auth.service.ts`)
- Eventos y categorías (`events.service.ts`)
- Productos (`product.service.ts`)

## 🔄 Flujo de Datos del Chatbot

El Chatbot utiliza una arquitectura de **Agente con Herramientas (Tool Calling)**:

1. **Usuario** envía un mensaje a través del componente `ChatBot.tsx`.
2. El mensaje llega a `/api/chat/route.ts`.
3. El LLM (Groq Llama 3.3) analiza la intención.
4. Si el LLM detecta que el usuario quiere realizar una acción (ej: "buscar rock"), invoca una **Tool** definida en `src/lib/chatbot-tools.ts`.
5. La Tool ejecuta una petición al servicio correspondiente.
6. El resultado regresa al LLM, que genera una respuesta natural para el usuario.
7. El frontend procesa efectos secundarios (ej: actualizar el carrito de forma reactiva).

## 📁 Organización de Carpetas

```
front/
├── docs/                # Documentación detallada
├── public/              # Activos estáticos
├── src/
│   ├── app/             # Rutas y Endpoints API
│   ├── components/      # UI, Layouts y Forms
│   ├── contexts/        # Estado Global
│   ├── interfaces/      # Tipos y Contratos de Datos
│   ├── lib/             # Configuración de Terceros (IA)
│   ├── services/        # Lógica de Comunicación API
│   ├── utils/           # Ayudantes (Helpers)
│   └── validators/      # Reglas de Validación (Yup)
└── README.md            # Guía General
```
