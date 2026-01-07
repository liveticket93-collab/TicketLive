"use client";

import { concertsMock } from "@/mocks/concerts.mock";
import { useCart } from "@/contexts/CartContext";

export default function MockCartPage() {
  const { addToCart } = useCart();

  return (
    <section className="min-h-screen px-4 md:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">
          Mock de Eventos para probar el flujo del carrito
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {concertsMock.map(concert => (
            <div
              key={concert.id}
              className="rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 shadow-xl p-6 flex flex-col"
            >
              {/* IMAGEN */}
              <div className="w-full h-48 mb-4 rounded-xl overflow-hidden bg-secondary">
                <img
                  src={concert.image}
                  alt={concert.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* INFORMACIÓN */}
              <div className="mb-4">
                <h2 className="text-lg font-semibold">
                  {concert.name}
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  {concert.description}
                </p>
              </div>

              {/* ACCIONES */}
              <div className="mt-auto flex items-center justify-between">
                <span className="text-xl font-bold text-primary">
                  ${concert.price.toFixed(2)}
                </span>

                <button
                  onClick={() => addToCart(concert)}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg shadow-purple-500/40 hover:from-purple-700 hover:to-pink-700 transition"
                >
                  Agregar al carrito
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
