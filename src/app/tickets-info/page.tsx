import { Ticket, Download, Share2, Smartphone, FileText, ChevronRight, HelpCircle, Info } from "lucide-react";
import Link from "next/link";

export default function TicketsInfoPage() {
  const sections = [
    {
      title: "Descarga de Tickets",
      description: "Una vez confirmada la compra, podrás descargar tus entradas en formato PDF desde tu perfil o el email de confirmación.",
      icon: <Download className="w-8 h-8 text-primary" />,
      color: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      title: "Transferencia de Entradas",
      description: "¿Compraste para un amigo? Puedes transferir tickets digitales de forma segura indicando su correo electrónico.",
      icon: <Share2 className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Ticket en tu Móvil",
      description: "No es necesario imprimir. Mostrando el código QR desde tu smartphone en la entrada es suficiente para ingresar.",
      icon: <Smartphone className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Términos y Condiciones",
      description: "Recuerda que cada ticket es único y válido para una sola persona. Revisa la política de devoluciones específica del evento.",
      icon: <FileText className="w-8 h-8 text-amber-500" />,
      color: "from-amber-500/20 to-yellow-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 blur-[150px] -z-10 rounded-full" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Ticket className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">Tu Entrada al Show</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic">
              Tus <br /> <span className="text-primary not-italic">Entradas</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Todo lo que necesitas saber sobre tus tickets digitales: descarga, uso en el acceso y transferencias a terceros.
            </p>
          </div>

          {/* Grid de Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {sections.map((section, index) => (
              <div 
                key={index} 
                className="group p-8 rounded-[2.5rem] bg-zinc-900/40 border border-white/5 hover:border-primary/30 transition-all duration-500 relative overflow-hidden backdrop-blur-sm"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${section.color} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10">
                  <div className="mb-6 p-4 rounded-2xl bg-zinc-900/80 border border-white/10 w-fit group-hover:scale-110 transition-transform duration-500 shadow-xl">
                    {section.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-primary transition-colors">{section.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Important Info Box */}
          <div className="p-10 md:p-14 rounded-[3rem] bg-gradient-to-b from-zinc-900/80 to-zinc-900/20 border border-white/5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Info className="text-primary w-8 h-8" />
              Información Vital
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p>
                Asegúrate de que la batería de tu dispositivo esté cargada antes de llegar al recinto y que el brillo de la pantalla sea óptimo para el escaneo del código QR.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 p-8 rounded-2xl bg-black/40 border border-white/5">
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" /> 
                    ¿Problemas con el QR?
                  </h4>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Verifica que no sea una captura de pantalla</li>
                    <li>Limpia la pantalla de tu móvil</li>
                    <li>Usa la versión original en PDF</li>
                    <li>Acude a la boletería de "Soporte Digital"</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Download className="w-4 h-4 text-emerald-500" />
                    Recomendación
                  </h4>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Guarda el ticket en tu Apple Wallet o G-Pay</li>
                    <li>Lleva una copia impresa de respaldo</li>
                    <li>No publiques fotos de tu QR en redes</li>
                    <li>Llega al menos 60 min antes del show</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-between items-center text-sm font-medium pt-8 border-t border-white/5">
              <span className="text-muted-foreground">TicketLive System v4.0</span>
              <Link href="/dashboard" className="text-primary hover:underline flex items-center gap-1 font-bold">
                Ver mis entradas ahora <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">¿Aún no tienes tus entradas?</p>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-primary hover:text-white font-bold transition-all group"
            >
              Explorar Próximos Eventos <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
