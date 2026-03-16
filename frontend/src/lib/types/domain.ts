export type EventCategory =
  | "Tech"
  | "Business"
  | "Workshop"
  | "Community"
  | "Culture";

export type EventMode = "In Person" | "Hybrid" | "Online";

export type ApplicationStatus = "Confirmed" | "Pending" | "Waitlisted";

export interface Event {
  id: string;
  title: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: EventMode;
  category: EventCategory;
  capacity: number;
  registered: number;
  priceLabel: string;
  host: string;
  coverGradient: string;
  featured?: boolean;
}

export interface User {
  id: string;
  name: string;
  role: "Organizer" | "Attendee";
  email: string;
  city: string;
  avatarInitials: string;
}

export interface Application {
  id: string;
  userId: string;
  eventId: string;
  status: ApplicationStatus;
  createdAt: string;
}
