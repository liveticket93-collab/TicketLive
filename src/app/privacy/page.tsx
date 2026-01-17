import { Lock, Eye, Database, ShieldCheck } from "lucide-react";

export default function PrivacyPage() {
  const policies = [
    {
      icon: Eye,
      title: "Recopilación de Datos",
      content: "Recopilamos información personal básica como tu nombre, email y teléfono únicamente para procesar tus compras y garantizar tu acceso a los eventos."
    },
    {
      icon: Database,
      title: "Uso de la Información",
      content: "Tus datos se utilizan para la emisión de e-tickets, comunicaciones sobre cambios en eventos y seguridad de las transacciones."
    },
    {
      icon: Lock,
      title: "Seguridad de Datos",
      content: "Utilizamos protocolos de seguridad líderes en la industria para proteger tu información contra acceso no autorizado, alteración o divulgación."
    },
    {
      icon: ShieldCheck,
      title: "Tus Derechos",
      content: "Tienes derecho a acceder, rectificar o eliminar tus datos personales en cualquier momento a través de la configuración de tu cuenta."
    }
  ];

  return (
    <main className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6">
              <Lock className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Política de <span className="text-primary">Privacidad</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Tu privacidad y seguridad son nuestra máxima prioridad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policies.map((policy, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl group hover:border-primary/30 transition-all">
                <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <policy.icon className="h-6 w-6" />
                </div>
                <h2 className="text-xl font-semibold mb-4 text-white">{policy.title}</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {policy.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-4">Compromiso TicketLive</h2>
              <p className="text-muted-foreground text-lg italic">
                "Nunca venderemos tus datos a terceros. Los datos que nos confías son utilizados únicamente para mejorar tu experiencia como fan de los mejores eventos."
              </p>
            </div>
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </main>
  );
}
