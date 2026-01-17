import {
  getEvent,
  dateFormatter,
  timeFormatter,
} from "@/services/events.service";
import { Button } from "@/components/ui/Button";
import IEvent from "@/interfaces/event.interface";
import { Calendar, MapPin, Ticket, User, Clock } from "lucide-react";
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
  const formattedStartTime = timeFormatter(event.start_time);
  const formattedEndTime = timeFormatter(event.end_time);

  return (
    <section className="min-h-screen px-4 md:px-6 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* ================= HERO ================= */}
        <div className="relative overflow-hidden rounded-3xl ring-1 ring-white/10 shadow-2xl shadow-black/40">
          <div className="relative w-full aspect-[16/6] min-h-[260px]">
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* ================= BODY ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* -------- Description -------- */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-secondary/20 ring-1 ring-white/10 p-6 md:p-8 space-y-6">
              <h2 className="text-xl font-semibold text-white">
                Descripción del evento
              </h2>

              <p className="text-white/80 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>
          </div>

          {/* -------- Sticky purchase card -------- */}
          <aside className="lg:col-span-1 lg:sticky lg:top-24">
            <div className="rounded-3xl bg-secondary/30 ring-1 ring-white/10 p-6 space-y-6 shadow-xl shadow-black/30">
              {/* Meta info */}
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-white/90">{formattedDate}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-white/90">
                    {formattedStartTime} – {formattedEndTime}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-white/90">{event.location}</span>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-primary" />
                  <span className="text-white/90">
                    {event.capacity} personas
                  </span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/10" />

              {/* Price + CTA */}
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Desde
                  </p>
                  <p className="text-2xl font-bold text-white">
                    ${event.price}
                  </p>
                </div>

                <AddToCartButton Props={event} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
