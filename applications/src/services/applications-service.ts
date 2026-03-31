import { defer, map, mergeMap, of, throwError, type Observable } from "rxjs";
import {
  createApplication,
  deleteApplicationById,
  getApplicationForUserAndEvent,
  listApplicationsByUser,
} from "../data/applications-repository";
import type { Application } from "../types/application";

export class ServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
  }
}

export function listApplicationsByUser$(userId: string): Observable<Application[]> {
  return defer(() => listApplicationsByUser(userId)).pipe(
    map((items) => items.sort((a, b) => b.createdAt.localeCompare(a.createdAt))),
  );
}

export function getApplicationForUserAndEvent$(
  userId: string,
  eventId: string,
): Observable<Application | null> {
  return defer(() => getApplicationForUserAndEvent(userId, eventId));
}

export function createApplicationForUser$(
  userId: string,
  eventId: string,
): Observable<Application> {
  return defer(() => getApplicationForUserAndEvent(userId, eventId)).pipe(
    mergeMap((existing) => {
      if (existing) {
        return throwError(() => new ServiceError("Application already exists", 409));
      }

      return defer(() => createApplication({ userId, eventId, status: "Pending" }));
    }),
  );
}

export function withdrawApplicationForUser$(
  applicationId: string,
  userId: string,
): Observable<boolean> {
  return defer(() => deleteApplicationById(applicationId, userId)).pipe(
    mergeMap((deleted) => {
      if (!deleted) {
        return of(false);
      }

      return of(true);
    }),
  );
}
