"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type AuthMode = "signin" | "signup";

interface AuthFormCardProps {
  allowSignup?: boolean;
  redirectTo?: string;
  title?: string;
  subtitle?: string;
}

export function AuthFormCard({
  allowSignup = true,
  redirectTo = "/profile",
  title,
  subtitle,
}: AuthFormCardProps) {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("signin");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const useSignup = allowSignup && mode === "signup";

    const payload = useSignup
      ? {
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
          city: String(formData.get("city") ?? ""),
          role: String(formData.get("role") ?? "Attendee"),
        }
      : {
          email: String(formData.get("email") ?? ""),
          password: String(formData.get("password") ?? ""),
        };

    const endpoint = useSignup ? "/api/auth/register" : "/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "Authentication failed");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Network error while authenticating");
    } finally {
      setPending(false);
    }
  }

  const showSignup = allowSignup;
  const activeMode: AuthMode = showSignup ? mode : "signin";

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title ?? (activeMode === "signin" ? "Sign in" : "Create account")}</CardTitle>
        <p className="text-sm text-[var(--color-muted)]">
          {subtitle ??
            (activeMode === "signin"
              ? "Use your existing account to continue."
              : "Create a new account and continue.")}
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {showSignup ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant={mode === "signin" ? "default" : "secondary"}
              onClick={() => setMode("signin")}
            >
              Sign in
            </Button>
            <Button
              type="button"
              variant={mode === "signup" ? "default" : "secondary"}
              onClick={() => setMode("signup")}
            >
              Sign up
            </Button>
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {activeMode === "signup" ? <Input name="name" placeholder="Full name" required /> : null}

          <Input name="email" type="email" placeholder="Email" required />
          <Input name="password" type="password" placeholder="Password" required minLength={8} />

          {activeMode === "signup" ? (
            <>
              <Input name="city" placeholder="City" required />
              <select
                name="role"
                defaultValue="Attendee"
                className="flex h-11 w-full rounded-xl border border-black/10 bg-white/80 px-4 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
              >
                <option value="Attendee">Attendee</option>
                <option value="Organizer">Organizer</option>
              </select>
            </>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <Button type="submit" disabled={pending}>
            {pending ? "Please wait..." : activeMode === "signin" ? "Sign in" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}