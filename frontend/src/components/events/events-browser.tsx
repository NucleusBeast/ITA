"use client";

import { useMemo, useState } from "react";

import { EventCard } from "@/components/events/event-card";
import { Input } from "@/components/ui/input";
import type { Event } from "@/lib/types/domain";

interface EventsBrowserProps {
  initialEvents: Event[];
}

const categoryOptions = ["All", "Tech", "Business", "Workshop", "Community", "Culture"] as const;

export function EventsBrowser({ initialEvents }: EventsBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof categoryOptions)[number]>("All");

  const filtered = useMemo(() => {
    return initialEvents.filter((event) => {
      const matchesQuery = `${event.title} ${event.tagline}`
        .toLowerCase()
        .includes(query.toLowerCase());
      const matchesCategory = category === "All" || event.category === category;
      return matchesQuery && matchesCategory;
    });
  }, [category, initialEvents, query]);

  return (
    <section className="space-y-6">
      <div className="rounded-2xl border border-black/10 bg-white/70 p-4 md:p-6">
        <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search events, themes, hosts..."
          />
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <button
                key={option}
                onClick={() => setCategory(option)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  category === option
                    ? "bg-[var(--color-primary)] text-white"
                    : "bg-white text-[var(--color-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-black/20 bg-white/65 p-8 text-center">
          <p className="text-sm text-[var(--color-muted)]">
            No events match this filter yet. Try another category or search phrase.
          </p>
        </div>
      )}
    </section>
  );
}
