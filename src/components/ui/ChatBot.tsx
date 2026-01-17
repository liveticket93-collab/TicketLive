"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { MessageSquare, X, Send, Bot, User, Loader2, AlertCircle, ShoppingCart, Search, Info, Package, Trash2 } from "lucide-react";
import { Button } from "./Button";
import { Input } from "./Input";
import { cn } from "@/utils/cn";
import { toast } from "sonner";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import IEvent from "@/interfaces/event.interface";

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { refreshCart } = useCart();
  const { isLoggedIn } = useAuth();
  
  // Ref para evitar procesar la misma acción de herramienta múltiples veces
  const processedToolInvocationsRef = useRef<Set<string>>(new Set());

  const { messages, append, isLoading, error, setMessages } = useChat({
    api: '/api/chat',
    body: {
      isLoggedIn,
    },
    maxSteps: 5,
    onError: (error: Error) => {
      console.error('Chat error:', error);
      console.error('Error stack:', error.stack);
      console.error('Error name:', error.name);
      
      let errorMessage = error.message || 'No se pudo enviar el mensaje';
      
      // Intentar parsear el mensaje de error si es JSON
      try {
        const parsed = JSON.parse(errorMessage);
        if (parsed?.error) {
          errorMessage = parsed.error;
        }
      } catch {
        // Si falla el parseo, usamos el mensaje original
      }
      
      // Si el mensaje es muy genérico, dar más contexto
      if (errorMessage === 'An error occurred' || errorMessage === 'Error') {
        errorMessage = 'Error al conectar con el servidor. Por favor, verifica tu conexión y que el servidor esté funcionando.';
      }
      
      toast.error('Error en el chat', {
        description: errorMessage,
        duration: 5000,
      });
    },
  });

  // CARGAR historial desde localStorage al montar
  useEffect(() => {
    const savedMessages = localStorage.getItem("ticketlive-chat-history");
    if (savedMessages) {
      try {
        const parsed = JSON.parse(savedMessages);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
        }
      } catch (e) {
        console.error("Error cargando historial de chat:", e);
      }
    }
  }, [setMessages]);

  // GUARDAR historial cada vez que cambian los mensajes
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("ticketlive-chat-history", JSON.stringify(messages));
    }
  }, [messages]);

  // Función para limpiar el historial
  const clearHistory = () => {
    setMessages([]);
    localStorage.removeItem("ticketlive-chat-history");
    processedToolInvocationsRef.current.clear();
    toast.success("Historial limpiado correctamente");
  };

  // Limpiar el SET de IDs procesados cuando se cierra el chat
  useEffect(() => {
    if (!isOpen) {
      processedToolInvocationsRef.current.clear();
    }
  }, [isOpen]);

  // Limpiar mensajes antiguos si hay demasiados para evitar problemas de rendimiento
  useEffect(() => {
    if (messages.length > 50) {
       if (processedToolInvocationsRef.current.size > 100) {
         processedToolInvocationsRef.current.clear();
       }
    }
  }, [messages.length]);

  // Manejar efectos secundarios de las herramientas (como actualizar el carrito)
  useEffect(() => {
    const processMessages = async () => {
      for (const m of messages as any[]) {
        if (m.toolInvocations) {
          for (const ti of m.toolInvocations) {
            if (ti.state === 'result') {
              const key = ti.toolCallId;
              if (processedToolInvocationsRef.current.has(key)) continue;
              processedToolInvocationsRef.current.add(key);

              try {
                const result = typeof ti.result === 'string' ? JSON.parse(ti.result) : ti.result;
                
                if (!result.success) {
                  if (result.error?.toLowerCase().includes('sesión') || result.error?.toLowerCase().includes('autenticado')) {
                    toast.error("Acción requerida", {
                      description: "Debes iniciar sesión para realizar esta acción.",
                    });
                  }
                  continue;
                }

                if (ti.toolName === 'addToCart') {
                  await refreshCart();
                  const quantity = result.quantity || 1;
                  toast.success(`¡${quantity} entrada(s) agregada(s) al carrito!`);
                }
                
                if (ti.toolName === 'removeFromCart') {
                  await refreshCart();
                  toast.success('Evento eliminado del carrito');
                }
              } catch (e) {
                console.error('Error procesando resultado de herramienta:', e);
              }
            }
          }
        }
      }
    };
    
    processMessages();
  }, [messages, refreshCart, isLoggedIn]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput(""); // Limpiar antes de enviar para una mejor UX

    try {
      await append({
        role: 'user',
        content: currentInput,
      });
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error al enviar el mensaje';
      toast.error('Error al enviar mensaje', {
        description: errorMessage
      });
      // Restaurar el input si falla
      setInput(currentInput);
    }
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
          {/* Encabezado (Header) */}
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
            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button 
                  onClick={clearHistory}
                  title="Limpiar historial"
                  className="p-1 text-muted-foreground hover:text-red-400 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mensajes */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
          >
            {error && (
              <div className="p-3 mx-2 mb-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{(() => {
                  try {
                    const parsed = JSON.parse(error.message);
                    return parsed?.error || error.message;
                  } catch {
                    return error.message || 'Error al conectar con el asistente';
                  }
                })()}</span>
              </div>
            )}
            
            {messages.length === 0 && (
              <div className="text-center mt-10">
                <Bot className="w-12 h-12 text-primary/30 mx-auto mb-4" />
                <p className="text-white font-semibold text-sm mb-2">
                  ¡Hola! Soy tu asistente de TicketLive 🎉
                </p>
                <p className="text-muted-foreground text-xs px-8 mb-4">
                  Puedo ayudarte a encontrar eventos, consultar detalles, ver categorías y recomendar experiencias increíbles.
                </p>
                
                {/* Botones de Acción Rápida */}
                <div className="flex flex-col gap-2 px-4 mt-6">
                  <button
                    onClick={() => {
                      setInput("¿Qué eventos hay disponibles?");
                    }}
                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors text-left"
                  >
                    🎭 Ver eventos disponibles
                  </button>
                  <button
                    onClick={() => {
                      setInput("¿Qué categorías de eventos tienen?");
                    }}
                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors text-left"
                  >
                    📂 Explorar categorías
                  </button>
                  <button
                    onClick={() => {
                      setInput("¿Qué eventos me recomiendas?");
                    }}
                    className="text-xs bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg px-3 py-2 transition-colors text-left"
                  >
                    ⭐ Eventos recomendados
                  </button>
                </div>
              </div>
            )}
            
            {messages.map((m: any) => {
              const displayContent = m.content;

              return (
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
                    {displayContent && <span>{displayContent}</span>}
                    
                    {/* Indicadores visuales para las herramientas */}
                    {m.toolInvocations?.map((ti: any) => {
                      const isExecuting = ti.state === 'call';
                      const toolName = ti.toolName;
                      
                      let ToolIcon = Package;
                      let statusText = isExecuting ? `Ejecutando ${toolName}...` : `${toolName} completado`;

                      if (toolName === 'addToCart' || toolName === 'removeFromCart') {
                        ToolIcon = ShoppingCart;
                        statusText = isExecuting ? "Actualizando carrito..." : "Carrito actualizado ✓";
                      } else if (toolName === 'searchEvents') {
                        ToolIcon = Search;
                        statusText = isExecuting ? "Buscando eventos..." : "Búsqueda finalizada";
                      } else if (toolName === 'getEventDetails') {
                        ToolIcon = Info;
                        statusText = isExecuting ? "Obteniendo detalles..." : "Detalles cargados";
                      }

                      return (
                        <div key={ti.toolCallId} className={cn(
                          "mt-2 pt-2 border-t border-white/10 flex items-center gap-2 text-[10px]",
                          isExecuting ? "text-primary animate-pulse" : "text-green-400"
                        )}>
                          {isExecuting ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            <ToolIcon className="w-3 h-3" />
                          )}
                          <span>{statusText}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs italic">Escribiendo...</span>
              </div>
            )}
          </div>

          {/* Entrada (Input) */}
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
