"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, Send, X, Bot, User, Loader2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "./Button";
import { Input } from "./Input";
import { cn } from "@/utils/cn";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  
  const [input, setInput] = useState("");
  
  const {
    sendMessage,
    messages,
    status,
  } = useChat({
    onError: (err) => console.error("Chat error:", err),
  });

  const isLoading = status === "submitted" || status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    sendMessage({
      role: "user",
      parts: [{ type: 'text', text: input }],
    });
    setInput("");
  };

  // Auto-scroll
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages, isLoading]);

  const lastMessage = messages.at(-1);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-sans">
      {isOpen && (
        <div className="mb-4 w-[380px] h-[520px] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-4 bg-primary text-primary-foreground flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <Bot size={18} />
              <span className="font-semibold text-sm">TicketLive AI</span>
            </div>
            <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded p-1 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm opacity-60">
                    <Bot size={40} className="mb-2 opacity-20"/>
                    <p>¿En qué puedo ayudarte hoy?</p>
                </div>
            )}

            {messages.map((m) => {
              // Handle both legacy content and new parts structure
              const content = typeof (m as any).content === 'string' 
                ? (m as any).content 
                : m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';
                
              return (
              <div
                key={m.id}
                className={cn(
                  "flex gap-2 max-w-[85%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border",
                    m.role === "user" ? "bg-primary text-primary-foreground border-transparent" : "bg-muted border-border"
                )}>
                  {m.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>

                <div className={cn(
                    "p-3 rounded-2xl text-sm shadow-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm border border-border/50"
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none leading-relaxed break-words">
                    <ReactMarkdown components={{
                        p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />
                    }}>
                      {content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )})}

            {isLoading && lastMessage?.role === "user" && (
              <div className="flex gap-2 mr-auto animate-pulse">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Bot size={14} />
                </div>
                <div className="flex items-center gap-1 bg-muted px-3 py-2 rounded-xl rounded-tl-sm">
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t bg-background/80 backdrop-blur"
          >
            <div className="flex gap-2 relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                placeholder="Escribí tu mensaje..."
                className="pr-10"
                autoComplete="off"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="absolute right-1 top-1 h-7 w-7"
              >
                {isLoading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Send size={14} />
                )}
              </Button>
            </div>
            <div className="text-[10px] text-center text-muted-foreground mt-2 opacity-50">
                TicketLive AI puede cometer errores.
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
            "w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95",
            isOpen && "rotate-90"
        )}
      >
        {isOpen ? <X /> : <MessageCircle />}
      </button>
    </div>
  );
}