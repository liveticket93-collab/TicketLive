// app/(auth)/reset-password/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, Check, X, Loader2, KeyRound, AlertCircle } from "lucide-react";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [token, setToken] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [tokenError, setTokenError] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  });

  useEffect(() => {
    const urlToken = searchParams.get("token");
    
    if (urlToken) {
      setToken(urlToken);
    } else {
      setTokenError(true);
      toast.error("Token no encontrado. Solicita un nuevo enlace de recuperación.");
    }
  }, [searchParams]);

  const validatePasswordStrength = (password: string) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    });
  };

  const handlePasswordChange = (value: string) => {
    setFormData({ ...formData, newPassword: value });
    validatePasswordStrength(value);
  };

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token inválido");
      return;
    }

    if (!isPasswordValid()) {
      toast.error("La contraseña no cumple los requisitos");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/reset-password`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast.success("¡Contraseña restablecida exitosamente!");
      } else {
        toast.error(data.message || "Error al restablecer contraseña");
        if (data.message?.includes("inválido") || data.message?.includes("expirado")) {
          setTokenError(true);
        }
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Error de conexión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = (field: keyof typeof showPasswords) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="bg-zinc-900/50 rounded-2xl border border-red-500/30 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Enlace Inválido o Expirado
              </h2>
              <p className="text-gray-300 mb-6">
                El enlace que usaste no es válido o ya expiró. Los enlaces de recuperación expiran después de 15 minutos.
              </p>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
                >
                  Solicitar Nuevo Enlace
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-medium transition-all"
                >
                  Volver al Login
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full">
          <div className="bg-zinc-900/50 rounded-2xl border border-green-500/30 p-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-3">
                ¡Contraseña Restablecida!
              </h2>
              <p className="text-gray-300 mb-6">
                Tu contraseña ha sido actualizada exitosamente. Ya puedes iniciar sesión con tu nueva contraseña.
              </p>

              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all"
              >
                Ir al Login
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center">
              <KeyRound className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Nueva Contraseña</h1>
              <p className="text-sm text-gray-400">Crea una contraseña segura</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Ingresa tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("new")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Strength Indicators */}
              {formData.newPassword && (
                <div className="mt-3 space-y-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                  <p className="text-xs font-medium text-gray-400 mb-2">Requisitos:</p>
                  <PasswordRequirement met={passwordStrength.hasLength} text="Mínimo 8 caracteres" />
                  <PasswordRequirement met={passwordStrength.hasLower} text="Una letra minúscula" />
                  <PasswordRequirement met={passwordStrength.hasUpper} text="Una letra mayúscula" />
                  <PasswordRequirement met={passwordStrength.hasNumber} text="Un número" />
                  <PasswordRequirement met={passwordStrength.hasSpecial} text="Un carácter especial (!@#$%^&*)" />
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
                  placeholder="Confirma tu nueva contraseña"
                />
                <button
                  type="button"
                  onClick={() => togglePassword("confirm")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Match indicator */}
              {formData.confirmPassword && (
                <div className="mt-2">
                  {formData.newPassword === formData.confirmPassword ? (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Las contraseñas coinciden
                    </p>
                  ) : (
                    <p className="text-xs text-red-400 flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Las contraseñas no coinciden
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isPasswordValid() || formData.newPassword !== formData.confirmPassword}
              className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Restableciendo...
                </span>
              ) : (
                "Restablecer Contraseña"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordRequirement({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <X className="w-4 h-4 text-gray-600" />
      )}
      <span className={`text-xs ${met ? "text-green-400" : "text-gray-500"}`}>
        {text}
      </span>
    </div>
  );
}