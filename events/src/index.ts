import { startGrpcServer } from "./grpc/server";

startGrpcServer().catch((error) => {
  console.error(`[${new Date().toISOString()}] events-service startup failure`, error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error(`[${new Date().toISOString()}] UNHANDLED_REJECTION`, reason);
});

process.on("uncaughtException", (error) => {
  console.error(`[${new Date().toISOString()}] UNCAUGHT_EXCEPTION`, error);
});
