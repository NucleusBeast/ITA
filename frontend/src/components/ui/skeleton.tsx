import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-black/5 via-black/10 to-black/5",
        className,
      )}
      aria-hidden="true"
    />
  );
}
