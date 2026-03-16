import { CreateEventForm } from "@/components/events/create-event-form";

export default function CreateEventPage() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 md:px-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Organizer Space
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Create a new event</h1>
        <p className="max-w-2xl text-[var(--color-muted)]">
          Shape the event details and preview attendee-facing content before backend publishing.
        </p>
      </section>
      <CreateEventForm />
    </main>
  );
}
