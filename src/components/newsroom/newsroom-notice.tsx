import { newsroomNotice } from "@/lib/newsroom/fixtures";

export function NewsroomNotice() {
  return (
    <aside
      className="border-b border-[var(--urgent-dark)] bg-[var(--urgent-dark)] text-white"
      role="note"
    >
      <div className="page-shell flex gap-3 py-3 text-sm leading-6">
        <strong className="shrink-0">प्रोटोटाइप</strong>
        <p>{newsroomNotice}</p>
      </div>
    </aside>
  );
}
