import * as React from "react";

import { cn } from "@/lib/utils";

const toneMap = {
  Tech: "bg-[#e0f2ff] text-[#004f86]",
  Business: "bg-[#ffe9da] text-[#8a3f00]",
  Workshop: "bg-[#e6f8f8] text-[#005f62]",
  Community: "bg-[#e6f7ec] text-[#146c39]",
  Culture: "bg-[#fff1df] text-[#8f5b00]",
  Confirmed: "bg-[#e4f9ea] text-[#10783f]",
  Pending: "bg-[#fff2da] text-[#9d6500]",
  Waitlisted: "bg-[#ece9ff] text-[#5443b6]",
} as const;

type ToneKey = keyof typeof toneMap;

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: ToneKey;
}

export function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        tone ? toneMap[tone] : "bg-black/5 text-[var(--color-text)]",
        className,
      )}
      {...props}
    />
  );
}
