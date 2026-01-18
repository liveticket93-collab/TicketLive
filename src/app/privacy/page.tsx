import { Shield, Eye, Lock, Database, Bell, ChevronRight } from "lucide-react";

export default function PrivacyPage() {
  const sections = [
    {
      title: "Recolección de Datos",
      description: "Recopilamos información cuando te registras, compras entradas o te suscribes. Esto incluye nombre, email y detalles básicos de perfil.",
      icon: <Database className="w-8 h-8 text-primary" />,
      color: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      title: "Uso de la Información",
      description: "Tus datos nos permiten procesar transacciones rápidamente, enviarte actualizaciones de tus eventos favoritos y mejorar tu experiencia.",
      icon: <Eye className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Protección Robusta",
      description: "Implementamos encriptación de grado bancario (AES-256) para asegurar que tu información personal esté siempre fuera de peligro.",
      icon: <Lock className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Tus Derechos",
      description: "Tienes control total. Puedes acceder, rectificar o eliminar tus datos en cualquier momento desde la configuración de tu cuenta.",
      icon: <Shield className="w-8 h-8 text-amber-500" />,
      color: "from-amber-500/20 to-orange-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] -z-10 rounded-full" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-fade-in">
              <Shield className="w-4 h-4" />
              <span className="text-xs font-bold tracking-widest uppercase">Privacidad Segura</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent">
              Política de <br /> <span className="text-primary">Privacidad</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              En TicketLive, tu confianza es nuestro activo más valioso. Descubre cómo protegemos y gestionamos tu información.
            </p>
          </div>

          {/* Grid de Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 font-sans">
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

          {/* Detailed Content Box */}
          <div className="p-10 md:p-14 rounded-[3rem] bg-gradient-to-b from-zinc-900/80 to-zinc-900/20 border border-white/5 backdrop-blur-md">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Bell className="text-primary w-8 h-8" />
              Compromiso de Transparencia
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p>
                Utilizamos cookies para mejorar la navegación y entender cómo interactúas con nuestra plataforma. Al continuar navegando, aceptas nuestra política de cookies enfocada en la personalización.
              </p>
              <p>
                Nunca venderemos tus datos a terceros. Toda la información financiera se procesa a través de pasarelas de pago certificadas PCI-DSS nivel 1, asegurando que tus datos bancarios nunca toquen nuestros servidores de forma directa.
              </p>
              <div className="flex flex-col md:flex-row gap-6 pt-10 border-t border-white/5 mt-10">
                <div className="flex-1">
                  <h4 className="text-white font-bold mb-2">Cookies Estrictas</h4>
                  <p className="text-sm">Necesarias para el funcionamiento del carrito y el inicio de sesión.</p>
                </div>
                <div className="flex-1 border-l border-white/5 pl-0 md:pl-6">
                  <h4 className="text-white font-bold mb-2">Analíticas</h4>
                  <p className="text-sm">Nos ayudan a entender qué eventos son más populares para traerte mejores ofertas.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-between items-center text-sm font-medium">
              <span className="text-muted-foreground">Versión 2.0.1</span>
              <span className="px-4 py-2 rounded-lg bg-zinc-800 text-white italic">Última actualización: 17 de Enero, 2026</span>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">¿Tienes preguntas sobre tus datos?</p>
            <a 
              href="/contact" 
              className="inline-flex items-center gap-2 text-primary hover:text-white font-bold transition-all group"
            >
              Contacta con nuestro DPO <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
