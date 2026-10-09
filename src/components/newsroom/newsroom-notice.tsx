import { LocalizedText } from "@/components/layout/site-preferences";
import { newsroomNotice } from "@/lib/newsroom/fixtures";

export function NewsroomNotice() {
  return (
    <aside className="border-b border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)]" role="note">
      <div className="page-shell flex gap-3 py-3 text-sm leading-6">
        <strong className="shrink-0">
          <LocalizedText ne="प्रोटोटाइप" />
        </strong>
        <p>
          <LocalizedText ne={newsroomNotice} />
        </p>
      </div>
    </aside>
  );
}
