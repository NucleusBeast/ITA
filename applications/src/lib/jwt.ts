import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface AccessTokenPayload {
  sub: string;
}

export function verifyAccessToken(token: string): string {
  const payload = jwt.verify(token, env.jwtSecret) as AccessTokenPayload;

  if (!payload?.sub) {
    throw new Error("Invalid token subject");
  }

  return payload.sub;
}
