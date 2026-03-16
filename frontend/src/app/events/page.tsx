import { EventsBrowser } from "@/components/events/events-browser";
import { getEvents } from "@/lib/api/events";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Explore
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Find your next unforgettable event
        </h1>
        <p className="max-w-2xl text-[var(--color-muted)]">
          Browse upcoming experiences, filter by category, and preview details before applying.
        </p>
      </section>
      <EventsBrowser initialEvents={events} />
    </main>
  );
}
