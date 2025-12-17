import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import { Footer } from "@/components/layout/Footer";


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

      {/* <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
