
import { getEvent, dateFormatter } from "@/services/events.service";
import { Button } from "@/components/ui/Button";
import IEvent from "@/interfaces/event.interface";
import { Calendar, MapPin, Ticket, User, Clock } from "lucide-react"
import Image from "next/image";
import AddToCartButton from "@/components/ui/AddToCart";

export default async function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event: IEvent = await getEvent(id);
  const formattedDate = dateFormatter(event.date);

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-secondary/30 border border-white/5 hover:border-sidebar-accent/50 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.2)] mx-auto my-12">
      {/* Contenedor de Imagen (Image Container) */}
      <div className="relative h-64 w-full overflow-hidden">
        <Image
          src={event.imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-80" />
      </div>

      {/* Contenido (Content) */}
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
          {event.title}
        </h3>

        <div className="space-y-2 grid grid-cols-2">
          <div className="event-details">
            <Calendar className="event-icons" />
            <span>{formattedDate}</span>
          </div>
          <div className="event-details">
            <MapPin className="event-icons" />
            <span>{event.location}</span>
          </div>
          <div className="event-details">
            <User className="event-icons" />
            <span>{event.capacity}</span>
          </div>
          <div className="event-details">
            <Clock className="event-icons" />
            <span>{event.start_time.split("T")[1].split(":00.")[0]}</span>
          </div>
        </div>
          <div>
            <p className="text-md line-clamp-3">
              {event.description}
            </p>
          </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase">
              Desde
            </span>
            <span className="text-lg font-bold text-white">{event.price}$</span>
          </div>
          <AddToCartButton Props={event} />
        </div>
      </div>
    </div>
  );
}
