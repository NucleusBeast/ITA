import { createApp } from "./app";
import { env } from "./config/env";

const app = createApp();

app.listen(env.port, () => {
  console.log(`[${new Date().toISOString()}] users-service listening on port ${env.port}`);
  console.log(`[${new Date().toISOString()}] Swagger UI available at http://localhost:${env.port}/docs`);
});

process.on("unhandledRejection", (reason) => {
  console.error(`[${new Date().toISOString()}] UNHANDLED_REJECTION`, reason);
});

process.on("uncaughtException", (error) => {
  console.error(`[${new Date().toISOString()}] UNCAUGHT_EXCEPTION`, error);
});
