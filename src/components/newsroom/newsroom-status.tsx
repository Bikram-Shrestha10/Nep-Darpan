import type { WorkflowStatus } from "@/lib/newsroom/fixtures";
import { workflowStatusLabels } from "@/lib/newsroom/fixtures";

export function NewsroomStatus({ status }: { status: WorkflowStatus }) {
  return (
    <span className="inline-flex border border-[var(--rule-strong)] bg-[var(--paper-muted)] px-2 py-1 text-xs font-bold">
      {workflowStatusLabels[status]}
    </span>
  );
}
