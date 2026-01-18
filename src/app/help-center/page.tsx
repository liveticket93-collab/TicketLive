import { ChevronRight, HelpCircle, MessageCircle, FileText, Shield, CreditCard, Ticket, TicketCheck } from "lucide-react";
import Link from "next/link";

export default function HelpCenterPage() {
  const categories = [
    {
      title: "Compras y Pagos",
      description: "Todo sobre métodos de pago, facturación y confirmación de pedidos.",
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      color: "from-violet-500/20 to-fuchsia-500/20",
      href: "/payments"
    },
    {
      title: "Tus Entradas",
      description: "Cómo descargar, imprimir y transferir tus tickets digitales.",
      icon: <Ticket className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20",
      href: "/tickets-info"
    },
    {
      title: "Seguridad y Accesos",
      description: "Políticas de ingreso, objetos permitidos y protocolos de seguridad.",
      icon: <TicketCheck className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-500/20 to-teal-500/20",
      href: "/security"
    }
  ];

  const faqs = [
    {
      question: "¿Cómo compro mis entradas?",
      answer: "Busca tu evento favorito, elige la sesión y los asientos, y sigue los pasos para completar el pago de forma segura."
    },
    {
      question: "¿Puedo cancelar mi compra?",
      answer: "Las políticas de devolución varían según el organizador. Te recomendamos revisar los términos específicos del evento antes de comprar."
    },
    {
      question: "¿Cómo recibo mis tickets?",
      answer: "Tus entradas se envían instantáneamente por email y también puedes encontrarlas en la sección 'Mis Tickets' de tu perfil."
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Luces de fondo */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-primary/5 blur-[120px] rounded-full -z-10" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent">
              Centro de <span className="text-primary italic">Ayuda</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Estamos aquí para asegurarnos de que tu única preocupación sea disfrutar del espectáculo.
            </p>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {categories.map((cat, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-primary/20 transition-all duration-500 relative overflow-hidden"
              >
                <div className={`absolute -right-10 -top-10 w-32 h-32 bg-gradient-to-br ${cat.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="mb-6 p-4 rounded-2xl bg-zinc-900 border border-white/10 w-fit group-hover:scale-110 transition-transform duration-500">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {cat.description}
                  </p>
                  <Link 
                    href={cat.href}
                    className="flex items-center text-xs font-bold text-primary tracking-widest uppercase hover:gap-1 transition-all w-fit"
                  >
                    Ver más <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* FAQs List */}
            <div className="space-y-8">
              <h2 className="text-4xl font-black text-white mb-10 italic">Preguntas <br /> <span className="text-primary not-italic">Frecuentes</span></h2>
              {faqs.map((faq, index) => (
                <div key={index} className="group p-8 rounded-3xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900/50 transition-all">
                  <h4 className="text-lg font-bold mb-4 text-white flex items-center gap-3">
                    <HelpCircle className="w-5 h-5 text-primary" />
                    {faq.question}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            {/* Contact Card */}
            <div className="sticky top-32 p-10 md:p-14 rounded-[3rem] bg-gradient-to-br from-zinc-900/80 to-primary/5 border border-white/10 backdrop-blur-md shadow-2xl">
              <MessageCircle className="w-16 h-16 text-primary mb-8 animate-bounce" />
              <h2 className="text-3xl font-bold mb-4 text-white">¿No encuentras lo que buscas?</h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed">
                Nuestro equipo de soporte humano está disponible los 365 días del año para ayudarte personalmente.
              </p>
              
              <Link 
                href="/contact" 
                className="flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white font-bold h-16 rounded-[1.5rem] transition-all group w-full text-lg shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)]"
              >
                Hablar con un Agente
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <div className="mt-12 flex items-center gap-4 py-8 border-t border-white/5">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 border-zinc-900 bg-zinc-800 flex items-center justify-center text-[10px] font-bold`}>
                      AD
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-white font-bold">12 agentes</span> están en línea ahora mismo.
                </p>
              </div>
            </div>
          </div>

          {/* Legal Links Footer */}
          <div className="mt-24 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-8">
            <Link href="/terms" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
              <FileText className="w-4 h-4" />
              Términos de servicio
            </Link>
            <Link href="/privacy" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-medium">
              <Shield className="w-4 h-4" />
              Privacidad y Seguridad
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
