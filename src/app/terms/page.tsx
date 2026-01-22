import { ChevronRight, FileText, Gavel, ShieldCheck, UserCheck, AlertCircle } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "Uso de la Plataforma",
      icon: <UserCheck className="w-8 h-8 text-blue-500" />,
      content: "Al utilizar TicketLive, te comprometes a hacer un uso lícito de la plataforma. El acceso es personal e intransferible.",
      color: "from-blue-500/20 to-indigo-500/20"
    },
    {
      title: "Propiedad Intelectual",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      content: "Todo el contenido, marcas y software son propiedad exclusiva de TicketLive o sus licenciantes y están protegidos por ley.",
      color: "from-violet-500/20 to-purple-500/20"
    },
    {
      title: "Políticas de Venta",
      icon: <FileText className="w-8 h-8 text-emerald-500" />,
      content: "Todas las ventas son finales. Las devoluciones o cambios están sujetos a la política establecida por el organizador del evento.",
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Limitación de Responsabilidad",
      icon: <AlertCircle className="w-8 h-8 text-amber-500" />,
      content: "TicketLive no se hace responsable de cancelaciones o cambios de programación realizados por terceros organizadores.",
      color: "from-amber-500/20 to-orange-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-primary/5 blur-[150px] -z-10 rounded-full" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 border border-white/10 text-muted-foreground mb-6">
              <Gavel className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">Legal & Transparencia</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 text-white italic">
              Términos <br /><span className="text-primary not-italic">de Servicio</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Reglas claras para una experiencia inolvidable. Lee detenidamente nuestras condiciones de uso.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {sections.map((section, index) => (
              <div 
                key={index}
                className="group p-10 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-all duration-500 relative overflow-hidden backdrop-blur-sm"
              >
                <div className={`absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br ${section.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="mb-6 p-4 rounded-2xl bg-zinc-950 border border-white/5 w-fit group-hover:scale-110 transition-transform duration-500 shadow-2xl">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors">{section.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Detailed Section Footer */}
          <div className="p-10 md:p-14 rounded-[3rem] bg-zinc-900/20 border border-white/5 backdrop-blur-xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
             
             <h2 className="text-3xl font-black text-white mb-8">Información Adicional</h2>
             <div className="space-y-6 text-muted-foreground text-sm leading-loose">
               <p>
                 Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en este sitio web.
               </p>
               <p>
                 El uso continuado de la plataforma tras cualquier modificación constituye la aceptación de los nuevos términos. Si no estás de acuerdo con los términos modificados, debes abstenerte de utilizar el sitio.
               </p>
             </div>

             <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-6 pt-10 border-t border-white/5">
                <p className="text-muted-foreground">© 2026 TicketLive Inc. Todos los derechos reservados.</p>
                <a href="/help-center" className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all">
                  ¿Dudas legales? <ChevronRight className="w-5 h-5" />
                </a>
             </div>
          </div>

          <div className="mt-16 text-center text-xs text-muted-foreground">
            Última actualización: 17 de enero de 2026 • TicketLive Platform v4.0.0
          </div>
        </div>
      </div>
    </div>
  );
}
