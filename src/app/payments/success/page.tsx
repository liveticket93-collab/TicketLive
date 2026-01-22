// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"checking" | "ok" | "error">("checking");

  useEffect(() => {
    const paymentId =
      searchParams.get("payment_id") ||
      searchParams.get("collection_id"); // sometimes MP uses this naming

    if (!paymentId) {
      setStatus("error");
      return;
    }

    (async () => {
      try {
        // Ask your backend to verify payment status with MercadoPago
        const res = await fetch(`${API_URL}/payments/mercadopago/verify?paymentId=${paymentId}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("verify failed");
        setStatus("ok");

        // optionally redirect to dashboard after a moment
        setTimeout(() => router.push("/dashboard"), 1500);
      } catch {
        setStatus("error");
      }
    })();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen pt-32 px-6">
      <h1 className="text-3xl font-black">Pago exitoso</h1>

      {status === "checking" && <p className="mt-4 text-muted-foreground">Verificando tu pago...</p>}
      {status === "ok" && <p className="mt-4 text-muted-foreground">¡Listo! Te llevamos a tus compras.</p>}
      {status === "error" && (
        <p className="mt-4 text-muted-foreground">
          No pude verificar el pago todavía. Revisa en “Mis Compras” o intenta refrescar.
        </p>
      )}
    </div>
  );
}
