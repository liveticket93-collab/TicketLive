"use client";

import { useFavorites } from "@/contexts/FavoritesContext";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function FavoritosPage() {
  const { favorites, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleAddToCart = (event: any) => {
    addToCart(event);
  };

  if (favorites.length === 0) {
    return (
      <section className="min-h-screen px-4 md:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">
            Mis Favoritos ❤️
          </h1>

          <div className="rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 p-16 text-center">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">💔</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No tienes favoritos aún
            </h2>
            <p className="text-gray-400 mb-8">
              Explora eventos y guarda tus favoritos para verlos después
            </p>
            <Link
              href="/events"
              className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all"
            >
              Explorar Eventos
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen px-4 md:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Mis Favoritos ❤️
            </h1>
            <p className="text-gray-400">
              {favorites.length} {favorites.length === 1 ? "evento guardado" : "eventos guardados"}
            </p>
          </div>
        </div>

        {/* Grid de eventos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((event) => (
            <div
              key={event.id}
              className="group relative bg-gradient-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 rounded-2xl overflow-hidden hover:ring-purple-500/50 transition-all"
            >
              {/* Imagen */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={event.imageUrl}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Botón de remover favorito */}
                <button
                  onClick={() => removeFromFavorites(event.id)}
                  className="absolute top-3 right-3 w-10 h-10 bg-red-500/90 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors z-10"
                  title="Remover de favoritos"
                >
                  <svg
                    className="w-5 h-5 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {/* Contenido */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-2">
                  {event.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>{new Date(event.date).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>

                {/* Precio y botones */}
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-xs text-gray-400">Precio</p>
                    <p className="text-2xl font-bold text-purple-400">
                      ${event.price}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`/events/${event.id}`}
                      className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
                    >
                      Ver
                    </Link>
                    <button
                      onClick={() => handleAddToCart(event)}
                      className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg text-sm font-medium transition-all"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}