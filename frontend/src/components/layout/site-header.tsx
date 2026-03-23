import Link from "next/link";
import { CalendarCheck2 } from "lucide-react";

import { LogoutButton } from "@/components/auth/logout-button";
import { getCurrentUser } from "@/lib/api/users";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/events/create", label: "Create" },
  { href: "/applications", label: "Applications" },
];

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f8f4eb]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="rounded-lg bg-[var(--color-primary)] p-1.5 text-white">
            <CalendarCheck2 className="h-4 w-4" />
          </span>
          <span className="font-semibold tracking-wide text-[var(--color-text)]">ITA Planner</span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition",
                "hover:bg-white/80 hover:text-[var(--color-text)]",
              )}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/profile"
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition",
                  "hover:bg-white/80 hover:text-[var(--color-text)]",
                )}
              >
                Profile
              </Link>
              <div className="pl-2">
                <LogoutButton />
              </div>
            </>
          ) : (
            <Link
              href="/auth"
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-muted)] transition",
                "hover:bg-white/80 hover:text-[var(--color-text)]",
              )}
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
