import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { Toaster } from "sonner";


const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TicketLive - Premium Concert Tickets",
  description: "Secure tickets for the best live events, concerts, and festivals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        {/* AuthProvider envuelve toda la app para proveer el contexto de autenticación */}
        <AuthProvider>
          <CartProvider>
            <Navbar />
            {children}
            <Footer />
            {/* Toaster para mostrar notificaciones en toda la app */}
            <Toaster position="top-right" richColors />
          </CartProvider>
        </AuthProvider>
      </body>
    </html >
  );
}
