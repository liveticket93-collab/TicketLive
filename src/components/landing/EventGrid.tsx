import { useState } from 'react';
import { EventCard } from './EventCard';
import { Button } from '@/components/ui/Button';

const FEATURED_EVENTS = [
  {
    id: 1,
    title: "Neon Nights Music Festival 2024",
    date: "Dec 15, 2024 • 8:00 PM",
    location: "Miami Arena, FL",
    price: "$149",
    image: "https://images.unsplash.com/photo-1616709062048-788acece6a51?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Festival"
  },
  {
    id: 2,
    title: "The Weekend: After Hours Tour",
    date: "Jan 20, 2025 • 9:00 PM",
    location: "SoFi Stadium, CA",
    price: "$299",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2670&auto=format&fit=crop",
    category: "Concert"
  },
  {
    id: 3,
    title: "Championship Finals: Lakers vs Celtics",
    date: "Feb 10, 2025 • 7:30 PM",
    location: "Crypto.com Arena, CA",
    price: "$450",
    image: "https://images.unsplash.com/photo-1581049966083-210f169bc2b4?q=80&w=771&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Sports"
  },
    {
    id: 4,
    title: "Electric Dreams: Cyberpunk Opera",
    date: "Mar 05, 2025 • 8:00 PM",
    location: "Sydney Opera House",
    price: "$120",
    image: "https://images.unsplash.com/photo-1580809361436-42a7ec204889?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Theater"
  },
    {
    id: 5,
    title: "Global Tech Summit 2025",
    date: "Apr 12, 2025 • 9:00 AM",
    location: "Silicon Valley, CA",
    price: "$599",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2670&auto=format&fit=crop",
    category: "Conference"
  },
    {
    id: 6,
    title: "Jazz in the Park",
    date: "May 20, 2025 • 6:00 PM",
    location: "Central Park, NY",
    price: "Free",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2832&auto=format&fit=crop",
    category: "Music"
  }
];

const CATEGORIES = [
  { key: "All", label: "Todos" },
  { key: "Concert", label: "Conciertos" },
  { key: "Festival", label: "Festivales" },
  { key: "Sports", label: "Deportes" },
  { key: "Theater", label: "Teatro" },
  { key: "Conference", label: "Conferencias" },
  { key: "Music", label: "Música" }
];

export function EventGrid() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredEvents = activeCategory === "All" 
    ? FEATURED_EVENTS 
    : FEATURED_EVENTS.filter(event => event.category === activeCategory);

  return (
    <section className="py-24 relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end mb-12 gap-6">
            <div className="space-y-2">
              <h2 className="text-3xl md:text-5xl font-bold text-white">Próximos eventos</h2>
              <p className="text-muted-foreground text-lg">No te pierdas estas experiencias increíbles.</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Button 
                    key={category.key}
                    variant={activeCategory === category.key ? "primary" : "outline"}
                    onClick={() => setActiveCategory(category.key)}
                    className={`rounded-full ${activeCategory === category.key ? "" : "border-white/10 hover:bg-white/5 hover:text-white"}`}
                  >
                    {category.label}
                  </Button>
                ))}
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              {...event}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
