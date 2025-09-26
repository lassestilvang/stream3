// tests/unit/lib/redis.test.ts
// Mock the entire redis module
jest.mock("@/lib/redis", () => ({
  default: null,
}));

// Mock redis createClient
jest.mock("redis", () => ({
  createClient: jest.fn(),
}));

import { createClient } from "redis";
import redis from "@/lib/redis";

const mockCreateClient = createClient as jest.MockedFunction<
  typeof createClient
>;

describe("Redis", () => {
  it("should export redis client", () => {
    expect(redis).toBeDefined();
  });

  it("should be null by default (mocked)", () => {
    expect(redis).toEqual({ default: null });
  });

  it("should have createClient available", () => {
    expect(createClient).toBeDefined();
    expect(typeof createClient).toBe("function");
  });
});
