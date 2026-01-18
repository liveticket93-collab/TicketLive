"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import { Input } from "./Input";
import { cn } from "@/utils/cn";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const chatHelpers = useChat();
  const { messages, input = "", handleInputChange, handleSubmit, isLoading } = chatHelpers as any;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Ventana de Chat */}
      {isOpen && (
        <div className="mb-4 w-[350px] md:w-[400px] h-[500px] bg-background border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/20 rounded-lg">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Asistente TicketLive</h3>
                <p className="text-[10px] opacity-80 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  En línea
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/10 rounded-md transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted-foreground">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Bot className="text-primary" size={24} />
                </div>
                <p className="text-sm">¡Hola! Soy tu asistente de TicketLive. ¿En qué puedo ayudarte hoy?</p>
              </div>
            )}
            {(messages as any[]).map((m: any) => (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                  m.role === "user" ? "bg-primary/20" : "bg-muted"
                )}>
                  {m.role === "user" ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div
                  className={cn(
                    "p-3 rounded-2xl text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none"
                  )}
                >
                  {m.content}
                  
                  {/* Tool Invocations */}
                  {m.toolInvocations && m.toolInvocations.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {m.toolInvocations.map((toolInvocation: any) => {
                        const { toolCallId, state, toolName } = toolInvocation;
                        
                        if (state === 'call') {
                          return (
                            <div key={toolCallId} className="flex items-center gap-2 text-[10px] bg-black/10 rounded-md p-1.5 animate-pulse">
                              <Loader2 size={10} className="animate-spin" />
                              <span>Ejecutando {toolName}...</span>
                            </div>
                          );
                        }
                        
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex gap-3 max-w-[85%] mr-auto">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-muted p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <Loader2 size={16} className="animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/5 bg-background/50 backdrop-blur-sm">
            <div className="relative flex items-center gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Escribe un mensaje..."
                className="pr-12 h-11 bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
              />
              <Button
                type="submit"
                disabled={!(input || "").trim() || isLoading}
                className="absolute right-1 w-9 h-9 rounded-xl p-0 flex items-center justify-center"
              >
                <Send size={16} />
              </Button>
            </div>
            <p className="text-[10px] text-center mt-2 text-muted-foreground">
              Potenciado por TicketLive AI
            </p>
          </form>
        </div>
      )}

      {/* Botón Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95",
          isOpen ? "bg-background border border-white/10 text-foreground" : "bg-primary text-primary-foreground"
        )}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
}
