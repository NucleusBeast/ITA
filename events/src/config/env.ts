import "dotenv/config";

const requiredKeys = ["JWT_SECRET", "CONVEX_URL"] as const;

for (const key of requiredKeys) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

export const env = {
  grpcPort: Number(process.env.GRPC_PORT ?? process.env.PORT ?? 8080),
  host: process.env.HOST ?? "0.0.0.0",
  jwtSecret: process.env.JWT_SECRET as string,
  convexUrl: process.env.CONVEX_URL as string,
  convexAdminKey: process.env.CONVEX_ADMIN_KEY,
};
