"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";
import { createEvent } from "@/lib/api/events";

export function CreateEventForm() {
  const [submittedTitle, setSubmittedTitle] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event</CardTitle>
        <p className="text-sm text-[var(--color-muted)]">
          Submit this form to create a real event through the events microservice.
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={async (submitEvent) => {
            submitEvent.preventDefault();

            if (isSubmitting) {
              return;
            }

            setIsSubmitting(true);
            const form = submitEvent.currentTarget;
            const formData = new FormData(form);

            try {
              const title = String(formData.get("title") ?? "").trim();
              const date = String(formData.get("date") ?? "").trim();
              const time = String(formData.get("time") ?? "").trim();
              const location = String(formData.get("location") ?? "").trim();
              const tagline = String(formData.get("tagline") ?? "").trim();
              const description = String(formData.get("description") ?? "").trim();
              const host = String(formData.get("host") ?? "").trim();
              const category = String(formData.get("category") ?? "Tech") as
                | "Tech"
                | "Business"
                | "Workshop"
                | "Community"
                | "Culture";
              const mode = String(formData.get("mode") ?? "In Person") as
                | "In Person"
                | "Hybrid"
                | "Online";
              const capacity = Number(formData.get("capacity") ?? 50);

              const created = await createEvent({
                title,
                tagline,
                description,
                date,
                time,
                location,
                mode,
                category,
                capacity,
                priceLabel: "Free",
                host,
                coverGradient: "from-sky-600 to-indigo-700",
                featured: false,
              });

              setSubmittedTitle(created.title);
              form.reset();

              showToast({
                title: "Event created",
                description: `${created.title} is now published.`,
                variant: "success",
              });
            } catch (error) {
              const message =
                error instanceof Error ? error.message : "Please verify your session and form inputs.";
              showToast({
                title: "Could not create event",
                description: message,
                variant: "error",
              });
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Event title
            <Input name="title" placeholder="Design Sprint Weekend" required />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Tagline
            <Input name="tagline" placeholder="A focused day for shipping bold ideas" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Date
            <Input name="date" type="date" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Time
            <Input name="time" type="time" required />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Location
            <Input name="location" placeholder="Ljubljana Innovation Hub" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Category
            <select
              name="category"
              className="h-11 rounded-xl border border-black/10 bg-white/80 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              defaultValue="Tech"
            >
              <option value="Tech">Tech</option>
              <option value="Business">Business</option>
              <option value="Workshop">Workshop</option>
              <option value="Community">Community</option>
              <option value="Culture">Culture</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Mode
            <select
              name="mode"
              className="h-11 rounded-xl border border-black/10 bg-white/80 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              defaultValue="In Person"
            >
              <option value="In Person">In Person</option>
              <option value="Hybrid">Hybrid</option>
              <option value="Online">Online</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Capacity
            <Input name="capacity" type="number" min={1} defaultValue={50} required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Host
            <Input name="host" placeholder="ITA Community" required />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Description
            <textarea
              name="description"
              minLength={10}
              className="min-h-28 rounded-xl border border-black/10 bg-white/80 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              placeholder="Describe the event vibe, agenda, and expected audience..."
              required
            />
          </label>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating event..." : "Create Event"}
            </Button>
            {submittedTitle ? (
              <span className="text-sm text-[#0d7a3e]">
                Created event: {submittedTitle}
              </span>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
