import { notFound } from "next/navigation";
import { CalendarDays, MapPin, Users } from "lucide-react";

import { ApplyPanel } from "@/components/events/apply-panel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplyPreview } from "@/lib/api/applications";
import { getEventById } from "@/lib/api/events";

interface EventDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  const { id } = await params;
  const event = await getEventById(id);

  if (!event) {
    notFound();
  }

  const applyPreview = await getApplyPreview(event.id);

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
      <section className={`rounded-3xl bg-gradient-to-r ${event.coverGradient} p-8 text-white`}>
        <div className="space-y-4">
          <Badge className="bg-white/20 text-white" tone={event.category}>
            {event.category}
          </Badge>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{event.title}</h1>
          <p className="max-w-2xl text-white/85">{event.tagline}</p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Event overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[var(--color-muted)]">
            <p>{event.description}</p>
            <div className="grid gap-2 text-sm">
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {event.date} at {event.time}
              </p>
              <p className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {event.location} ({event.mode})
              </p>
              <p className="inline-flex items-center gap-2">
                <Users className="h-4 w-4" />
                {event.registered}/{event.capacity} participants
              </p>
            </div>
          </CardContent>
        </Card>

        <ApplyPanel eventTitle={event.title} isAlreadyApplied={Boolean(applyPreview)} />
      </section>
    </main>
  );
}
