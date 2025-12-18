import Link from "next/link";
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
                <Link href="#" className="hover:text-primary transition-colors">
                  Conciertos
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Festivales
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Deportes
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Teatro
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Ayuda</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Centro de ayuda
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Términos de servicio
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Contáctanos
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-6">Conéctate</h4>
            <div className="flex gap-4">
              <Link
                href="#"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-all text-muted-foreground"
              >
                <Image
                  src="/icons/instagram.svg"
                  alt="Instagram"
                  width={20}
                  height={20}
                />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-all text-muted-foreground"
              >
                <Image
                  src="/icons/facebook.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
              </Link>
              <Link
                href="#"
                className="h-10 w-10 flex items-center justify-center rounded-full bg-secondary hover:bg-primary hover:text-white transition-all text-muted-foreground"
              >
                <Image
                  src="/icons/x.svg"
                  alt="x"
                  width={20}
                  height={20}
                />
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
