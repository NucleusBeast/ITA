import { Skeleton } from "@/components/ui/skeleton";

export default function ApplicationsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
      <section className="space-y-3">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-12 w-full max-w-2xl" />
      </section>
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-48 w-full" />
      </section>
    </main>
  );
}
