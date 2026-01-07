"use client";
import LoginForm from "@/components/forms/LoginForm";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, isLoading, router]);


  if (isLoading || isLoggedIn) {
    return null; 
  }

  return (
    <div className="flex flex-col w-screen items-center justify-center px-4">
      <h1 className="mt-5 mb-5 text-2xl font-bold">Inicia sesión en tu cuenta de TicketLive</h1>
      <h2 className="text-xl mb-5 font-bold text-gray-500">Accede a tus eventos, boletos y compras </h2>
      <LoginForm />
      <h3 className="text-lg mb-9"> ¿Aún no tienes una cuenta?{" "}
        <Link href="/register" className="text-blue-600 hover:underline">
          Crea tu cuenta
        </Link>
      </h3>
    </div>
  );
}
