"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast-provider";
import { applyToEvent, withdrawApplication } from "@/lib/api/applications";

interface ApplyPanelProps {
  eventId: string;
  eventTitle: string;
  initialApplicationId?: string;
}

export function ApplyPanel({ eventId, eventTitle, initialApplicationId }: ApplyPanelProps) {
  const [applied, setApplied] = useState(Boolean(initialApplicationId));
  const [applicationId, setApplicationId] = useState<string | undefined>(initialApplicationId);
  const [pendingAction, setPendingAction] = useState<"apply" | "withdraw" | null>(
    null,
  );
  const { showToast } = useToast();

  async function handleApply() {
    if (applied || pendingAction) {
      return;
    }

    setPendingAction("apply");
    try {
      const application = await applyToEvent(eventId);
      setApplied(true);
      setApplicationId(application.id);
      showToast({
        title: "Application submitted",
        description: `You are now marked as applied for ${eventTitle}.`,
        variant: "success",
      });
    } catch (error) {
      showToast({
        title: "Application failed",
        description: error instanceof Error ? error.message : "Unable to submit your application.",
        variant: "error",
      });
    } finally {
      setPendingAction(null);
    }
  }

  async function handleWithdraw() {
    if (!applied || pendingAction || !applicationId) {
      return;
    }

    setPendingAction("withdraw");
    try {
      const deleted = await withdrawApplication(applicationId);
      if (deleted) {
        setApplied(false);
        setApplicationId(undefined);
        showToast({
          title: "Application withdrawn",
          description: `Your application status for ${eventTitle} is now cleared.`,
          variant: "info",
        });
      } else {
        showToast({
          title: "Already removed",
          description: "This application no longer exists.",
          variant: "info",
        });
      }
    } catch (error) {
      showToast({
        title: "Withdraw failed",
        description: error instanceof Error ? error.message : "Unable to withdraw application.",
        variant: "error",
      });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-[var(--color-muted)]">
          Apply to <strong>{eventTitle}</strong>. Your selection is persisted through the applications service.
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
