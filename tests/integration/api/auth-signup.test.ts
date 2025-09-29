// tests/integration/api/auth-signup.test.ts
import { POST } from "@/app/api/auth/signup/route";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  db: {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

jest.mock("@/lib/email", () => ({
  sendVerificationEmail: jest.fn(),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

jest.mock("crypto", () => ({
  randomUUID: jest.fn(),
}));

describe("/api/auth/signup", () => {
  const mockDb = db as jest.Mocked<typeof db>;
  const mockSendVerificationEmail = require("@/lib/email").sendVerificationEmail as jest.Mock;
  const mockBcryptHash = require("bcrypt").hash as jest.Mock;
  const mockRandomUUID = require("crypto").randomUUID as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockBcryptHash.mockResolvedValue("hashed-password");
    mockRandomUUID.mockReturnValue("mock-uuid-token");
  });

  it("should create user successfully with valid data", async () => {
    // Mock no existing user
    mockDb.select.mockResolvedValue([]);

    // Mock user creation
    mockDb.insert.mockResolvedValueOnce([{ id: "user-id" }]);

    // Mock email sending
    mockSendVerificationEmail.mockResolvedValue(undefined);

    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("Account created. Please check your email for verification.");

    // Verify database calls
    expect(mockDb.select).toHaveBeenCalledWith(
      expect.objectContaining({
        from: users,
        where: eq(users.email, "test@example.com"),
      })
    );

    expect(mockBcryptHash).toHaveBeenCalledWith("TestPass123", 12);

    expect(mockDb.insert).toHaveBeenCalledWith(users);
    expect(mockDb.insert).toHaveBeenCalledWith(verificationTokens);

    expect(mockSendVerificationEmail).toHaveBeenCalledWith("test@example.com", "mock-uuid-token");
  });

  it("should return validation errors for invalid data", async () => {
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "A", // Too short
        email: "invalid-email", // Invalid format
        password: "weak", // Too short and missing requirements
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.errors).toEqual({
      name: "Name must be at least 2 characters",
      email: "Please enter a valid email",
      password: "Password must be at least 8 characters",
    });

    // Should not call database or email
    expect(mockDb.select).not.toHaveBeenCalled();
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  it("should return error for duplicate email", async () => {
    // Mock existing user
    mockDb.select.mockResolvedValue([{ id: "existing-user-id", email: "test@example.com" }]);

    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.errors.email).toBe("An account with this email already exists");

    // Should not create user or send email
    expect(mockDb.insert).not.toHaveBeenCalled();
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  it("should handle password hashing failure", async () => {
    // Mock no existing user
    mockDb.select.mockResolvedValue([]);

    // Mock bcrypt failure
    mockBcryptHash.mockRejectedValue(new Error("Hashing failed"));

    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal server error");

    // Should not create user or send email
    expect(mockDb.insert).not.toHaveBeenCalled();
    expect(mockSendVerificationEmail).not.toHaveBeenCalled();
  });

  it("should handle email sending failure gracefully", async () => {
    // Mock no existing user
    mockDb.select.mockResolvedValue([]);

    // Mock user creation
    mockDb.insert.mockResolvedValueOnce([{ id: "user-id" }]);

    // Mock email failure
    mockSendVerificationEmail.mockRejectedValue(new Error("Email failed"));

    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Test User",
        email: "test@example.com",
        password: "TestPass123",
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    // Should still succeed despite email failure
    expect(response.status).toBe(201);
    expect(data.message).toBe("Account created. Please check your email for verification.");

    // User should still be created
    expect(mockDb.insert).toHaveBeenCalledWith(users);
  });

  it("should handle malformed JSON", async () => {
    const request = new Request("http://localhost:3000/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "invalid json",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal server error");
  });
});