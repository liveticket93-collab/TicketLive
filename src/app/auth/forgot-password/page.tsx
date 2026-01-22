// app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Clock, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [cooldownMinutes, setCooldownMinutes] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error("Ingresa tu email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Ingresa un email válido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/request-password-reset`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        const message = data.message || "Error al solicitar recuperación";
        toast.error(message);

        // Detectar cooldown
        const match = message.match(/(\d+)\s*minuto/i);
        if (match) {
          setCooldownMinutes(parseInt(match[1]));
        }
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="bg-zinc-900/50 rounded-2xl border border-green-500/30 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                ¡Email Enviado!
              </h2>
              <p className="text-gray-300 mb-6">
                Si el email existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña.
              </p>

              <div className="space-y-3 mb-6">
                <div className="bg-zinc-800/50 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-2">📧 Revisa tu bandeja de entrada</p>
                  <p className="text-xs text-gray-500">
                    El email puede tardar unos minutos en llegar
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-2">📁 Revisa spam o promociones</p>
                  <p className="text-xs text-gray-500">
                    A veces los emails automáticos llegan ahí
                  </p>
                </div>
                <div className="bg-zinc-800/50 rounded-lg p-4 text-left">
                  <p className="text-sm text-gray-400 mb-2">⏱️ El enlace expira en 15 minutos</p>
                  <p className="text-xs text-gray-500">
                    Úsalo pronto para mayor seguridad
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
              >
                Volver al Login
              </button>

              <button
                type="button"
                onClick={() => {
                  setSuccess(false);
                  setEmail("");
                }}
                className="w-full mt-3 text-sm text-gray-400 hover:text-white transition-colors"
              >
                ¿No recibiste el email? Intentar de nuevo
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full">
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-700 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-purple-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              ¿Olvidaste tu contraseña?
            </h1>
            <p className="text-sm text-gray-400">
              Ingresa tu email y te enviaremos un enlace para recuperarla
            </p>
          </div>

          {/* Cooldown Warning */}
          {cooldownMinutes && (
            <div className="mb-6 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-orange-400">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  Podrás intentar de nuevo en {cooldownMinutes} minuto{cooldownMinutes !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="tu@email.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </span>
              ) : (
                "Enviar Enlace de Recuperación"
              )}
            </button>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Login
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <p className="text-xs text-gray-400 text-center">
              💡 El enlace de recuperación expirará en 15 minutos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}