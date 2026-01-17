"use client";

import MapDemo from "@/components/ui/MapDemo";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { MapPin, ArrowLeft, Search } from "lucide-react";
import { useState } from "react";

export default function MapTestPage() {
  const [address, setAddress] = useState("Estadio River Plate, Buenos Aires");
  const [searchInput, setSearchInput] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setAddress(searchInput);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header de prueba */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <MapPin className="text-primary" /> Prototipo de Mapa
            </h1>
            <p className="text-muted-foreground">Esta es una implementación de prueba que puedes borrar cuando quieras.</p>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft size={16} /> Volver
            </Button>
          </Link>
        </div>

        {/* El Mapa */}
        <div className="bg-secondary/20 p-6 rounded-3xl border border-white/5 space-y-6">
          
          {/* Buscador de Prueba */}
          <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Escribe una dirección (ej: Estadio Santiago Bernabéu)..." 
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-hidden focus:ring-2 focus:ring-primary/50"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <Button type="submit" size="sm" className="rounded-xl">
              Ubicar
            </Button>
          </form>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-2 aspect-video min-h-[500px]">
               <MapDemo 
                 address={address} 
                 title="Resultado de búsqueda" 
               />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Detalles de integración</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex gap-2">✅ Librería: MapLibre GL</li>
                <li className="flex gap-2">✅ Estilo: Streets V2 Dark (Premium)</li>
                <li className="flex gap-2">✅ Marcador dinámico con Popup</li>
                <li className="flex gap-2">✅ Aislado del sistema principal</li>
              </ul>
              <div className="p-4 bg-primary/10 rounded-xl border border-primary/20 text-xs text-primary-foreground">
                <strong>Nota:</strong> Si el mapa no carga, asegúrate de haber instalado la dependencia con `npm install maplibre-gl`.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
