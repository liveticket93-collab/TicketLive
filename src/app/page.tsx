"use client";

import { Hero } from "@/components/landing/Hero";
import { EventGrid } from "@/components/landing/EventGrid";
import { FeaturedEvent } from "@/components/landing/FeaturedEvent";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { toast } from "sonner";



export default function Home() {
  const handleSubscribe = (formData: FormData) => {
    // In a real app we would send the data
    toast.success("Subscribed successfully!", {
      description: "You'll be the first to know about new events.",
    });
  };

  return (
    <main className="flex min-h-screen flex-col bg-background selection:bg-primary/30 selection:text-primary-foreground">
      <Hero />
      
      <FeaturedEvent />

      <EventGrid />

      {/* Newsletter Section */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
         <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-bottom-right" />
         
         <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Never Miss a Beat</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
                Subscribe to our newsletter for exclusive presales, premium event alerts, and VIP experiences.
            </p>
            
            <form action={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <Input name="email" type="email" placeholder="Enter your email address" className="bg-background/50 h-12" required />
                <Button size="lg" className="h-12 px-8" type="submit">Subscribe</Button>
            </form>
         </div>
      </section>
    </main>
  );
}
