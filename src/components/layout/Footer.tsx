import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Ticket } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <Ticket className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">TicketLive</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Vive los mejores eventos en vivo. Entradas seguras, recintos de
              primera y recuerdos inolvidables.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Descubre</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/events?category=4610649a-e216-41a3-b74a-f6c9e7b9dff0" className="hover:text-primary transition-colors">
                  Conciertos
                </Link>
              </li>
              <li>
                <Link href="/events?category=9383b546-1bc8-4eda-aa6f-9485a117d707" className="hover:text-primary transition-colors">
                  Deportes
                </Link>
              </li>
              <li>
                <Link href="/events?category=5baf662c-60ca-4447-8c68-fa1b9f7746e6" className="hover:text-primary transition-colors">
                  Festivales
                </Link>
              </li>
              <li>
                <Link href="/events?category=c4b68897-2c1d-4037-923f-93f96d723d6f" className="hover:text-primary transition-colors">
                  Teatro
                </Link>
              </li>
              <li>
                <Link href="/events?category=45d8d4f9-a51a-4a1b-bee2-170d1ba44fe8" className="hover:text-primary transition-colors">
                  Conferencias
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Testimonios
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Promociones
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Ayuda</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="/help-center" className="hover:text-primary transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-primary transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-primary transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition-colors">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Conéctate</h4>
            <div className="space-y-6">
              <div className="flex gap-4">
                <Link
                  href="https://instagram.com/ticketlive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-primary transition-all text-muted-foreground hover:text-white"
                >
                  <Image
                    src="/icons/instagram.svg"
                    alt="Instagram"
                    width={18}
                    height={18}
                  />
                </Link>
                <Link
                  href="https://facebook.com/ticketlive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-primary transition-all text-muted-foreground hover:text-white"
                >
                  <Image
                    src="/icons/facebook.svg"
                    alt="Facebook"
                    width={18}
                    height={18}
                  />
                </Link>
                <Link
                  href="https://x.com/ticketlive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-800 hover:bg-primary transition-all text-muted-foreground hover:text-white"
                >
                  <Image
                    src="/icons/x.svg"
                    alt="x"
                    width={18}
                    height={18}
                  />
                </Link>
              </div>

              <Link 
                href="https://wa.me/541100000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-3xl bg-zinc-900 border border-white/5 hover:border-green-500/30 transition-all cursor-pointer group hover:scale-[1.02] active:scale-95 shadow-lg"
              >
                  <div className="h-10 w-10 flex items-center justify-center rounded-full bg-green-500/20 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all duration-300">
                      <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider leading-none mb-1">Soporte 24/7</p>
                    <p className="text-sm font-bold text-white group-hover:text-green-500 transition-colors">WhatsApp Oficial</p>
                  </div>
              </Link>
            </div>
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
