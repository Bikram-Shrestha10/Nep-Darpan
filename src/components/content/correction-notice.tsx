import type { CorrectionNotice } from "@/lib/content/contracts";
import { PublishedTime } from "@/components/content/story-metadata";

export function CorrectionNoticePanel({ notice }: { notice: CorrectionNotice }) {
  return (
    <aside className="correction-notice" aria-label="सम्पादकीय सुधार सूचना">
      <p className="eyebrow">सम्पादकीय सुधार</p>
      <p className="correction-notice__text">{notice.text}</p>
      {notice.reason ? <p className="correction-notice__reason">कारण: {notice.reason}</p> : null}
      <PublishedTime value={notice.correctedAt} label="सुधार गरिएको" />
    </aside>
  );
}
