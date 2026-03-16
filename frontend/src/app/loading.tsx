import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-12 px-4 py-10 md:px-8 md:py-14">
      <section className="grid items-end gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-16 w-full max-w-3xl" />
          <Skeleton className="h-16 w-full max-w-2xl" />
          <Skeleton className="h-12 w-64" />
        </div>
        <Skeleton className="h-64 w-full" />
      </section>
      <section className="grid gap-5 md:grid-cols-2">
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
      </section>
    </main>
  );
}
