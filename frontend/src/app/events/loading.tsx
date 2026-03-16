import { Skeleton } from "@/components/ui/skeleton";

export default function EventsLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-10 md:px-8">
      <section className="space-y-3">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-12 w-full max-w-2xl" />
        <Skeleton className="h-5 w-full max-w-xl" />
      </section>
      <section className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
      </section>
    </main>
  );
}
