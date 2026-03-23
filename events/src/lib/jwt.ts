import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  sub: string;
}

export function verifyAccessToken(token: string): string {
  const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
  if (!payload.sub) {
    throw new Error("Invalid token subject");
  }

  return payload.sub;
}
