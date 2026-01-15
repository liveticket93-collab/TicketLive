# TicketLive - Design Tokens (Figma Edition)

Utiliza estos valores para configurar tus estilos de capa y texto en Figma de forma idéntica a la aplicación real.

## 🎨 Paleta de Colores (Colores de Marca)

| Estilo Figma | Código HEX | Variable CSS | Uso |
| :--- | :--- | :--- | :--- |
| **Background** | `#09090B` | `--background` | Color de fondo principal |
| **Foreground** | `#FAFAFA` | `--foreground` | Texto principal |
| **Primary** | `#8B5CF6` | `--primary` | Botones, estados activos (Violeta) |
| **Accent** | `#D946EF` | `--accent` | Detalles, gradientes (Fucsia) |
| **Muted** | `#27272A` | `--muted` | Fondos secundarios, bordes |
| **Muted FG** | `#A1A1AA` | `--muted-foreground` | Texto de descripción / etiquetas |
| **Border** | `#27272A` | `--border` | Divisores y bordes sutiles |

### Gradientes Sugeridos
- **Primary Gradient**: `linear-gradient(to right, #9333ea, #db2777)` (Purple 600 -> Pink 600)
- **Glass Card**: `rgba(255, 255, 255, 0.05)` con 10px - 20px de Background Blur.

---

## 🔡 Tipografía

- **Fuente**: `Inter` (o `Geist Sans` si tienes acceso).
- **Suavizado**: `Antialiased`.

| Nodo Figma | Tamaño | Peso (Weight) | Letter Spacing |
| :--- | :--- | :--- | :--- |
| **H1 (Hero)** | 72px / 4.5rem | Bold (700) | -0.05em |
| **H2 (Section)** | 48px / 3rem | Bold (700) | -0.025em |
| **H3 (Card Title)**| 20px / 1.25rem| Semibold (600) | Normal |
| **Body** | 16px / 1rem | Regular (400) | Normal |
| **Muted Text** | 14px / 0.875rem| Regular (400) | Normal |

---

## 📏 Sistema de Espaciado y Layout

| Nombre | Valor (px) | Uso |
| :--- | :--- | :--- |
| **Rounded XL** | 12px | Botones e Inputs |
| **Rounded 2XL**| 16px | Cards estándar |
| **Rounded 3XL**| 24px | Secciones principales / Modales |
| **Container** | 1280px | Ancho máximo de contenido |
| **Gutter** | 24px | Espacio entre columnas de la grilla |

---

## 💎 Especificaciones de Componentes

### Botón Principal (Primary)
- **Fondo**: Gradient (Purple -> Pink)
- **Texto**: White (Bold)
- **Shadow**: `rgba(139, 92, 246, 0.5)` con 15px de blur (Efecto brillo).
- **Corner Radius**: 12px.

### Card de Evento (Glassmorphism)
- **Fondo**: `white` al 5% de opacidad.
- **Borde**: 1px solid `white` al 10% de opacidad.
- **Efecto**: Background Blur (12px).
- **Corner Radius**: 24px (Rounded 3XL).
