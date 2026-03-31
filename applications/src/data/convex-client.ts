import { ConvexHttpClient } from "convex/browser";
import { env } from "../config/env";

const convexClient = new ConvexHttpClient(env.convexUrl);

if (env.convexAdminKey) {
  (convexClient as unknown as { setAdminAuth: (token: string) => void }).setAdminAuth(
    env.convexAdminKey,
  );
}

export { convexClient };
