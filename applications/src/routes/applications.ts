import { firstValueFrom } from "rxjs";
import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import {
  createApplicationForUser$,
  getApplicationForUserAndEvent$,
  listApplicationsByUser$,
  withdrawApplicationForUser$,
} from "../services/applications-service";
import { createApplicationSchema } from "../validation/schemas";

export const applicationsRouter = Router();

function paramAsString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }

  return value ?? "";
}

applicationsRouter.get("/applications/me", requireAuth, async (req, res, next) => {
  try {
    const applications = await firstValueFrom(listApplicationsByUser$(req.auth!.userId));
    res.status(200).json({ applications });
  } catch (error) {
    next(error);
  }
});

applicationsRouter.get(
  "/applications/event/:eventId/me",
  requireAuth,
  async (req, res, next) => {
    try {
      const eventId = paramAsString(req.params.eventId);
      const application = await firstValueFrom(
        getApplicationForUserAndEvent$(req.auth!.userId, eventId),
      );
      res.status(200).json({ application });
    } catch (error) {
      next(error);
    }
  },
);

applicationsRouter.post("/applications", requireAuth, async (req, res, next) => {
  try {
    const payload = createApplicationSchema.parse(req.body);
    const application = await firstValueFrom(
      createApplicationForUser$(req.auth!.userId, payload.eventId),
    );

    res.status(201).json({ application });
  } catch (error) {
    next(error);
  }
});

applicationsRouter.delete("/applications/:id", requireAuth, async (req, res, next) => {
  try {
    const applicationId = paramAsString(req.params.id);
    const deleted = await firstValueFrom(
      withdrawApplicationForUser$(applicationId, req.auth!.userId),
    );

    res.status(deleted ? 200 : 404).json({ deleted });
  } catch (error) {
    next(error);
  }
});
