import { describe, expect, it } from "vitest";
import { parseAppEnvironment } from "@/lib/config/environment";

describe("application environment", () => {
  it("defaults to development when NODE_ENV is not supplied", () => {
    expect(parseAppEnvironment({})).toEqual({ nodeEnvironment: "development" });
  });

  it("accepts supported runtime environments", () => {
    expect(parseAppEnvironment({ NODE_ENV: "test" })).toEqual({ nodeEnvironment: "test" });
  });

  it("rejects invalid runtime environments", () => {
    expect(() => parseAppEnvironment({ NODE_ENV: "staging" })).toThrow(
      "NODE_ENV must be development, production, or test.",
    );
  });
});
