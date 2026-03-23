import cors from "cors";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env";
import { openApiDocument } from "./docs/openapi";
import { requestLogger } from "./middleware/request-logger";
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
  app.use(requestLogger);

  app.get("/docs.json", (_req, res) => {
    res.status(200).json(openApiDocument);
  });
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.use("/", healthRouter);
  app.use("/", authRouter);
  app.use("/", usersRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
