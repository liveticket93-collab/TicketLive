# TicketLive - Plataforma de Eventos con Asistente IA

TicketLive es una plataforma moderna para el descubrimiento y compra de entradas para eventos, potenciada por un asistente virtual inteligente que facilita la experiencia del usuario.

## 🚀 Características

- **Landing Page Dinámica**: Visualización de eventos destacados y categorías.
- **Asistente Virtual (Chatbot)**: Integrado con Groq/AI SDK para búsqueda de eventos y gestión de carrito mediante lenguaje natural.
- **Gestión de Carrito**: Flujo completo de reserva y compra de tickets.
- **Autenticación**: Sistema seguro de registro e inicio de sesión con soporte para Google Auth.
- **Diseño Premium**: Interfaz moderna, responsiva y con MICRO-ANIMACIONES.

## 🛠️ Stack Tecnológico

- **Frontend**: [Next.js](https://nextjs.org/) (App Router), TypeScript.
- **Estilos**: Tailwind CSS.
- **IA**: [Vercel AI SDK](https://sdk.vercel.ai/), Groq (Llama 3.3).
- **Formularios**: Formik & Yup.
- **Notificaciones**: Sonner.

## ⚙️ Configuración e Instalación

### Prerrequisitos
- Node.js 18.x o superior.
- npm o yarn.

### Pasos
1. **Clonar el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd front
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**:
   Crea un archivo `.env.local` basado en `.env.example`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000
   GROQ_API_KEY=tu_api_key_de_groq
   ```

4. **Ejecutar en desarrollo**:
   ```bash
   npm run dev
   ```

## 📂 Estructura del Proyecto

- `src/app`: Rutas y páginas de la aplicación.
- `src/components`: Componentes de UI y lógica visual.
- `src/contexts`: Manejo de estado global (Auth, Cart).
- `src/services`: Integración con APIs externas.
- `src/lib`: Utilidades y configuración de herramientas (IA).
- `src/validators`: Esquemas de validación de datos.

## 📖 Documentación Adicional

Para más detalles, consulta las guías específicas:
- [Arquitectura del Sistema](file:///c:/Users/leona/OneDrive/Escritorio/front/docs/ARCHITECTURE.md)
- [Guía de Diseño e Identidad](file:///c:/Users/leona/OneDrive/Escritorio/front/docs/DESIGN.md)
- [Prototipado y Wireframes](file:///c:/Users/leona/OneDrive/Escritorio/front/docs/PROTOTYPING.md)
- [Integración del Chatbot](file:///c:/Users/leona/OneDrive/Escritorio/front/docs/CHATBOT.md)

---
© 2024 TicketLive - Todos los derechos reservados.
