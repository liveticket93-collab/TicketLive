"use client";

import { MessageCircle, CreditCard, Ticket, ShieldCheck, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      icon: Ticket,
      question: "¿Cómo recibo mis entradas después de comprar?",
      answer: "Tus entradas se envían automáticamente a tu correo electrónico en formato QR. También puedes acceder a ellas en cualquier momento desde tu perfil en la sección 'Mis Entradas'."
    },
    {
      icon: CreditCard,
      question: "¿Qué métodos de pago aceptan?",
      answer: "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, Amex), Mercado Pago y transferencias bancarias directas para eventos seleccionados."
    },
    {
      icon: ShieldCheck,
      question: "¿Es seguro comprar en TicketLive?",
      answer: "Absolutamente. Contamos con cifrado SSL de 256 bits y procesamos todos los pagos a través de plataformas líderes mundiales para garantizar tu seguridad."
    },
    {
      icon: MessageCircle,
      question: "¿Puedo cancelar o pedir un reembolso?",
      answer: "Las políticas de reembolso dependen del organizador del evento. Generalmente, se permiten devoluciones hasta 48 horas antes del inicio, a menos que el evento indique lo contrario."
    }
  ];

  return (
    <main className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Preguntas <span className="text-primary">Frecuentes</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Todo lo que necesitas saber para disfrutar de tu próxima experiencia sin preocupaciones.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className={`group rounded-3xl border transition-all duration-300 ${
                openIndex === i 
                ? 'bg-primary/5 border-primary/50 shadow-[0_0_30px_rgba(var(--primary),0.1)]' 
                : 'bg-white/5 border-white/10 hover:border-white/20'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full p-6 md:p-8 flex items-center justify-between gap-4 text-left"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-colors ${
                    openIndex === i ? 'bg-primary text-white' : 'bg-white/5 text-primary'
                  }`}>
                    <faq.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-white">{faq.question}</h3>
                </div>
                <ChevronDown className={`h-6 w-6 text-muted-foreground transition-transform duration-300 ${
                  openIndex === i ? 'rotate-180 text-primary' : ''
                }`} />
              </button>
              
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-6 md:p-8 pt-0 text-muted-foreground leading-relaxed text-lg border-t border-white/5">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 p-8 rounded-3xl bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 text-center backdrop-blur-xl">
            <h3 className="text-xl font-semibold mb-2 text-white">¿No encontraste lo que buscabas?</h3>
            <p className="text-muted-foreground mb-6">Nuestro equipo de soporte humano está disponible para ayudarte.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-colors">
                    Contactar Soporte
                </Link>
                <Link href="https://wa.me/5491100000000" className="px-8 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors flex items-center justify-center gap-2">
                    <MessageCircle className="h-5 w-5" /> WhatsApp
                </Link>
            </div>
        </div>
      </div>
    </main>
  );
}
