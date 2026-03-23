import type { NextFunction, Request, Response } from "express";

function formatNow(): string {
  return new Date().toISOString();
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const start = process.hrtime.bigint();

  res.on("finish", () => {
    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    const message = [
      `[${formatNow()}]`,
      req.method,
      req.originalUrl,
      String(res.statusCode),
      `${durationMs.toFixed(2)}ms`,
    ].join(" ");

    console.log(message);
  });

  next();
}
