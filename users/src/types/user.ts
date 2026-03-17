export type UserRole = "Organizer" | "Attendee";

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  city: string;
  avatarInitials: string;
}

export interface AuthenticatedUser {
  userId: string;
}
