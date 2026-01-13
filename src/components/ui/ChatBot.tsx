"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { MessageSquare, X, Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { cn } from "@/utils/cn";
import { toast } from "sonner";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const { messages, append, isLoading, error } = useChat({
    api: '/api/chat',
    onError: (error: Error) => {
      console.error('Chat error:', error);
      toast.error('Error en el chat', {
        description: error.message || 'No se pudo enviar el mensaje'
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput(""); // Limpiar antes de enviar para una mejor UX

    await append({
      role: 'user',
      content: currentInput,
    });
  };

  // Auto-scroll al fondo cuando llegan mensajes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana de Chat */}
      {isOpen && (
        <div 
          className={cn(
            "mb-4 w-[350px] sm:w-[400px] h-[500px] flex flex-col rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 transform",
            "bg-zinc-950/90 backdrop-blur-xl border border-white/10"
          )}
        >
          {/* Header */}
          <div className="p-4 bg-linear-to-r from-violet-600/20 to-pink-600/20 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Asistente TicketLive</h3>
                <p className="text-[10px] text-primary animate-pulse">En línea ahora</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mensajes */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {error && (
              <div className="p-3 mx-2 mb-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error.message || 'Error al conectar con el asistente'}</span>
              </div>
            )}
            
            {messages.length === 0 && (
              <div className="text-center mt-10">
                <Bot className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-muted-foreground text-sm px-8">
                  ¡Hola! Soy tu asistente de TicketLive. ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            )}
            
            {messages.map((m: { id: string; role: string; content: string }) => (
              <div
                key={m.id}
                className={cn(
                  "flex items-start gap-2 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                  m.role === "user" 
                    ? "bg-primary/20 border-primary/30" 
                    : "bg-zinc-800 border-white/10"
                )}>
                  {m.role === "user" ? <User className="w-4 h-4 text-primary" /> : <Bot className="w-4 h-4 text-primary" />}
                </div>
                
                <div className={cn(
                  "p-3 rounded-2xl text-sm",
                  m.role === "user"
                    ? "bg-primary text-white"
                    : "bg-white/5 border border-white/10 text-zinc-100"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs italic">Escribiendo...</span>
              </div>
            )}
          </div>

          {/* Input */}
          <form 
            onSubmit={handleSubmit}
            className="p-4 bg-white/5 border-t border-white/10 flex gap-2"
          >
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Pregunta algo..."
              className="h-10 text-xs bg-black/40 border-white/5 focus-visible:ring-primary/50"
            />
            <Button 
              type="submit" 
              size="sm" 
              className="h-10 px-4 shrink-0 shadow-none border border-primary/50"
              disabled={!input.trim() || isLoading}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      )}

      {/* Botón Lanzador */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 group",
          "bg-linear-to-tr from-violet-600 to-fuchsia-600 text-white",
          isOpen && "rotate-90 scale-90"
        )}
      >
        {isOpen ? <X className="w-7 h-7" /> : <MessageSquare className="w-7 h-7" />}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-pink-500 border-2 border-zinc-950"></span>
        </span>
      </button>
    </div>
  );
};
