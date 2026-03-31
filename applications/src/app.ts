import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { requestLogger } from "./middleware/request-logger";
import { applicationsRouter } from "./routes/applications";
import { healthRouter } from "./routes/health";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());
  app.use(requestLogger);

  app.use("/", healthRouter);
  app.use("/", applicationsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
