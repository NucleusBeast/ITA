import type { Application, ApplicationStatus } from "../types/application";
import { convexClient } from "./convex-client";

interface StoredApplication extends Application {}

function normalizeApplication(entry: StoredApplication | null): Application | null {
  return entry ?? null;
}

export async function listApplicationsByUser(userId: string): Promise<Application[]> {
  const applications = await (convexClient as any).query("applications:listByUser", {
    userId,
  });

  return (applications as StoredApplication[]) ?? [];
}

export async function getApplicationForUserAndEvent(
  userId: string,
  eventId: string,
): Promise<Application | null> {
  const application = await (convexClient as any).query("applications:getForUserAndEvent", {
    userId,
    eventId,
  });

  return normalizeApplication((application as StoredApplication | null) ?? null);
}

export async function createApplication(input: {
  userId: string;
  eventId: string;
  status?: ApplicationStatus;
}): Promise<Application> {
  const application = await (convexClient as any).mutation("applications:create", input);
  return application as Application;
}

export async function deleteApplicationById(
  applicationId: string,
  requesterId: string,
): Promise<boolean> {
  const deleted = await (convexClient as any).mutation("applications:deleteById", {
    applicationId,
    requesterId,
  });

  return Boolean(deleted);
}
