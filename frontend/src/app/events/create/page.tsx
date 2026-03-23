import { AuthFormCard } from "@/components/auth/auth-form-card";
import { CreateEventForm } from "@/components/events/create-event-form";
import { getCurrentUser } from "@/lib/api/users";

export default async function CreateEventPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-8">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Organizer Space
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Sign in to create events</h1>
          <p className="max-w-2xl text-[var(--color-muted)]">
            You need an account before publishing events.
          </p>
        </section>
        <AuthFormCard allowSignup={false} redirectTo="/events/create" />
      </main>
    );
  }

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
