import type { PublicContentGateway } from "@/lib/content/contracts";
import { mockContentGateway } from "@/lib/content/mock-gateway";

// Keep application routes bound to the interface while Phase 1 runs on fictional fixtures.
export const contentGateway: PublicContentGateway = mockContentGateway;
