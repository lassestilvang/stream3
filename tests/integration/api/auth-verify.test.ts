// tests/integration/api/auth-verify.test.ts
import { GET } from "@/app/api/auth/verify/route";
import { db } from "@/lib/db";
import { users, verificationTokens } from "@/drizzle/schema";

// Mock dependencies
jest.mock("@/lib/db", () => ({
  db: {
    select: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
}));

describe("/api/auth/verify", () => {
  const mockDb = db as jest.Mocked<typeof db>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should verify email successfully with valid token", async () => {
    const validToken = "valid-verification-token";
    const userEmail = "test@example.com";
    const userId = "user-id";

    // Mock finding valid verification token
    mockDb.select.mockResolvedValueOnce([
      {
        identifier: userEmail,
        token: validToken,
        expires: new Date(Date.now() + 60 * 60 * 1000), // Future date
      },
    ]);

    // Mock finding user
    mockDb.select.mockResolvedValueOnce([
      {
        id: userId,
        email: userEmail,
        emailVerified: null,
      },
    ]);

    const request = new Request(`http://localhost:3000/api/auth/verify?token=${validToken}`);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBe("Email verified successfully");

    // Verify database calls
    expect(mockDb.select).toHaveBeenCalledTimes(2); // Token and user lookup

    expect(mockDb.update).toHaveBeenCalledWith(users);
    expect(mockDb.update).toHaveBeenCalledWith(
      expect.objectContaining({
        set: { emailVerified: expect.any(Date) },
        where: expect.anything(),
      })
    );

    expect(mockDb.delete).toHaveBeenCalledWith(verificationTokens);
  });

  it("should return error for missing token", async () => {
    const request = new Request("http://localhost:3000/api/auth/verify");

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Verification token is required");

    // Should not call database
    expect(mockDb.select).not.toHaveBeenCalled();
    expect(mockDb.update).not.toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("should return error for invalid token", async () => {
    const invalidToken = "invalid-token";

    // Mock no verification token found
    mockDb.select.mockResolvedValue([]);

    const request = new Request(`http://localhost:3000/api/auth/verify?token=${invalidToken}`);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Invalid or expired verification token");

    // Should not update or delete
    expect(mockDb.update).not.toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("should return error for expired token", async () => {
    const expiredToken = "expired-token";

    // Mock finding expired verification token
    mockDb.select.mockResolvedValueOnce([
      {
        identifier: "test@example.com",
        token: expiredToken,
        expires: new Date(Date.now() - 60 * 60 * 1000), // Past date
      },
    ]);

    const request = new Request(`http://localhost:3000/api/auth/verify?token=${expiredToken}`);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.message).toBe("Invalid or expired verification token");

    // Should not update or delete
    expect(mockDb.update).not.toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("should return error when user not found", async () => {
    const validToken = "valid-token";
    const userEmail = "nonexistent@example.com";

    // Mock finding valid verification token
    mockDb.select.mockResolvedValueOnce([
      {
        identifier: userEmail,
        token: validToken,
        expires: new Date(Date.now() + 60 * 60 * 1000),
      },
    ]);

    // Mock user not found
    mockDb.select.mockResolvedValueOnce([]);

    const request = new Request(`http://localhost:3000/api/auth/verify?token=${validToken}`);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.message).toBe("User not found");

    // Should not update or delete
    expect(mockDb.update).not.toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });

  it("should handle database errors gracefully", async () => {
    const validToken = "valid-token";

    // Mock database error
    mockDb.select.mockRejectedValue(new Error("Database connection failed"));

    const request = new Request(`http://localhost:3000/api/auth/verify?token=${validToken}`);

    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.message).toBe("Internal server error");
  });
});