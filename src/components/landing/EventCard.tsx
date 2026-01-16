"use client";

import Image from "next/image";
import { Calendar, MapPin, Ticket, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/Button";
import IEvent from "@/interfaces/event.interface";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";
import { dateFormatter } from "@/services/events.service";

export function EventCard({
  id,
  title,
  description,
  date,
  start_time,
  location,
  capacity,
  price,
  imageUrl,
  status,
  categoryId,
}: IEvent) {
  const formattedDate = dateFormatter(date);

  const { addToCart } = useCart();
  const router = useRouter();

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-secondary/30 border border-white/5 hover:border-sidebar-accent/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.2)]">
      {/* Image Container */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-80" />
      </div>

      {/* Content */}
      <div className="relative p-6 -mt-12 space-y-4">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 -top-8">
          <Button
            size="sm"
            className="rounded-full h-10 w-10 p-0 flex items-center justify-center"
          >
            <Ticket className="h-4 w-4" />
          </Button>
        </div>

        <h3 className="text-xl font-bold text-white leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="flex items-center gap-4">
          <div className="event-details">
            <Calendar className="event-icons" />
            <span>{formattedDate}</span>
          </div>
          <div className="event-details">
            <MapPin className="event-icons" />
            <span>{location}</span>
          </div>
          <div className="event-details">
            <Clock className="event-icons" />
            <span>{start_time.split("T")[1].split(":00.")[0]}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <Button
            variant="primary"
            onClick={() => router.push(`/events/${id}`)}
          >
            Ver detalles
          </Button>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase">
              Desde
            </span>
            <span className="text-lg font-bold text-white">{price}$</span>
          </div>
          <Button
            onClick={() =>
              addToCart({
                id,
                title,
                price,
                imageUrl,
                categoryId,
                status,
                capacity,
                location,
                date,
                start_time,
                description,
              })
            }
            variant="ghost"
            size="sm"
            className="form-button"
          >
            Reservar ahora &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
