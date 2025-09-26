// tests/unit/lib/utils.test.ts
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("should merge class names correctly", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    expect(cn("class1", true && "class2", false && "class3")).toBe(
      "class1 class2"
    );
  });

  it("should merge conflicting Tailwind classes", () => {
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
  });

  it("should handle undefined and null values", () => {
    expect(cn("class1", undefined, null, "class2")).toBe("class1 class2");
  });

  it("should handle array inputs", () => {
    expect(cn(["class1", "class2"])).toBe("class1 class2");
  });

  it("should handle object inputs", () => {
    expect(cn({ class1: true, class2: false })).toBe("class1");
  });
});
