"use client";

import { useEffect, useState } from "react";
import { useTickets } from "@/contexts/TIcketsContext";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";

export default function SuccessPage() {
  const { completeOrder, getOrderById } = useTickets();
  const { clearCart } = useCart();
  const router = useRouter();
  const [orderId, setOrderId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener el orderId pendiente
    const pendingOrderId = localStorage.getItem("pendingOrderId");
    
    if (pendingOrderId) {
      // Completar la orden
      completeOrder(pendingOrderId);
      setOrderId(pendingOrderId);
      
      // ⭐ Limpiar carrito SOLO en localStorage (no backend)
      localStorage.removeItem("cart");
      
      // Limpiar cupón aplicado
      localStorage.removeItem("appliedCoupon");
      localStorage.removeItem("pendingCoupon");
      
      // Limpiar orderId pendiente
      localStorage.removeItem("pendingOrderId");
      
      // Recargar para actualizar el estado del carrito
      window.dispatchEvent(new Event('storage'));
    }
    
    setLoading(false);
  }, [completeOrder]);

  const order = orderId ? getOrderById(orderId) : null;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            No se encontró la orden
          </h1>
          <p className="text-gray-400 mb-8">
            No pudimos encontrar información de tu compra
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen px-4 md:px-6 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircle className="w-16 h-16 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            ¡Pago Exitoso! 🎉
          </h1>
          <p className="text-xl text-gray-400">
            Tu compra ha sido confirmada
          </p>
        </div>

        {/* Order Details */}
        <div className="rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 overflow-hidden mb-6">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                Confirmado
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-white">{item.eventTitle}</p>
                  <p className="text-sm text-gray-400">
                    {item.quantity} {item.quantity === 1 ? "boleto" : "boletos"} × $
                    {Number(item.unitPrice).toFixed(2)} {/* ✅ Convertir a número */}
                  </p>
                </div>
                <p className="font-bold text-white">
                  ${(item.quantity * Number(item.unitPrice)).toFixed(2)} {/* ✅ Convertir a número */}
                </p>
              </div>
            ))}

            <div className="border-t border-white/5 pt-4 space-y-2">
              {order.discount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Descuento ({order.couponCode}):</span>
                  <span>-${Number(order.discount).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-xl font-bold text-white">
                <span>Total pagado:</span>
                <span>${Number(order.total).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-6 mb-8">
          <p className="text-blue-300 text-sm">
            ℹ️ Se ha enviado un email de confirmación a tu correo electrónico con todos los
            detalles de tu compra. Puedes ver tus boletos en cualquier momento desde tu
            perfil.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/mis-boletos"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2"
          >
            Ver mis boletos
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button
            onClick={() => {
              alert("Función de descarga próximamente");
            }}
            className="flex-1 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Descargar boletos
          </button>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/"
            className="text-purple-400 hover:text-purple-300 transition-colors"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}