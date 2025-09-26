// tests/unit/lib/db.test.ts
import { db } from "@/lib/db";

// Note: This is a Drizzle ORM instance that is difficult to unit test directly
// as it depends on database connection and configuration.
// Integration tests with a test database would be more appropriate.

describe("Database", () => {
  it("should export db instance", () => {
    expect(db).toBeDefined();
    expect(typeof db).toBe("object");
  });

  it("should have drizzle methods", () => {
    expect(db).toHaveProperty("select");
    expect(db).toHaveProperty("insert");
    expect(db).toHaveProperty("update");
    expect(db).toHaveProperty("delete");
    expect(typeof db.select).toBe("function");
    expect(typeof db.insert).toBe("function");
    expect(typeof db.update).toBe("function");
    expect(typeof db.delete).toBe("function");
  });

  // Additional tests would require a test database connection
  // which is better suited for integration testing
});
