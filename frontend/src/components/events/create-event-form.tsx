"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast-provider";

export function CreateEventForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showToast } = useToast();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Event (UI Demo)</CardTitle>
        <p className="text-sm text-[var(--color-muted)]">
          This form is frontend-only for now. Backend service wiring comes later.
        </p>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 md:grid-cols-2"
          onSubmit={async (event) => {
            event.preventDefault();

            if (isSubmitting) {
              return;
            }

            setIsSubmitting(true);
            await new Promise((resolve) => window.setTimeout(resolve, 900));
            setSubmitted(true);

            showToast({
              title: "Draft generated",
              description: "Your event draft is saved in UI state for preview.",
              variant: "success",
            });

            setIsSubmitting(false);
          }}
        >
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Event title
            <Input placeholder="Design Sprint Weekend" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Date
            <Input type="date" required />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Time
            <Input type="time" required />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Location
            <Input placeholder="Ljubljana Innovation Hub" required />
          </label>
          <label className="grid gap-2 text-sm font-medium md:col-span-2">
            Description
            <textarea
              className="min-h-28 rounded-xl border border-black/10 bg-white/80 p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              placeholder="Describe the event vibe, agenda, and expected audience..."
            />
          </label>
          <div className="md:col-span-2 flex items-center gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving draft..." : "Preview Event Draft"}
            </Button>
            {submitted ? (
              <span className="text-sm text-[#0d7a3e]">
                Draft saved locally in UI state.
              </span>
            ) : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
