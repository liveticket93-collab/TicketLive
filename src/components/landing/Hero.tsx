import Link from 'next/link';
import { Button } from '@/components/ui/Button';
// import { cn } from '@/utils/cn'; // Will use if needed

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background Gradient / Image Placeholder */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0" />
      
      {/* Animated blobs or effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl opacity-20 animate-pulse delay-1000" />

      <div className="container relative z-10 px-4 md:px-6 text-center">
        <div className="inline-block animate-bounce-slow mb-6">
          <span className="px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
            Eventos Premium en Vivo
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-br from-white via-white/90 to-white/50 bg-clip-text text-transparent drop-shadow-sm">
          Vive lo <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">extraordinario</span>
        </h1>
        
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Descubre y reserva entradas para los conciertos, festivales y eventos deportivos más exclusivos del mundo. Tu próxima experiencia empieza aquí.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
           <Button size="lg" className="h-14 px-8 text-lg min-w-[200px]">
             Explorar eventos
           </Button>
           <Button variant="outline" size="lg" className="h-14 px-8 text-lg min-w-[200px]">
             Cómo funciona
           </Button>
        </div>
        
        {/* Stats or Trusted By */}
        <div className="mt-20 pt-8 border-t border-white/5 grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
                { label: 'Usuarios activos', value: '2M+' },
                { label: 'Eventos en vivo', value: '500+' },
                { label: 'Países', value: '30+' },
                { label: 'Reseñas 5 estrellas', value: '10k+' }
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                    <span className="text-2xl font-bold text-white">{stat.value}</span>
                    <span className="text-sm text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
