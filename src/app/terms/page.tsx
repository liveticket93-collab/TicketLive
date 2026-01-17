import { Shield, FileText, Scale, Lock } from "lucide-react";

export default function TermsPage() {
  const sections = [
    {
      title: "1. Aceptación de los Términos",
      content: "Al acceder y utilizar TicketLive, aceptas estar obligado por estos términos y condiciones. Si no estás de acuerdo con alguna parte, no deberías utilizar nuestro servicio."
    },
    {
      title: "2. Compra de Entradas",
      content: "Todas las ventas son finales. Las entradas son digitales y se enviarán al correo electrónico registrado. TicketLive actúa como intermediario entre el organizador y el comprador."
    },
    {
      title: "3. Responsabilidades del Usuario",
      content: "Eres responsable de mantener la confidencialidad de tu cuenta y de todas las actividades que ocurran bajo ella. No se permite el uso de bots para la compra masiva de entradas."
    },
    {
      title: "4. Cancelaciones y Reembolsos",
      content: "Los reembolsos están sujetos a la política de cada organizador. En caso de cancelación de un evento, TicketLive gestionará la devolución del importe según las instrucciones del promotor."
    },
    {
      title: "5. Propiedad Intelectual",
      content: "Todo el contenido, marcas y logos en TicketLive están protegidos por derechos de autor y son propiedad exclusiva de la empresa o sus licenciantes."
    }
  ];

  return (
    <main className="min-h-screen pt-20 pb-16 relative overflow-hidden">
      {/* Fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-background to-background z-0" />

      <div className="container relative z-10 mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary/10 text-primary mb-6">
              <Scale className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
              Términos de <span className="text-primary">Servicio</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Última actualización: 17 de enero de 2026
            </p>
          </div>

          <div className="space-y-8">
            {sections.map((section, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
                <h2 className="text-xl font-semibold mb-4 text-white flex items-center gap-3">
                  <span className="text-primary/50 font-mono">#</span> {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 text-center">
            <p className="text-white font-medium">¿Tienes dudas legales?</p>
            <p className="text-sm text-muted-foreground mt-2">Envíanos un correo a legal@ticketlive.com</p>
          </div>
        </div>
      </div>
    </main>
  );
}
