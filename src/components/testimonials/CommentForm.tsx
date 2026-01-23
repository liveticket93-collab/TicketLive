"use client";

import { useState, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { createComment } from "@/services/comments.service";
import { Star, Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CommentForm({ onCommentAdded }: { onCommentAdded: () => void }) {
  const { user, isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [eventImage, setEventImage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEventImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !user) return;

    setIsSubmitting(true);
    try {
      await createComment({
        name: user.name || "Usuario",
        role: "Fan Verificado", // Rol por defecto para usuarios autenticados
        content,
        rating,
        image: user.profile_photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200", // Avatar de respaldo
        eventImage: eventImage || undefined,
        verified: true,
        event: "Evento Reciente", // En una app real, esto podría ser un selector
      });
      
      // Reiniciar formulario
      setContent("");
      setRating(5);
      setEventImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      // Notificar al padre para refrescar la lista
      onCommentAdded();
    } catch (error) {
      console.error("Error enviando comentario:", error);
      alert("Hubo un error al enviar tu comentario. Por favor intenta de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-zinc-900/50 border border-white/10 rounded-2xl p-8 text-center backdrop-blur-sm">
        <h3 className="text-xl font-bold text-white mb-2">¿Asististe a un evento?</h3>
        <p className="text-zinc-400 mb-6 max-w-md mx-auto">
          Inicia sesión para compartir tu experiencia y fotos con la comunidad de TicketLive.
        </p>
        <div className="flex justify-center gap-4">
          <Link 
            href="/login" 
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register" 
            className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-500/25"
          >
            Registrarse
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-sm max-w-2xl mx-auto mb-16 shadow-xl">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative w-12 h-12">
           <Image
            src={user?.profile_photo || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200"}
            alt={user?.name || "User"}
            fill
            className="rounded-full object-cover border-2 border-purple-500/30"
          />
        </div>
        <div>
          <p className="text-white font-medium">{user?.name}</p>
          <p className="text-sm text-zinc-500">Comparte tu experiencia</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Calificación */}
        <div className="flex flex-col gap-2">
          <label className="text-sm text-zinc-400 font-medium">Tu Calificación</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="group focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    star <= rating
                      ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]"
                      : "text-zinc-600 group-hover:text-zinc-500"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Input de Comentario */}
        <div className="space-y-2">
          <label htmlFor="content" className="text-sm text-zinc-400 font-medium">Tu Comentario</label>
          <textarea
            id="content"
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="¡Cuéntanos qué tal estuvo el evento!"
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 min-h-[120px] resize-none"
          />
        </div>

        {/* Carga de Imagen */}
        <div className="space-y-2">
          <label className="text-sm text-zinc-400 font-medium block">Foto del Evento (Opcional)</label>
          
          {!eventImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-xl p-6 hover:bg-white/5 transition-colors cursor-pointer flex flex-col items-center justify-center gap-2 group"
            >
              <div className="p-3 bg-white/5 rounded-full group-hover:bg-purple-500/20 transition-colors">
                <Upload className="w-5 h-5 text-zinc-400 group-hover:text-purple-400 transition-colors" />
              </div>
              <span className="text-sm text-zinc-500 group-hover:text-zinc-300 transition-colors">Click para subir foto</span>
            </div>
          ) : (
            <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10">
              <Image 
                src={eventImage} 
                alt="Preview" 
                fill 
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setEventImage(null);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 rounded-full text-white transition-colors backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Publicando...
            </>
          ) : (
            "Publicar Comentario"
          )}
        </button>
      </form>
    </div>
  );
}
