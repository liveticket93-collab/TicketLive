import { ShieldCheck, DoorOpen, HardHat, Camera, Ban, Trash2, UserCheck, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function SecurityPage() {
  const securitySections = [
    {
      title: "Políticas de Ingreso",
      description: "Entrada permitida desde 2 horas antes del evento. Es obligatorio presentar DNI y ticket digital original.",
      icon: <DoorOpen className="w-8 h-8 text-primary" />,
      color: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      title: "Protocolos de Seguridad",
      description: "Contamos con personal de seguridad certificado, puntos de asistencia médica y protocolos de evacuación señalizados.",
      icon: <HardHat className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Objetos Prohibidos",
      description: "No se permite el ingreso con armas, sustancias ilícitas, envases de vidrio, punteros láser ni pirotecnia.",
      icon: <Ban className="w-8 h-8 text-rose-500" />,
      color: "from-rose-500/20 to-orange-500/20"
    },
    {
      title: "Fotografía y Video",
      description: "Cámaras profesionales y equipos de grabación requieren acreditación previa. El uso de flash suele estar restringido.",
      icon: <Camera className="w-8 h-8 text-amber-500" />,
      color: "from-amber-500/20 to-yellow-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[150px] -z-10 rounded-full" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">Seguridad & Confianza</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic">
              Seguridad y <br /> <span className="text-primary not-italic">Accesos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tu seguridad es nuestra prioridad. Conoce las normas y protocolos para disfrutar del evento con total tranquilidad.
            </p>
          </div>

          {/* Grid de Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {securitySections.map((section, index) => (
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

          {/* Detailed Info Box */}
          <div className="p-10 md:p-14 rounded-[3rem] bg-gradient-to-b from-zinc-900/80 to-zinc-900/20 border border-white/5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <UserCheck className="text-primary w-8 h-8" />
              Verificación de Identidad
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p>
                Para garantizar un ambiente seguro, todos los asistentes deben someterse a controles de seguridad preventivos en los puntos de acceso. Esto incluye revisión de bolsos y escaneo de tickets.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 p-8 rounded-2xl bg-black/40 border border-white/5">
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Trash2 className="w-4 h-4 text-rose-500" /> 
                    Artículos a desechar
                  </h4>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Alimentos y bebidas externas</li>
                    <li>Sustancias inflamables</li>
                    <li>Objetos punzantes</li>
                    <li>Mochilas de gran tamaño</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Recomendaciones
                  </h4>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Llega con antelación</li>
                    <li>Ten tu ticket a mano</li>
                    <li>Identifica las salidas</li>
                    <li>Sigue las instrucciones del staff</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-between items-center text-sm font-medium pt-8 border-t border-white/5">
              <span className="text-muted-foreground">Protocolo v1.4</span>
              <span className="px-4 py-2 rounded-lg bg-zinc-800 text-white italic">Actualizado: Enero 2026</span>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">¿Tienes alguna duda específica sobre el acceso?</p>
            <Link 
              href="/help-center" 
              className="inline-flex items-center gap-2 text-primary hover:text-white font-bold transition-all group"
            >
              Volver al Centro de Ayuda <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
