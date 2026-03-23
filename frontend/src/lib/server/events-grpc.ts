import "server-only";

import path from "node:path";
import { credentials, loadPackageDefinition, Metadata } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";

const EVENTS_GRPC_ADDRESS = process.env.EVENTS_GRPC_ADDRESS ?? "events:8080";
const EVENTS_PROTO_PATH = path.resolve(process.cwd(), "src/lib/server/proto/events.proto");

type EventMessage = {
  id: string;
  title: string;
  tagline: string;
  description: string;
  date: string;
  time: string;
  location: string;
  mode: string;
  category: string;
  capacity: number;
  registered: number;
  priceLabel: string;
  host: string;
  coverGradient: string;
  featured: boolean;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
};

type EventsServiceClient = {
  ListEvents: (
    request: { category?: string },
    metadata: Metadata,
    callback: (error: Error | null, response?: { events?: EventMessage[] }) => void,
  ) => void;
  GetEvent: (
    request: { id: string },
    metadata: Metadata,
    callback: (error: Error | null, response?: { event?: EventMessage }) => void,
  ) => void;
  CreateEvent: (
    request: { event: Record<string, unknown> },
    metadata: Metadata,
    callback: (error: Error | null, response?: { event?: EventMessage }) => void,
  ) => void;
  UpdateEvent: (
    request: { id: string; patch: Record<string, unknown> },
    metadata: Metadata,
    callback: (error: Error | null, response?: { event?: EventMessage }) => void,
  ) => void;
  DeleteEvent: (
    request: { id: string },
    metadata: Metadata,
    callback: (error: Error | null, response?: { deleted?: boolean }) => void,
  ) => void;
};

interface EventsPackage {
  events: {
    EventsService: {
      new (address: string, creds: ReturnType<typeof credentials.createInsecure>): EventsServiceClient;
    };
  };
}

const packageDefinition = loadSync(EVENTS_PROTO_PATH, {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: false,
  oneofs: true,
});
const loaded = loadPackageDefinition(packageDefinition) as unknown as EventsPackage;
const client = new loaded.events.EventsService(
  EVENTS_GRPC_ADDRESS,
  credentials.createInsecure(),
);

function createMetadata(token?: string): Metadata {
  const metadata = new Metadata();
  if (token) {
    metadata.set("authorization", `Bearer ${token}`);
  }
  return metadata;
}

function callGrpc<TRequest, TResponse>(
  method: (request: TRequest, metadata: Metadata, callback: (error: Error | null, response?: TResponse) => void) => void,
  request: TRequest,
  token?: string,
): Promise<TResponse> {
  return new Promise<TResponse>((resolve, reject) => {
    method(request, createMetadata(token), (error, response) => {
      if (error) {
        reject(error);
        return;
      }

      resolve((response ?? {}) as TResponse);
    });
  });
}

export async function grpcListEvents(category?: string): Promise<EventMessage[]> {
  const response = await callGrpc(client.ListEvents.bind(client), { category });
  return response.events ?? [];
}

export async function grpcGetEvent(id: string): Promise<EventMessage | null> {
  try {
    const response = await callGrpc(client.GetEvent.bind(client), { id });
    return response.event ?? null;
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 5) {
      return null;
    }

    throw error;
  }
}

export async function grpcCreateEvent(
  event: Record<string, unknown>,
  token?: string,
): Promise<EventMessage | null> {
  const response = await callGrpc(client.CreateEvent.bind(client), { event }, token);
  return response.event ?? null;
}

export async function grpcUpdateEvent(
  id: string,
  patch: Record<string, unknown>,
  token?: string,
): Promise<EventMessage | null> {
  try {
    const response = await callGrpc(client.UpdateEvent.bind(client), { id, patch }, token);
    return response.event ?? null;
  } catch (error) {
    const code = (error as { code?: number }).code;
    if (code === 5) {
      return null;
    }

    throw error;
  }
}

export async function grpcDeleteEvent(id: string, token?: string): Promise<boolean> {
  const response = await callGrpc(client.DeleteEvent.bind(client), { id }, token);
  return Boolean(response.deleted);
}
