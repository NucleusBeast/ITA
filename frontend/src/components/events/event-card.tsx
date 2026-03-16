import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Event } from "@/lib/types/domain";

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={`h-2 w-full bg-gradient-to-r ${event.coverGradient}`} />
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <Badge tone={event.category}>{event.category}</Badge>
          <span className="text-xs font-semibold text-[var(--color-muted)]">{event.priceLabel}</span>
        </div>
        <div className="space-y-1">
          <CardTitle className="text-lg">{event.title}</CardTitle>
          <p className="text-sm text-[var(--color-muted)]">{event.tagline}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm text-[var(--color-muted)]">
          <p className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {event.date} at {event.time}
          </p>
          <p className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            {event.location}
          </p>
          <p className="inline-flex items-center gap-2">
            <Users className="h-4 w-4" />
            {event.registered}/{event.capacity} spots taken
          </p>
        </div>
        <Link
          href={`/events/${event.id}`}
          className="inline-flex h-10 items-center rounded-lg bg-[var(--color-text)] px-4 text-sm font-semibold text-white transition hover:opacity-90"
        >
          View details
        </Link>
      </CardContent>
    </Card>
  );
}
