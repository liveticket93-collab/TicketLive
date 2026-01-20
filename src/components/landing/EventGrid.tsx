"use client";

import { EventCard } from "./EventCard";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { getEvents } from "@/services/events.service";
import IEvent from "@/interfaces/event.interface";
import { getEventCategories } from "@/services/events.service";
import { ICategory } from "@/services/events.service";
import { useSearchParams } from "next/navigation";

export function EventGrid() {
  const searchParams = useSearchParams();
  const categoryIdFromUrl = searchParams.get("category") ?? "All";
  const [activeCategory, setActiveCategory] = useState(categoryIdFromUrl);
  const [events, setEvents] = useState<IEvent[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();

  useEffect(() => {
    if (categoryIdFromUrl) {
      setActiveCategory(categoryIdFromUrl);
    }
  }, [categoryIdFromUrl]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const [fetchedEvents, fetchedCategories] = await Promise.all([
          getEvents(),
          getEventCategories(),
        ]);
        setEvents(fetchedEvents);
        setCategories(fetchedCategories);
      } catch (error) {
        alert(error);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = (
    activeCategory === "All"
      ? events
      : events.filter((event) => event.categoryId === activeCategory)
  ).filter((event) => {
    if (!q) return true;
    return (event.title ?? "").toLowerCase().includes(q);
  });

  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-6">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-bold text-white">
              Próximos eventos
            </h2>
            <p className="text-muted-foreground text-lg">
              No te pierdas estas experiencias increíbles.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeCategory === "All" ? "primary" : "outline"}
              onClick={() => setActiveCategory("All")}
              className={`rounded-full ${
                activeCategory === "All"
                  ? ""
                  : "border-white/10 hover:bg-white/5 hover:text-white"
              }`}
            >
              Todos
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "primary" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={`rounded-full ${
                  activeCategory === category.id
                    ? ""
                    : "border-white/10 hover:bg-white/5 hover:text-white"
                }`}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-secondary/20 p-8 text-center text-muted-foreground">
            No se encontraron eventos{q ? ` para “${q}”` : ""}.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event: IEvent) => (
              <EventCard key={event.id} {...event} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
