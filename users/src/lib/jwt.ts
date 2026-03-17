import jwt from "jsonwebtoken";
import { env } from "../config/env";

interface JwtPayload {
  sub: string;
}

export function signAccessToken(userId: string): string {
  const options: jwt.SignOptions = {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions["expiresIn"],
  };

  return jwt.sign({ sub: userId }, env.jwtSecret, options);
}

export function verifyAccessToken(token: string): string {
  const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
  if (!payload.sub) {
    throw new Error("Invalid token subject");
  }

  return payload.sub;
}
