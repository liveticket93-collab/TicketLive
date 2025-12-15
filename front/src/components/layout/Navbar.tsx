// import Link from 'next/link';
// import { Button } from '@/components/ui/Button';
// import { Ticket, Search } from 'lucide-react';

// export function Navbar() {
//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-background/60 backdrop-blur-xl">
//       <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-6">
//         <Link href="/" className="flex items-center gap-2 group">
//           <div className="rounded-lg bg-primary/20 p-2 transition-colors group-hover:bg-primary/30">
//             <Ticket className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
//           </div>
//           <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">TicketLive</span>
//         </Link>
        
//         <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
//           <Link href="#" className="hover:text-white transition-colors">Conciertos</Link>
//           <Link href="#" className="hover:text-white transition-colors">Deportes</Link>
//           <Link href="#" className="hover:text-white transition-colors">Teatro</Link>
//           <Link href="#" className="hover:text-white transition-colors">Festivales</Link>
//         </div>

//         <div className="flex items-center gap-4">
//           <button className="text-muted-foreground hover:text-white transition-colors">
//             <Search className="h-5 w-5" />
//           </button>
//           <div className="hidden sm:flex gap-3">
//              <Button variant="ghost" size="sm" className="hidden lg:inline-flex">Iniciar sesión</Button>
//              <Button size="sm">Comenzar</Button>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }
