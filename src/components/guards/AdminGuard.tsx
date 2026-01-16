"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Si no está autenticado, redirigir a login
      if (!isAuthenticated) {
        router.push("/login");
        return;
      }

      // Si está autenticado pero NO es admin, redirigir a home
      if (!user?.isAdmin) {
        router.push("/");
        return;
      }
    }
  }, [user, loading, isAuthenticated, router]);

  // Mostrar loading mientras verifica
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  // Si no es admin, no mostrar nada (ya se redirigió)
  if (!user?.isAdmin) {
    return null;
  }

  // Si es admin, mostrar el contenido
  return <>{children}</>;
}