import { z } from "zod";

export const createApplicationSchema = z.object({
  eventId: z.string().trim().min(1),
});
