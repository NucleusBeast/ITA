export type ApplicationStatus = "Confirmed" | "Pending" | "Waitlisted";

export interface Application {
  id: string;
  userId: string;
  eventId: string;
  status: ApplicationStatus;
  createdAt: string;
  updatedAt: string;
}
