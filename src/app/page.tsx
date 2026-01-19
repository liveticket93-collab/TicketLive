
"use client";

export const dynamic = "force-dynamic";

import { Hero } from "@/components/landing/Hero";
import { EventGrid } from "@/components/landing/EventGrid";
import { FeaturedEvent } from "@/components/landing/FeaturedEvent";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";

export default function Home() {
  const handleSubscribe = (formData: FormData) => {
    // In a real app we would send the data
    toast.success("¡Suscrito exitosamente!", {
      description: "Serás el primero en enterarte de nuevos eventos.",
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary/30 selection:text-primary-foreground">
      <Hero />
      <FeaturedEvent />
      <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Cargando eventos…</div>}>
        <EventGrid />
      </Suspense>

      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-bottom-right" />

        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            ¡No te pierdas ningún evento!
          </h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
            Suscríbete a nuestro boletín mensual para enterarte de pre-ventas
            exclusivas, eventos especiales, y experiencias VIP.
          </p>

          <form
            action={handleSubscribe}
            className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
          >
            <Input
              name="email"
              type="email"
              placeholder="Ingresa tu correo electrónico"
              className="bg-background/50 h-12"
              required
            />
            <Button size="lg" className="h-12 px-8" type="submit">
              Suscríbete
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
