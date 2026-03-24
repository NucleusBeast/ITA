import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

let app: Awaited<ReturnType<typeof import("./app")["createApp"]>>;

beforeAll(async () => {
  process.env.JWT_SECRET ??= "test-secret";
  process.env.CONVEX_URL ??= "http://localhost:3210";

  const module = await import("./app");
  app = module.createApp();
});

describe("users service HTTP paths", () => {
  it("GET /health responds successfully", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.service).toBe("users");
    expect(response.body.status).toBe("ok");
  });

  it("GET /docs.json responds successfully", async () => {
    const response = await request(app).get("/docs.json");

    expect(response.status).toBe(200);
    expect(response.body.openapi).toBe("3.0.3");
    expect(response.body.info?.title).toBe("ITA Users Service API");
  });

  it("GET /missing-path returns route not found", async () => {
    const response = await request(app).get("/missing-path");

    expect(response.status).toBe(404);
    expect(response.body.error).toBe("Route not found");
  });
});
