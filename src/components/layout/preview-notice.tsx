import { MOCK_DATA_NOTICE } from "@/lib/content/mock-gateway";

export function PreviewNotice() {
  return (
    <aside
      className="border-b border-[var(--rule)] bg-[var(--ink)] text-white"
      aria-label="नमुना सामग्री सूचना"
    >
      <div className="page-shell flex min-h-11 items-center gap-3 py-2 text-sm">
        <strong className="shrink-0 bg-[var(--urgent)] px-2 py-1 text-xs">पूर्वावलोकन</strong>
        <p>{MOCK_DATA_NOTICE}</p>
      </div>
    </aside>
  );
}
