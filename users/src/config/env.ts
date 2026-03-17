import "dotenv/config";

const requiredKeys = ["JWT_SECRET", "CONVEX_URL"] as const;

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 8082),
  corsOrigin: process.env.CORS_ORIGIN ?? "http://localhost:3000",
  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "1h",
  convexUrl: process.env.CONVEX_URL as string,
  convexAdminKey: process.env.CONVEX_ADMIN_KEY,
};
