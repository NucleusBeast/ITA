import { MOCK_APPLICATIONS, MOCK_EVENTS, MOCK_USER } from "@/lib/mock-data";
import type { Application, Event } from "@/lib/types/domain";

export interface ApplicationWithEvent extends Application {
  event: Event;
}

export async function getApplicationsForCurrentUser(): Promise<
  ApplicationWithEvent[]
> {
  return MOCK_APPLICATIONS.filter((application) => application.userId === MOCK_USER.id)
    .map((application) => {
      const event = MOCK_EVENTS.find((item) => item.id === application.eventId);
      return event ? { ...application, event } : null;
    })
    .filter((entry): entry is ApplicationWithEvent => entry !== null);
}

export async function getApplyPreview(eventId: string): Promise<
  ApplicationWithEvent | undefined
> {
  return getApplicationsForCurrentUser().then((items) =>
    items.find((item) => item.eventId === eventId),
  );
}
