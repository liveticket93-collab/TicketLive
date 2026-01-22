import { CreditCard, Receipt, Wallet, ShieldCheck, HelpCircle, ChevronRight, BadgePercent, Clock } from "lucide-react";
import Link from "next/link";

export default function PaymentsPage() {
  const sections = [
    {
      title: "Métodos de Pago",
      description: "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, Amex), Mercado Pago y transferencias bancarias.",
      icon: <CreditCard className="w-8 h-8 text-primary" />,
      color: "from-violet-500/20 to-fuchsia-500/20"
    },
    {
      title: "Facturación y Recibos",
      description: "Una vez completada la compra, recibirás tu factura electrónica automáticamente por email y en tu panel de usuario.",
      icon: <Receipt className="w-8 h-8 text-blue-500" />,
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Transacciones Seguras",
      description: "Toda tu información está protegida con encriptación SSL de 256 bits y certificaciones PCI-DSS Nivel 1.",
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Cuotas y Promociones",
      description: "Verifica las promociones vigentes con tu banco. Ofrecemos planes de cuotas sin interés en eventos seleccionados.",
      icon: <BadgePercent className="w-8 h-8 text-amber-500" />,
      color: "from-amber-500/20 to-yellow-500/20"
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] -z-10 rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] -z-10 rounded-full" />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6">
              <Wallet className="w-4 h-4" />
              <span className="text-[10px] font-black tracking-widest uppercase">Pagos Blindados</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-white via-white to-white/40 bg-clip-text text-transparent italic">
              Compras y <br /> <span className="text-primary not-italic">Pagos</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Gestiona tus compras con total seguridad y transparencia. Resolvemos todas tus dudas sobre transacciones y facturación.
            </p>
          </div>

          {/* Grid de Secciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
            {sections.map((section, index) => (
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

          {/* Tips Box */}
          <div className="p-10 md:p-14 rounded-[3rem] bg-gradient-to-b from-zinc-900/80 to-zinc-900/20 border border-white/5 backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Clock className="text-primary w-8 h-8" />
              Tiempos de Confirmación
            </h2>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-6">
              <p>
                La confirmación de tu compra suele ser instantánea. Sin embargo, en algunos casos puede tardar unos minutos dependiendo de la validación bancaria.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 p-8 rounded-2xl bg-black/40 border border-white/5">
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-primary" /> 
                    ¿Compra rechazada?
                  </h4>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>Verifica el límite de tu tarjeta</li>
                    <li>Asegúrate de tener el código CVV correcto</li>
                    <li>Confirma si el banco requiere autorización</li>
                    <li>Intenta con otro medio de pago</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    Consejos de Seguridad
                  </h4>
                  <ul className="text-sm space-y-2 list-disc list-inside">
                    <li>No compartas tus datos de tarjeta</li>
                    <li>Usa conexiones seguras (evita Wi-Fi público)</li>
                    <li>Mantén tu app bancaria actualizada</li>
                    <li>Revisa siempre el monto final antes de pagar</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="mt-12 flex justify-between items-center text-sm font-medium pt-8 border-t border-white/5">
              <span className="text-muted-foreground">Última actualización: Enero 2026</span>
              <Link href="/contact" className="text-primary hover:underline flex items-center gap-1 font-bold">
                Necesito ayuda personalizada <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="text-muted-foreground mb-6">¿Buscas tus entradas compradas?</p>
            <Link 
              href="/dashboard" 
              className="inline-flex items-center gap-2 text-primary hover:text-white font-bold transition-all group"
            >
              Ir a Mis Compras <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
