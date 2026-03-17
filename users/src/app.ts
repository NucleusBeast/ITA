import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { authRouter } from "./routes/auth";
import { healthRouter } from "./routes/health";
import { usersRouter } from "./routes/users";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.corsOrigin,
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use("/", healthRouter);
  app.use("/", authRouter);
  app.use("/", usersRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
