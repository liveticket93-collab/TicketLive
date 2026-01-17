export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen pt-20 pb-16 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background z-0" />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
          ¿Cómo funciona <span className="text-primary">TicketLive?</span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto italic">
          Estamos preparando los mejores tutoriales y guías para ti. <br />
          Vuelve pronto para descubrir la experiencia TicketLive completa.
        </p>
        
        <div className="mt-12 w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto blur-[1px]" />
      </div>
    </main>
  );
}
