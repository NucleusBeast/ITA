import path from "node:path";
import { credentials, loadPackageDefinition, Server, ServerCredentials } from "@grpc/grpc-js";
import { loadSync } from "@grpc/proto-loader";
import { env } from "../config/env";
import { eventsServiceHandlers } from "./service";

interface EventsPackage {
  events: {
    EventsService: {
      service: unknown;
    };
  };
}

export async function startGrpcServer(): Promise<void> {
  const protoPath = path.resolve(process.cwd(), "proto/events.proto");
  const packageDefinition = loadSync(protoPath, {
    keepCase: false,
    longs: String,
    enums: String,
    defaults: false,
    oneofs: true,
  });

  const loaded = loadPackageDefinition(packageDefinition) as unknown as EventsPackage;
  const grpcServer = new Server();

  grpcServer.addService(loaded.events.EventsService.service as any, eventsServiceHandlers);

  const bindAddress = `${env.host}:${env.grpcPort}`;

  await new Promise<void>((resolve, reject) => {
    grpcServer.bindAsync(bindAddress, ServerCredentials.createInsecure(), (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });

  grpcServer.start();
  console.log(`[${new Date().toISOString()}] events-service gRPC listening on ${bindAddress}`);
}

export const insecureClientCredentials = credentials.createInsecure();
