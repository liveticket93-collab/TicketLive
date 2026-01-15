import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { Calendar, MapPin, Star } from 'lucide-react';

export function FeaturedEvent() {
  return (
    <section className="relative py-12 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="rounded-[3rem] relative overflow-hidden bg-black border border-white/10 shadow-2xl">
            {/* Imagen de fondo con superposición */}
            <div className="absolute inset-0 z-0">
                    <Image 
                    src="https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=2670&auto=format&fit=crop"
                    alt="Fondo del evento destacado"
                    fill
                    className="object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            </div>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 md:p-16 items-center">
                <div className="space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/20 text-accent font-bold uppercase tracking-widest text-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>Tendencias</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        The Galactic <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Symphony Tour</span>
                    </h2>

                    <p className="text-lg text-gray-300 max-w-lg">
                        Únete a nosotros en un viaje audiovisual inmersivo que desafía la gravedad. Vive el futuro del sonido en un espectáculo de una sola noche.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-6 text-white pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Fecha</p>
                                <p className="font-semibold">Aug 14, 2025</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm">
                                <MapPin className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase">Lugar</p>
                                <p className="font-semibold">Sphere, Las Vegas</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <Button size="lg" className="h-14 px-8 text-lg shadow-[0_0_30px_-5px_rgba(139,92,246,0.6)] hover:shadow-[0_0_50px_-5px_rgba(139,92,246,0.8)] transition-shadow">
                            Comprar entradas
                        </Button>
                        <Button variant="outline" size="lg" className="h-14 px-8 text-lg border-white/20 hover:bg-white/10 text-white">
                            Ver cartel
                        </Button>
                    </div>
                </div>

                {/* Lado derecho - podría ser una cuenta regresiva o imagen del artista */}
                <div className="hidden lg:block relative h-full min-h-[400px]">
                     {/* Elementos decorativos */}
                     <div className="absolute right-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/40 rounded-full blur-[100px] animate-pulse" />
                     <div className="relative z-10 rotate-6 hover:-rotate-3 transition-transform duration-500">
                        <div className="relative aspect-[3/4] w-80 mx-auto rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                             <Image 
                                src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2670&auto=format&fit=crop"
                                alt="Artista"
                                fill
                                className="object-cover"
                            />
                        </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}
