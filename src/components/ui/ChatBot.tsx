"use client";

import { useChat } from "@ai-sdk/react";
import { MessageCircle, Send, X, Bot, User, Loader2, Trash2 } from "lucide-react";
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
    setMessages,
  } = useChat({
    // Si mudás el API a otro servidor, descomentá y ajustá la URL:
    // api: "https://tu-servidor.com/api/chat",
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
        <div className="mb-4 w-[380px] h-[600px] bg-[#09090b] border border-[#27272a] rounded-[32px] shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          
          {/* Header */}
          <div className="p-5 bg-gradient-to-r from-[#2e1065] to-[#0f172a] text-white flex justify-between items-start shrink-0 relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-[-50%] left-[-20%] w-[200px] h-[200px] bg-purple-600/20 blur-[50px] rounded-full pointer-events-none"></div>
            
            <div className="flex gap-3 items-center z-10">
              <div className="w-10 h-10 rounded-full bg-[#3b0764]/50 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                 <Bot size={20} className="text-purple-300" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight">Asistente TicketLive</span>
                <span className="text-xs text-purple-200/70 font-medium">En línea ahora</span>
              </div>
            </div>
            <div className="flex gap-1 z-10">
                <button 
                  onClick={() => setMessages([])} // Assuming setMessages is available from useChat, wait. useChat returns `setMessages`.
                  className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                  title="Borrar chat"
                >
                  <Trash2 size={20} />
                </button>
                <button 
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
                >
                  <X size={20} />
                </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-[#09090b]">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-sm opacity-60">
                  <div className="w-16 h-16 rounded-full bg-[#18181b] flex items-center justify-center mb-4">
                     <Bot size={32} className="text-[#52525b]"/>
                  </div>
                  <p className="text-[#a1a1aa]">¿En qué puedo ayudarte hoy?</p>
              </div>
            )}

            {messages.map((m) => {
              const content = typeof (m as any).content === 'string' 
                ? (m as any).content 
                : m.parts?.filter((p: any) => p.type === 'text').map((p: any) => p.text).join('') || '';
                
              return (
              <div
                key={m.id}
                className={cn(
                  "flex gap-3 max-w-[90%]",
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                )}
              >
                {m.role !== "user" && (
                    <div className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
                         <Bot size={14} className="text-[#a1a1aa]" />
                    </div>
                )}
                 {m.role === "user" && (
                     <div className="w-8 h-8 rounded-full bg-[#2e1065] border border-purple-500/30 flex items-center justify-center shrink-0">
                         <User size={14} className="text-purple-200" />
                     </div>
                 )}

                <div className={cn(
                    "p-3.5 rounded-2xl text-sm shadow-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-gradient-to-r from-[#8b5cf6] to-[#6366f1] text-white rounded-tr-sm"
                      : "bg-[#18181b] text-[#e4e4e7] rounded-tl-sm border border-[#27272a]"
                  )}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none break-words">
                    <ReactMarkdown components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-purple-400" {...props} />, 
                        a: ({node, ...props}) => <a className="underline hover:text-purple-300 text-purple-400" {...props} />,
                        h1: ({node, ...props}) => <h1 className="text-lg font-bold text-purple-300 mt-4 mb-2" {...props} />,
                        h2: ({node, ...props}) => <h2 className="text-base font-bold text-purple-300 mt-3 mb-2" {...props} />,
                        h3: ({node, ...props}) => <h3 className="text-sm font-bold text-purple-300 mt-2 mb-1" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                        li: ({node, ...props}) => <li className="mb-0.5" {...props} />,
                    }}>
                      {content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            )})}

            {isLoading && lastMessage?.role === "user" && (
              <div className="flex gap-3 mr-auto">
                 <div className="w-8 h-8 rounded-full bg-[#18181b] border border-[#27272a] flex items-center justify-center shrink-0">
                     <Bot size={14} className="text-[#a1a1aa]" />
                </div>
                <div className="flex items-center gap-1 bg-[#18181b] border border-[#27272a] px-4 py-3 rounded-2xl rounded-tl-sm">
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-4 bg-[#09090b]"
          >
             <div className="relative flex items-center">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Escribí tu mensaje..."
                    className="w-full bg-[#18181b] border-[#27272a] text-white placeholder:text-[#52525b] rounded-full pl-5 pr-12 py-6 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/50"
                    autoComplete="off"
                />
                <Button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="absolute right-2 h-10 w-10 rounded-full bg-[#8b5cf6] hover:bg-[#7c3aed] text-white p-0 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                >
                    {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                    ) : (
                    <Send size={18} className="ml-0.5" />
                    )}
                </Button>
            </div>
            
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
            "w-14 h-14 rounded-full bg-[#a855f7] hover:bg-[#9333ea] text-white flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all hover:scale-105 active:scale-95",
            isOpen && "rotate-90 bg-[#c084fc]"
        )}
      >
        {isOpen ? <X size={24} /> : <div className="relative">
            <MessageCircle size={24} />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-[#a855f7] rounded-full"></span>
        </div>}
      </button>
    </div>
  );
}