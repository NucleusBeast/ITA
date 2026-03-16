import { CalendarClock } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplicationsForCurrentUser } from "@/lib/api/applications";

export default async function ApplicationsPage() {
  const applications = await getApplicationsForCurrentUser();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
      <section className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
          Applications
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Your event applications</h1>
        <p className="max-w-2xl text-[var(--color-muted)]">
          Track application states across all events while backend services are still in progress.
        </p>
      </section>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {applications.map((application) => (
          <Card key={application.id}>
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge tone={application.status}>{application.status}</Badge>
                <span className="text-xs text-[var(--color-muted)]">{application.createdAt}</span>
              </div>
              <CardTitle className="text-lg">{application.event.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-[var(--color-muted)]">
              <p className="inline-flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                {application.event.date} at {application.event.time}
              </p>
              <p>{application.event.location}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </main>
  );
}
