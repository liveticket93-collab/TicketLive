"use client";

import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleProceedToPayment = () => {
    //TEMPORAL/ Luego esto se conecta a la pasarela de pagos cuando esté lista
    router.push("/checkout");
  };

  return (
    <section className="min-h-screen px-4 md:px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Tu carrito de compras
          </h1>

          {getItemCount() > 0 && (
            <span className="text-sm px-3 py-1 rounded-full bg-secondary text-muted-foreground">
              {getItemCount()} {getItemCount() === 1 ? "ticket" : "tickets"}
            </span>
          )}
        </div>

        {/* Carro Vacío */}
        {cartItems.length === 0 ? (
          <div className="rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 p-16 text-center">
            <p className="text-xl font-medium mb-2">
              Tu carrito está vacío
            </p>
            <p className="text-muted-foreground">
              Agrega tus eventos favoritos para comenzar tu experiencia
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-linear-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 shadow-2xl shadow-black/40 overflow-hidden">

            {/* Header */}
            <div className="hidden md:grid grid-cols-12 px-6 py-4 border-b border-white/5 text-sm text-muted-foreground">
              <div className="col-span-8">Evento</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Eliminar</div>
            </div>

            {/* Productos */}
            <div className="divide-y divide-white/5">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="grid grid-cols-1 md:grid-cols-12 gap-6 px-6 py-6 items-center"
                >
                  {/* Producto */}
                  <div className="md:col-span-8 flex gap-4 items-center">
                    <div className="w-28 h-28 rounded-xl bg-secondary flex items-center justify-center overflow-hidden">
                      {item.image ? (
                        // <Image
                        //   src={item.image}
                        //   alt={item.name}
                        //   width={112}
                        //   height={112}
                        //   className="object-contain"
                        // />

                        //Quitar esto cuando se deje de usar el mock:
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-28 h-28 object-contain"
                        />

                      ) : (
                        <span className="text-muted-foreground text-sm">
                          Sin imagen
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {item.description}
                        </p>
                      )}

                      {/* Controles de cantidad */}
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition"
                        >
                          −
                        </button>

                        <span className="font-semibold text-white">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-8 h-8 rounded-lg bg-secondary text-white hover:bg-secondary/80 transition"
                        >
                          +
                        </button>
                      </div>
                    </div>







                  </div>

                  {/* Price */}
                  <div className="md:col-span-2 text-center font-semibold text-primary">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>

                  {/* Remove */}
                  <div className="md:col-span-2 text-center">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
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
                  className="px-4 py-2 rounded-lg bg-secondary text-muted-foreground hover:bg-secondary/80 transition"
                >
                  Limpiar carrito
                </button>

                {!isLoggedIn ? (
                  <Link
                    href="/login"
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium shadow-lg shadow-purple-500/40"
                  >
                    Inicia sesión
                  </Link>
                ) : (
                  <button
                    onClick={handleProceedToPayment}
                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium shadow-lg shadow-purple-500/40"
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
