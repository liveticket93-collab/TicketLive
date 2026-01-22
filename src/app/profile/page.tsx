"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { User, Mail, Settings } from "lucide-react";
import ChangePasswordForm from "@/components/profile/ChangePasswordForm";

export default function ProfilePage() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !user) {
    return null;
  }

  return (
    <section className="min-h-screen px-4 md:px-6 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Mi Perfil</h1>
          <p className="text-gray-400">Gestiona tu información personal y configuración de seguridad</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Información del Usuario */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-gradient-to-b from-slate-900/70 to-slate-950/70 ring-1 ring-white/10 p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-white text-center">{user.name || "Usuario"}</h2>
                <p className="text-sm text-gray-400 text-center mt-1">{user.email}</p>
              </div>

              {/* Información */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="text-sm text-white">{user.name || "No especificado"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm text-white break-all">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-zinc-900/50">
                  <Settings className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-500">ID</p>
                    <p className="text-sm text-white font-mono">#{user.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario de Cambio de Contraseña */}
          <div className="lg:col-span-2">
            <ChangePasswordForm />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6 rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
          <p className="text-sm text-blue-300">
            💡 <strong>Consejo de seguridad:</strong> Te recomendamos cambiar tu contraseña cada 3 meses y usar una contraseña única que no uses en otros sitios.
          </p>
        </div>
      </div>
    </section>
  );
}