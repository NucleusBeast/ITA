import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

interface StatusError {
  statusCode?: number;
  message?: string;
}

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({ error: "Route not found" });
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const timestamp = new Date().toISOString();
  const statusError = (err ?? {}) as StatusError;
  const message = err instanceof Error ? err.message : "Unknown error";

  console.error(`[${timestamp}] ERROR ${req.method} ${req.originalUrl} - ${message}`);

  if (err instanceof ZodError) {
    res.status(400).json({
      error: "Validation failed",
      details: err.issues,
    });
    return;
  }

  if (typeof statusError.statusCode === "number") {
    res.status(statusError.statusCode).json({ error: statusError.message ?? "Request failed" });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
    return;
  }

  res.status(500).json({ error: "Internal server error" });
}
