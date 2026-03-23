export const EVENT_CATEGORIES = [
  "Tech",
  "Business",
  "Workshop",
  "Community",
  "Culture",
] as const;

export const EVENT_MODES = ["In Person", "Hybrid", "Online"] as const;

export type EventCategory = (typeof EVENT_CATEGORIES)[number];

export type EventMode = (typeof EVENT_MODES)[number];

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
  featured: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventInput {
  title: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: EventMode;
  category: EventCategory;
  capacity: number;
  priceLabel: string;
  host: string;
  coverGradient: string;
  featured?: boolean;
}

export type EventPatch = Partial<
  Pick<
    Event,
    | "title"
    | "tagline"
    | "description"
    | "date"
    | "time"
    | "location"
    | "mode"
    | "category"
    | "capacity"
    | "registered"
    | "priceLabel"
    | "host"
    | "coverGradient"
    | "featured"
  >
>;
