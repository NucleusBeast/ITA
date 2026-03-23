import { z } from "zod";
import { EVENT_CATEGORIES, EVENT_MODES } from "../types/event";

const eventInputBase = {
  title: z.string().trim().min(2).max(120),
  tagline: z.string().trim().min(2).max(180),
  description: z.string().trim().min(10).max(4000),
  date: z.string().trim().min(8).max(32),
  time: z.string().trim().min(4).max(16),
  location: z.string().trim().min(2).max(180),
  mode: z.enum(EVENT_MODES),
  category: z.enum(EVENT_CATEGORIES),
  capacity: z.number().int().min(1).max(100000),
  priceLabel: z.string().trim().min(1).max(60),
  host: z.string().trim().min(2).max(120),
  coverGradient: z.string().trim().min(3).max(120),
  featured: z.boolean().optional(),
};

export const listEventsSchema = z.object({
  category: z.enum(EVENT_CATEGORIES).optional(),
});

export const getEventSchema = z.object({
  id: z.string().trim().min(1),
});

export const createEventSchema = z.object({
  event: z.object(eventInputBase),
});

export const updateEventSchema = z.object({
  id: z.string().trim().min(1),
  patch: z
    .object({
      ...eventInputBase,
      registered: z.number().int().min(0).max(100000).optional(),
    })
    .partial()
    .refine((value) => Object.keys(value).length > 0, {
      message: "At least one patch field is required",
    }),
});

export const deleteEventSchema = z.object({
  id: z.string().trim().min(1),
});
