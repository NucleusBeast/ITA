"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";

interface ApplyPanelProps {
  eventTitle: string;
  isAlreadyApplied: boolean;
}

export function ApplyPanel({ eventTitle, isAlreadyApplied }: ApplyPanelProps) {
  const [applied, setApplied] = useState(isAlreadyApplied);
  const [pendingAction, setPendingAction] = useState<"apply" | "withdraw" | null>(
    null,
  );
  const { showToast } = useToast();

  async function handleApply() {
    if (applied || pendingAction) {
      return;
    }

    setPendingAction("apply");
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setApplied(true);
    setPendingAction(null);
    showToast({
      title: "Application submitted",
      description: `You are now marked as applied for ${eventTitle}.`,
      variant: "success",
    });
  }

  async function handleWithdraw() {
    if (!applied || pendingAction) {
      return;
    }

    setPendingAction("withdraw");
    await new Promise((resolve) => window.setTimeout(resolve, 700));
    setApplied(false);
    setPendingAction(null);
    showToast({
      title: "Application withdrawn",
      description: `Your application status for ${eventTitle} is now cleared.`,
      variant: "info",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[var(--color-muted)]">
          Apply to <strong>{eventTitle}</strong>. This interaction is currently simulated in frontend state.
        </p>
        {applied ? (
          <div className="rounded-xl bg-[#e4f9ea] px-4 py-3 text-sm font-medium text-[#0f7a3f]">
            You are marked as applied.
          </div>
        ) : (
          <div className="rounded-xl bg-[#fff5dc] px-4 py-3 text-sm font-medium text-[#916200]">
            You have not applied yet.
          </div>
        )}
        <div className="flex gap-3">
          <Button onClick={handleApply} disabled={applied || pendingAction !== null}>
            {pendingAction === "apply" ? "Applying..." : "Apply now"}
          </Button>
          <Button
            variant="secondary"
            onClick={handleWithdraw}
            disabled={!applied || pendingAction !== null}
          >
            {pendingAction === "withdraw" ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
