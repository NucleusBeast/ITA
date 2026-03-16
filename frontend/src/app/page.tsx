import Link from "next/link";
import { ArrowRight, CalendarRange, Sparkles, Users2 } from "lucide-react";

import { EventCard } from "@/components/events/event-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFeaturedEvents } from "@/lib/api/events";

const kpis = [
  { label: "Active events", value: "42" },
  { label: "Applications this week", value: "318" },
  { label: "Avg. approval time", value: "4h" },
];

export default async function Home() {
  const featuredEvents = await getFeaturedEvents();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-16 px-4 py-10 md:px-8 md:py-14">
      <section className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)] ring-1 ring-black/10">
            <Sparkles className="h-3.5 w-3.5" />
            Event planning, redesigned
          </p>
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
            Build high-energy events that people actually show up for.
          </h1>
          <p className="max-w-2xl text-lg text-[var(--color-muted)]">
            A modern command center for organizing events, tracking applications, and keeping attendees in sync.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/events">
              <Button size="lg">
                Explore events <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/events/create">
              <Button variant="secondary" size="lg">
                Create event
              </Button>
            </Link>
          </div>
        </div>

        <Card className="rotate-1 bg-white/80">
          <CardHeader className="space-y-2">
            <CardTitle className="text-base">Live planner snapshot</CardTitle>
            <p className="text-sm text-[var(--color-muted)]">Updated every 30 minutes</p>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {kpis.map((item) => (
              <div key={item.label} className="rounded-xl bg-[var(--color-soft)] p-3">
                <p className="text-2xl font-bold">{item.value}</p>
                <p className="text-xs text-[var(--color-muted)]">{item.label}</p>
              </div>
            ))}
            <div className="col-span-3 mt-2 rounded-xl bg-[#1e2a33] p-4 text-sm text-white/85">
              11 approvals are waiting for review in the applications queue.
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-3xl font-semibold tracking-tight">Featured events</h2>
          <Link href="/events" className="text-sm font-semibold text-[var(--color-accent)]">
            See all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <CalendarRange className="h-5 w-5 text-[var(--color-primary)]" />
            <CardTitle className="text-lg">Event timeline</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--color-muted)]">
            Plan weeks ahead with structured scheduling and visual flow.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <Users2 className="h-5 w-5 text-[var(--color-primary)]" />
            <CardTitle className="text-lg">Applicant insights</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--color-muted)]">
            Track application status and attendance confidence before event day.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center gap-3">
            <Sparkles className="h-5 w-5 text-[var(--color-primary)]" />
            <CardTitle className="text-lg">Brandable experience</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-[var(--color-muted)]">
            Showcase your events with style, clarity, and mobile-first presentation.
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
