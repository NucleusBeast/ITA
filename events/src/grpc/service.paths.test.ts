import { describe, expect, it, vi } from "vitest";

vi.mock("../data/events-repository", () => ({
  listEvents: vi.fn(),
  getEventById: vi.fn(),
  createEvent: vi.fn(),
  updateEvent: vi.fn(),
  deleteEvent: vi.fn(),
}));

vi.mock("../lib/jwt", () => ({
  verifyAccessToken: vi.fn(),
}));

import { status } from "@grpc/grpc-js";
import {
  createEvent,
  deleteEvent,
  getEventById,
  listEvents,
  updateEvent,
} from "../data/events-repository";
import { verifyAccessToken } from "../lib/jwt";
import type { Event } from "../types/event";
import { eventsServiceHandlers } from "./service";

const listEventsMock = vi.mocked(listEvents);
const getEventByIdMock = vi.mocked(getEventById);
const createEventMock = vi.mocked(createEvent);
const updateEventMock = vi.mocked(updateEvent);
const deleteEventMock = vi.mocked(deleteEvent);
const verifyAccessTokenMock = vi.mocked(verifyAccessToken);

const eventFixture: Event = {
  id: "evt_1",
  title: "AI Summit",
  tagline: "Real-world AI",
  description: "A practical event about AI in production.",
  date: "2026-06-01",
  time: "09:00",
  location: "Ljubljana",
  mode: "In Person",
  category: "Tech",
  capacity: 200,
  registered: 20,
  priceLabel: "Free",
  host: "ITA",
  coverGradient: "from-cyan-500 to-blue-600",
  featured: true,
  createdBy: "user_1",
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
};

function makeCall<TReq>(request: TReq, authorization?: string) {
  return {
    request,
    metadata: {
      getMap: () => ({ authorization }),
    },
  } as unknown as Parameters<typeof eventsServiceHandlers.ListEvents>[0];
}

function callUnary(handler: any, call: any): Promise<{ error: any; response: any }> {
  return new Promise((resolve) => {
    handler(call, (error: any, response: any) => {
      resolve({ error, response });
    });
  });
}

describe("events service gRPC paths", () => {
  it("ListEvents hits listEvents repository path successfully", async () => {
    listEventsMock.mockResolvedValue([eventFixture]);

    const result = await callUnary(eventsServiceHandlers.ListEvents, makeCall({}));

    expect(result.error).toBeNull();
    expect(listEventsMock).toHaveBeenCalledWith(undefined);
    expect(result.response?.events).toHaveLength(1);
  });

  it("GetEvent hits getEventById repository path successfully", async () => {
    getEventByIdMock.mockResolvedValue(eventFixture);

    const result = await callUnary(
      eventsServiceHandlers.GetEvent,
      makeCall({ id: "evt_1" }),
    );

    expect(result.error).toBeNull();
    expect(getEventByIdMock).toHaveBeenCalledWith("evt_1");
    expect(result.response?.event?.id).toBe("evt_1");
  });

  it("CreateEvent hits createEvent repository path successfully", async () => {
    verifyAccessTokenMock.mockReturnValue("user_1");
    createEventMock.mockResolvedValue(eventFixture);

    const result = await callUnary(
      eventsServiceHandlers.CreateEvent,
      makeCall(
        {
          event: {
            title: eventFixture.title,
            tagline: eventFixture.tagline,
            description: eventFixture.description,
            date: eventFixture.date,
            time: eventFixture.time,
            location: eventFixture.location,
            mode: eventFixture.mode,
            category: eventFixture.category,
            capacity: eventFixture.capacity,
            priceLabel: eventFixture.priceLabel,
            host: eventFixture.host,
            coverGradient: eventFixture.coverGradient,
          },
        },
        "Bearer token",
      ),
    );

    expect(result.error).toBeNull();
    expect(verifyAccessTokenMock).toHaveBeenCalledWith("token");
    expect(createEventMock).toHaveBeenCalled();
    expect(result.response?.event?.id).toBe("evt_1");
  });

  it("UpdateEvent hits updateEvent repository path successfully", async () => {
    verifyAccessTokenMock.mockReturnValue("user_1");
    updateEventMock.mockResolvedValue(eventFixture);

    const result = await callUnary(
      eventsServiceHandlers.UpdateEvent,
      makeCall({ id: "evt_1", patch: { title: "Updated" } }, "Bearer token"),
    );

    expect(result.error).toBeNull();
    expect(updateEventMock).toHaveBeenCalledWith("evt_1", { title: "Updated" }, "user_1");
    expect(result.response?.event?.id).toBe("evt_1");
  });

  it("DeleteEvent hits deleteEvent repository path successfully", async () => {
    verifyAccessTokenMock.mockReturnValue("user_1");
    deleteEventMock.mockResolvedValue(true);

    const result = await callUnary(
      eventsServiceHandlers.DeleteEvent,
      makeCall({ id: "evt_1" }, "Bearer token"),
    );

    expect(result.error).toBeNull();
    expect(deleteEventMock).toHaveBeenCalledWith("evt_1", "user_1");
    expect(result.response?.deleted).toBe(true);
  });

  it("CreateEvent returns UNAUTHENTICATED when auth metadata is missing", async () => {
    const result = await callUnary(eventsServiceHandlers.CreateEvent, makeCall({ event: {} }));

    expect(result.response).toBeNull();
    expect((result.error as Error & { code?: number })?.code).toBe(status.UNAUTHENTICATED);
  });
});
