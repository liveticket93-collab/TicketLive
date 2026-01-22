// components/profile/ChangePasswordForm.tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, Check, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function ChangePasswordForm() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [passwordStrength, setPasswordStrength] = useState({
    hasLength: false,
    hasLower: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  });

  const validatePasswordStrength = (password: string) => {
    setPasswordStrength({
      hasLength: password.length >= 8,
      hasLower: /[a-z]/.test(password),
      hasUpper: /[A-Z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[!@#$%^&*]/.test(password),
    });
  };

  const handleNewPasswordChange = (value: string) => {
    setNewPassword(value);
    validatePasswordStrength(value);
  };

  const isPasswordValid = () => {
    return Object.values(passwordStrength).every(Boolean);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Debes estar logueado");
      return;
    }

    // Validaciones
    if (!currentPassword) {
      toast.error("Ingresa tu contraseña actual");
      return;
    }

    if (!isPasswordValid()) {
      toast.error("La nueva contraseña no cumple con los requisitos");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("La nueva contraseña debe ser diferente a la actual");
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ CORRECTO: /auth/change-password con método POST
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al cambiar contraseña");
      }

      toast.success("¡Contraseña cambiada exitosamente! 🎉");

      // Limpiar formulario
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordStrength({
        hasLength: false,
        hasLower: false,
        hasUpper: false,
        hasNumber: false,
        hasSpecial: false,
      });
    } catch (error: any) {
      const errorMessage = error.message || "Error al cambiar contraseña";
      
      // Manejar cooldown específicamente
      if (errorMessage.includes("esperar") || errorMessage.includes("hora")) {
        toast.error(errorMessage, { duration: 6000 });
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
          <Lock className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Cambiar Contraseña</h2>
          <p className="text-sm text-gray-400">Actualiza tu contraseña de forma segura</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contraseña Actual */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contraseña Actual
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Ingresa tu contraseña actual"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Nueva Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => handleNewPasswordChange(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Ingresa tu nueva contraseña"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Requisitos de contraseña */}
          {newPassword && (
            <div className="mt-3 space-y-2 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
              <p className="text-xs font-medium text-gray-400 mb-2">Requisitos:</p>
              <RequirementItem
                met={passwordStrength.hasLength}
                text="Mínimo 8 caracteres"
              />
              <RequirementItem
                met={passwordStrength.hasUpper}
                text="Al menos 1 mayúscula"
              />
              <RequirementItem
                met={passwordStrength.hasLower}
                text="Al menos 1 minúscula"
              />
              <RequirementItem
                met={passwordStrength.hasNumber}
                text="Al menos 1 número"
              />
              <RequirementItem
                met={passwordStrength.hasSpecial}
                text="Al menos 1 carácter especial (!@#$%^&*)"
              />
            </div>
          )}
        </div>

        {/* Confirmar Contraseña */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confirmar Nueva Contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-zinc-900 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="Confirma tu nueva contraseña"
              disabled={isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          {/* Indicador de coincidencia */}
          {confirmPassword && (
            <div className="mt-2 flex items-center gap-2">
              {newPassword === confirmPassword ? (
                <>
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-sm text-green-400">Las contraseñas coinciden</span>
                </>
              ) : (
                <>
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-sm text-red-400">Las contraseñas no coinciden</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          disabled={
            isSubmitting ||
            !isPasswordValid() ||
            newPassword !== confirmPassword ||
            !currentPassword
          }
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
        >
          {isSubmitting ? "Cambiando contraseña..." : "Cambiar Contraseña"}
        </button>
      </form>
    </div>
  );
}

// Componente auxiliar para mostrar requisitos
function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className="flex items-center gap-2">
      {met ? (
        <Check className="w-4 h-4 text-green-400" />
      ) : (
        <X className="w-4 h-4 text-gray-500" />
      )}
      <span className={`text-sm ${met ? "text-green-400" : "text-gray-500"}`}>
        {text}
      </span>
    </div>
  );
}