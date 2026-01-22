"use client";

import { useTickets } from "@/contexts/TIcketsContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Ticket, Download } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MisBoletosPage() {
  const { getCompletedOrders } = useTickets();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const completedOrders = getCompletedOrders();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  if (completedOrders.length === 0) {
    return (
      <section className="min-h-screen px-4 md:px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-8">Mis Boletos 🎫</h1>

          <div className="rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 p-16 text-center">
            <div className="w-24 h-24 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Ticket className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">
              No tienes boletos aún
            </h2>
            <p className="text-gray-400 mb-8">
              Explora eventos increíbles y compra tus primeros boletos
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
            <h1 className="text-4xl font-bold text-white mb-2">Mis Boletos 🎫</h1>
            <p className="text-gray-400">
              {completedOrders.length}{" "}
              {completedOrders.length === 1 ? "compra realizada" : "compras realizadas"}
            </p>
          </div>
        </div>

        {/* Lista de órdenes */}
        <div className="space-y-6">
          {completedOrders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 overflow-hidden"
            >
              {/* Header de la orden */}
              <div className="bg-zinc-900/50 px-6 py-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400">Orden #{order.id.slice(-8)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(order.date).toLocaleDateString("es-ES", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      Confirmado
                    </div>
                    {order.couponCode && (
                      <p className="text-xs text-purple-400 mt-2">
                        Cupón aplicado: {order.couponCode}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Items de la orden */}
              <div className="divide-y divide-white/5">
                {order.items.map((item, index) => (
                  <div key={index} className="p-6">
                    <div className="flex gap-4">
                      {/* Imagen del evento */}
                      <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                        <Image
                          src={item.eventImage}
                          alt={item.eventTitle}
                          fill
                          className="object-cover"
                          sizes="128px"
                        />
                      </div>

                      {/* Info del evento */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          {item.eventTitle}
                        </h3>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(item.eventDate).toLocaleDateString("es-ES", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <MapPin className="w-4 h-4" />
                            <span>{item.eventLocation}</span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Ticket className="w-4 h-4" />
                            <span>
                              {item.quantity} {item.quantity === 1 ? "boleto" : "boletos"}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-gray-400">Precio por boleto</p>
                            <p className="text-lg font-bold text-purple-400">
                              ${Number(item.unitPrice).toFixed(2)} {/* ✅ Convertir a número */}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-400">Subtotal</p>
                            <p className="text-lg font-bold text-white">
                              ${(item.quantity * Number(item.unitPrice)).toFixed(2)} {/* ✅ Convertir a número */}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Acciones */}
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            // Aquí podrías generar un PDF o algo similar
                            alert("Función de descarga próximamente");
                          }}
                          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Descargar
                        </button>
                        <Link
                          href={`/events/${item.eventId}`}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors text-center"
                        >
                          Ver evento
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer con totales */}
              <div className="bg-zinc-900/50 px-6 py-4 border-t border-white/5">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-400">
                    <p>Método de pago: {order.paymentMethod}</p>
                  </div>
                  <div className="text-right space-y-1">
                    {order.discount > 0 && (
                      <p className="text-sm text-green-400">
                        Descuento: -${Number(order.discount).toFixed(2)}
                      </p>
                    )}
                    <p className="text-2xl font-bold text-white">
                      Total: ${Number(order.total).toFixed(2)}
                    </p>
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