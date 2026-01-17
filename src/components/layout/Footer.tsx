import Link from "next/link";
import { Ticket, Instagram, Facebook, Twitter, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group">
              <Ticket className="h-6 w-6 text-primary group-hover:rotate-12 transition-transform" />
              <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">TicketLive</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vive los mejores eventos en vivo. Entradas seguras, recintos de
              primera y recuerdos inolvidables.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Descubre</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/como-funciona" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Cómo funciona
                </Link>
              </li>
              <li>
                <Link href="/events?q=concierto" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Conciertos
                </Link>
              </li>
              <li>
                <Link href="/events?q=deporte" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Deportes
                </Link>
              </li>
              <li>
                <Link href="/events?q=festival" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Festivales
                </Link>
              </li>
              <li>
                <Link href="/events?q=teatro" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Teatro
                </Link>
              </li>
              <li>
                <Link href="/events?q=conferencia" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Conferencias
                </Link>
              </li>
              <li>
                <Link href="/testimonios" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link href="/promociones" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Promociones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Ayuda</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/faq" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-all hover:translate-x-1 inline-block">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6 text-white">Conéctate</h4>
            <div className="flex gap-4 mb-8">
              <Link
                href="https://instagram.com/ticketlive"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] text-muted-foreground"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://facebook.com/ticketlive"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] text-muted-foreground"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link
                href="https://twitter.com/ticketlive"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-all hover:scale-110 hover:shadow-[0_0_15px_rgba(var(--primary),0.5)] text-muted-foreground"
              >
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
            <Link 
              href="https://wa.me/5491100000000" 
              className="group flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/50 transition-all hover:bg-primary/5"
            >
              <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
                 <MessageCircle className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">Soporte 24/7</span>
                <span className="text-sm font-medium text-white">WhatsApp Oficial</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} TicketLive. Todos los derechos
          reservados.
        </div>
      </div>
    </footer>
  );
}

