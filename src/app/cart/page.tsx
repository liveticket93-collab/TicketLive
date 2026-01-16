"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { checkoutPayment } from "@/services/payment.service";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    getItemCount,
    getTotal,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const { isLoggedIn } = useAuth();

  const handleProceedToPayment = async () => {
    try {
      const checkoutUrl = await checkoutPayment();
      window.location.href = checkoutUrl;
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("No se pudo iniciar el pago");
      }
    }
  };

  return (
    <section className="min-h-screen px-4 md:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Carrito de compras
          </h1>
          {getItemCount() > 0 && (
            <span className="text-sm px-3 py-1 rounded-full bg-secondary text-muted-foreground">
              {getItemCount()} {getItemCount() === 1 ? "ticket" : "tickets"}
            </span>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 p-16 text-center">
            <p className="text-xl font-medium mb-2">Tu carrito está vacío</p>
            <p className="text-muted-foreground">
              Agrega tus eventos favoritos para comenzar tu experiencia
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 shadow-2xl shadow-black/40 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 px-6 py-4 border-b border-white/5 text-sm text-muted-foreground">
              <div className="col-span-8">Evento</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Eliminar</div>
            </div>

            <div className="divide-y divide-white/5">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 py-6 items-center"
                >

                  <div className="md:col-span-8 flex gap-4 items-center">
                    <div className="relative w-40 h-24 rounded-xl overflow-hidden bg-secondary">
                      <Image
                        src={item.event.imageUrl}
                        alt={item.event.title}
                        fill
                        className="object-cover"
                        sizes="160px"
                      />
                    </div>

                    <div>
                      <h3 className="font-semibold text-white">
                        {item.event.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {item.event.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() =>
                            decreaseQuantity(item.event.id)
                          }
                          className="w-8 h-8 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition cursor-pointer"
                        >
                          −
                        </button>
                        <span className="font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            increaseQuantity(item.event.id)
                          }
                          className="w-8 h-8 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition cursor-pointer"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2 text-center font-semibold text-primary">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </div>

                  <div className="md:col-span-2 text-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total de la orden
                </p>
                <p className="text-2xl font-bold text-primary">
                  ${getTotal().toFixed(2)}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 transition cursor-pointer"
                >
                  Limpiar carrito
                </button>

                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="px-6 py-3 rounded-lg bg-linear-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg shadow-purple-500/40 cursor-pointer hover:scale-105 active:scale-95"
                  >
                    Inicia sesión
                  </Link>
                ) : (
                  <button
                    onClick={handleProceedToPayment}
                    className="form-button cursor-pointer"
                  >
                    Procesar la compra
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
