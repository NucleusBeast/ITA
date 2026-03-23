import { Activity, Building2, Mail, MapPin, Star } from "lucide-react";

import { AuthFormCard } from "@/components/auth/auth-form-card";
import { LogoutButton } from "@/components/auth/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getApplicationsForCurrentUser } from "@/lib/api/applications";
import { getCurrentUser } from "@/lib/api/users";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-10 md:px-8">
        <section className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--color-accent)]">
            Your Account
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">Sign in to view your profile</h1>
          <p className="max-w-2xl text-[var(--color-muted)]">
            Profile and application history are available after sign in.
          </p>
        </section>
        <AuthFormCard allowSignup={false} redirectTo="/profile" />
      </main>
    );
  }

  const applications = await getApplicationsForCurrentUser();

  const confirmed = applications.filter((app) => app.status === "Confirmed").length;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
      <div className="flex justify-end">
        <LogoutButton />
      </div>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_2fr]">
        <Card>
          <CardHeader className="items-start gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary)] text-xl font-bold text-white">
              {user.avatarInitials}
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <p className="text-sm text-[var(--color-muted)]">{user.role}</p>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[var(--color-muted)]">
            <p className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>
            <p className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {user.city}
            </p>
            <p className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              ITA Event Platform
            </p>
          </CardContent>
        </Card>

        <section className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{applications.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Confirmed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{confirmed}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Engagement</CardTitle>
              <Activity className="h-4 w-4 text-[var(--color-accent)]" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[var(--color-muted)]">
                High activity this month, strong attendance consistency.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-base">Organizer score</CardTitle>
              <Star className="h-4 w-4 text-[var(--color-primary)]" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">4.8</p>
            </CardContent>
          </Card>
        </section>
      </section>
    </main>
  );
}
