"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Mail, Phone, MapPin, Send, ChevronRight } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Mensaje enviado correctamente", {
      description: "Nuestro equipo se pondrá en contacto contigo muy pronto."
    });
  };

  return (
    <div className="min-h-screen bg-background pt-32 pb-24">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contáctanos</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              ¿Tienes alguna duda o comentario? Estamos aquí para escucharte y ayudarte.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-6">
              <div className="space-y-6">
                <h2 className="text-4xl font-black text-white">Información de contacto</h2>
                <p className="text-muted-foreground text-lg">
                  No dudes en escribirnos por cualquiera de nuestras vías de comunicación.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                  <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-green-500/10 text-green-500">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Teléfono</p>
                    <p className="text-xl font-bold text-white">+54 11 0000-0000</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 p-6 rounded-[2rem] bg-zinc-900/50 border border-white/5">
                  <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                    <MapPin className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest mb-1">Oficina</p>
                    <p className="text-xl font-bold text-white">Av. Corrientes 1234, CABA</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 backdrop-blur-sm">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Nombre</label>
                    <Input placeholder="Tu nombre..." required className="bg-black/40 border-white/5 h-14 rounded-2xl" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Email</label>
                    <Input type="email" placeholder="tu@correo.com" required className="bg-black/40 border-white/5 h-14 rounded-2xl" />
                  </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-400 ml-1">Asunto</label>
                    <div className="relative">
                      <select className="w-full bg-black/40 border border-white/5 rounded-2xl h-14 px-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all">
                        <option>Consulta General</option>
                        <option>Soporte Técnico</option>
                        <option>Ventas</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                        <ChevronRight className="w-5 h-5 rotate-90" />
                      </div>
                    </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-400 ml-1">Mensaje</label>
                  <textarea 
                    className="w-full bg-black/40 border border-white/5 rounded-2xl p-6 min-h-[160px] text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
                    placeholder="¿En qué podemos ayudarte?"
                    required
                  ></textarea>
                </div>

                <Button size="lg" className="w-full h-16 text-xl gap-3 bg-[#8B5CF6] hover:bg-[#7C3AED] shadow-[0_10px_40px_-10px_rgba(139,92,246,0.5)] rounded-3xl" type="submit">
                  <Send className="w-6 h-6" />
                  Enviar Mensaje
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
