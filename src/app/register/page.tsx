import RegisterForm from "@/components/forms/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col w-screen items-center justify-center px-4">
      <h1 className="mt-5 mb-5 text-2xl font-bold">Crea tu cuenta de TicketLive</h1>
      <h2 className="text-xl mb-5 font-bold text-gray-500 text-center">
        Descubre eventos y recibe alertas de tus artistas favoritos. Además descarga tus boletos de forma rápida y segura.
      </h2>
      <h3 className="text-lg mb-9">
        ¿Ya tienes una cuenta de TicketLive?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Ingresa
        </Link>
      </h3>
      <RegisterForm />
    </div>
  );
}
