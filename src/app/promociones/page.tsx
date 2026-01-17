import { Tag, Zap, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function PromocionesPage() {
  const promos = [
    {
      title: "Early Bird: Festival Summer",
      discount: "20% OFF",
      description: "Compra tus entradas antes del 1 de febrero y obtén un descuento exclusivo para el festival más grande del año.",
      code: "SUMMER20",
      expires: "01 Feb 2026",
      color: "purple"
    },
    {
      title: "Martes de Teatro",
      discount: "2x1",
      description: "Todos los martes, lleva dos entradas por el precio de una para cualquier obra en cartelera nacional.",
      code: "TEATRO2X1",
      expires: "31 Dic 2026",
      color: "pink"
    },
    {
      title: "First Buy Bonus",
      discount: "$10 USD",
      description: "Si es tu primera vez comprando en TicketLive, te regalamos un crédito para tu primera entrada.",
      code: "WELCOME10",
      expires: "Ilimitado",
      color: "blue"
    }
  ];

  return (
    <main className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-background to-background z-0" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-6">
            <Zap className="h-3 w-3 fill-current" />
            Ofertas por tiempo limitado
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Promociones y <br /> <span className="text-primary">Beneficios Exclusivos</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Queremos que vivas más experiencias. Aprovecha estos descuentos diseñados para nuestra comunidad de fans.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {promos.map((promo, i) => (
            <div key={i} className="group relative p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl hover:border-primary/50 transition-all overflow-hidden">
              {/* Background gradient hint */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${promo.color}-500/10 rounded-full blur-3xl group-hover:bg-${promo.color}-500/20 transition-colors`} />
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{promo.title}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Valido hasta: {promo.expires}
                  </div>
                </div>
                <div className="text-4xl font-black text-primary drop-shadow-[0_0_10px_rgba(var(--primary),0.3)]">
                  {promo.discount}
                </div>
              </div>

              <p className="text-gray-400 mb-8 leading-relaxed max-w-md">
                {promo.description}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full sm:w-auto flex items-center justify-between gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-dashed border-white/20">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Código:</span>
                  <span className="font-mono text-lg font-bold text-white tracking-widest">{promo.code}</span>
                </div>
                <Link 
                  href="/events" 
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                >
                  Usar ahora <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 p-12 rounded-[3rem] bg-gradient-to-b from-white/5 to-transparent border border-white/10 text-center relative overflow-hidden">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
          <h2 className="text-2xl font-bold mb-4">¿Eres organizador?</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Crea códigos de descuento personalizados para tus fans y aumenta tus ventas en minutos con nuestro panel de gestión de eventos.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            Saber más sobre ventas corporativas <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
