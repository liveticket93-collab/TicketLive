import { Button } from "@/components/ui/Button";
import { Mail, Phone, MapPin, Send, ChevronDown } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Fondo con degradado sutil */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-3xl mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Estamos para <br /> <span className="text-primary">ayudarte</span>
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed">
            ¿Tienes alguna duda sobre tu compra o quieres organizar un evento con nosotros? Nuestro equipo está listo para asistirte 24/7.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Formulario */}
          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl">
            <h2 className="text-2xl font-semibold mb-8">Envíanos un mensaje</h2>
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                  <input 
                    type="text" 
                    placeholder="Tu nombre"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <input 
                    type="email" 
                    placeholder="tu@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Asunto</label>
                <div className="relative">
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors appearance-none text-white cursor-pointer">
                    <option className="bg-[#0a0a0a] text-white">Consulta General</option>
                    <option className="bg-[#0a0a0a] text-white">Problema con mi compra</option>
                    <option className="bg-[#0a0a0a] text-white">Venta de entradas</option>
                    <option className="bg-[#0a0a0a] text-white">Prensa / Marketing</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Mensaje</label>
                <textarea 
                  rows={4}
                  placeholder="¿En qué podemos ayudarte?"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>
              <Button className="w-full h-14 text-lg gap-2 shadow-lg shadow-primary/20">
                <Send className="h-5 w-5" /> Enviar Mensaje
              </Button>
            </form>
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {[
                { icon: Mail, label: 'Email', value: 'soporte@ticketlive.com', color: 'blue' },
                { icon: Phone, label: 'Teléfono', value: '+54 11 0000-0000', color: 'green' },
                { icon: MapPin, label: 'Oficina', value: 'Av. Corrientes 1234, CABA', color: 'red' }
              ].map((item, i) => (
                <div key={i} className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/30 transition-all flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-500 group-hover:scale-110 transition-transform`}>
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.label}</p>
                    <p className="text-lg font-medium text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
