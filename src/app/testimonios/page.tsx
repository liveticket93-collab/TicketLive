import { Star, Quote, CheckCircle2 } from "lucide-react";
import Image from "next/image";

export default function TestimoniosPage() {
  const testimonials = [
    {
      name: "Alejandra Torres",
      role: "Fan de la Música",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      content: "¡Increíble experiencia! Compré mis entradas para el Festival de Verano y todo fue súper fluido. El código QR llegó al instante.",
      rating: 5,
      event: "Festival CodeSummer 2026",
      verified: true
    },
    {
      name: "Carlos Mendoza",
      role: "Entusiasta de Deportes",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
      content: "La mejor plataforma para comprar boletos de fútbol. Sin filas, sin complicaciones y con el mejor mapa de asientos que he visto.",
      rating: 5,
      event: "Liga CodeStars",
      verified: true
    },
    {
      name: "Elena Rodríguez",
      role: "Amante del Teatro",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200",
      content: "Me encanta la estética del sitio y lo fácil que es navegar. TicketLive se convirtió en mi opción número uno para eventos culturales.",
      rating: 5,
      event: "Obra: El Código Invisible",
      verified: true
    },
    {
      name: "Roberto Sánchez",
      role: "Tech Professional",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200",
      content: "Asistí a la Tech Summit y el proceso de acreditación con TicketLive fue impecable. Muy recomendado por su rapidez.",
      rating: 4,
      event: "Tech Summit 2026",
      verified: true
    },
    {
      name: "Sofía Martínez",
      role: "Concert Goer",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      content: "Excelente soporte al cliente vía WhatsApp. Tuve una duda con mi pago y me lo resolvieron en 5 minutos. ¡Geniales!",
      rating: 5,
      event: "Concierto de Rock",
      verified: true
    },
    {
      name: "Martín Gómez",
      role: "Developer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      content: "Como desarrollador, valoro mucho la fluidez de la interfaz. Se nota que hay un trabajo de UX de primer nivel.",
      rating: 5,
      event: "Hacker Night",
      verified: true
    }
  ];

  return (
    <main className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px]" />
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary text-sm font-medium mb-6">
            <Star className="h-4 w-4 fill-primary" />
            <span>+10,000 Fans Satisfechos</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Lo que dicen <br /> <span className="text-primary">nuestros fans</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Nuestra mayor recompensa es ser parte de tus mejores recuerdos. Descubre por qué miles de usuarios confían en TicketLive.
          </p>
        </div>

        {/* Testimonials Masonry/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {testimonials.map((t, i) => (
            <div 
              key={i} 
              className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md hover:border-primary/30 transition-all group relative animate-in fade-in slide-in-from-bottom-5 duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute -top-4 -left-4 h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Quote className="h-5 w-5 fill-current" />
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, starI) => (
                  <Star 
                    key={starI} 
                    className={`h-4 w-4 ${starI < t.rating ? 'text-yellow-400 fill-yellow-400' : 'text-zinc-600'}`} 
                  />
                ))}
              </div>

              <p className="text-gray-300 leading-relaxed mb-8 italic">
                "{t.content}"
              </p>

              <div className="flex items-center gap-4 border-t border-white/5 pt-6">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <img 
                    src={t.image} 
                    alt={t.name}
                    className="rounded-full object-cover border-2 border-primary/20"
                  />
                  {t.verified && (
                    <div className="absolute -bottom-1 -right-1 bg-background rounded-full">
                      <CheckCircle2 className="h-4 w-4 text-primary fill-background" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">{t.name}</h4>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                  <p className="text-[10px] text-primary mt-1 font-medium bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                    Asistió a: {t.event}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl">
          {[
            { label: 'Entradas Vendidas', value: '500k+' },
            { label: 'Rating Promedio', value: '4.9/5' },
            { label: 'Eventos Activos', value: '200+' },
            { label: 'Soporte 24/7', value: '100%' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-3xl font-bold text-white mb-1 tracking-tight">{stat.value}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
