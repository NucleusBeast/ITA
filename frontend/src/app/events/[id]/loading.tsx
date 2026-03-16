import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
      <Skeleton className="h-56 w-full rounded-3xl" />
      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-64 w-full" />
      </section>
    </main>
  );
}
