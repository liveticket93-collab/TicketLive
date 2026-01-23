"use client";

import { useState } from "react";
import AdminGuard from "@/components/guards/AdminGuard";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminNewsletterPage() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSendNewsletter = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/newsletter/send", {
                method: "POST",
            });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.details || data.error || "Error al enviar");
            }

            toast.success("¡Newsletter enviado!", {
                description: data.message,
            });
        } catch (error) {
            console.error("Error enviando newsletter:", error);
            toast.error("Error al enviar", {
                description: error instanceof Error ? error.message : "Intenta nuevamente",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AdminGuard>
            <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-black py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                                Gestión de Newsletter
                            </h1>
                            <p className="text-gray-400">
                                Envía correos semanales a todos tus suscriptores manualmente.
                            </p>
                        </div>
                        <button
                            onClick={() => router.back()}
                            className="text-gray-400 hover:text-white transition-colors"
                        >
                            Volver
                        </button>
                    </div>

                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8 shadow-xl">
                        <div className="flex flex-col items-center justify-center text-center py-12">
                            <div className="w-24 h-24 bg-purple-600/20 rounded-full flex items-center justify-center mb-6">
                                <svg
                                    className="w-12 h-12 text-purple-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                            
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Enviar Newsletter Semanal
                            </h2>
                            <p className="text-gray-400 max-w-md mb-8">
                                Esta acción generará y enviará el correo con los 3 eventos más destacados
                                a todos los usuarios suscritos actualmente.
                            </p>

                            <button
                                onClick={handleSendNewsletter}
                                disabled={loading}
                                className={`
                                    py-3 px-8 rounded-xl font-semibold text-lg transition-all transform
                                    ${loading 
                                        ? 'bg-zinc-700 text-gray-500 cursor-not-allowed' 
                                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:scale-105 shadow-lg hover:shadow-purple-500/25'
                                    }
                                `}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Enviando...
                                    </span>
                                ) : (
                                    "Enviar Newsletter Ahora"
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminGuard>
    );
}
