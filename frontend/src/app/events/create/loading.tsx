import { Skeleton } from "@/components/ui/skeleton";

export default function CreateEventLoading() {
  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10 md:px-8">
      <section className="space-y-3">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-12 w-full max-w-2xl" />
      </section>
      <Skeleton className="h-[28rem] w-full" />
    </main>
  );
}
