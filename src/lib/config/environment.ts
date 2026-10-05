export type NodeEnvironment = "development" | "production" | "test";

export interface AppEnvironment {
  nodeEnvironment: NodeEnvironment;
}

export function parseAppEnvironment(input: Record<string, string | undefined>): AppEnvironment {
  const nodeEnvironment = input.NODE_ENV ?? "development";

  if (
    nodeEnvironment !== "development" &&
    nodeEnvironment !== "production" &&
    nodeEnvironment !== "test"
  ) {
    throw new Error("NODE_ENV must be development, production, or test.");
  }

  return { nodeEnvironment };
}

export const appEnvironment = parseAppEnvironment(process.env);
