"use client";

import type { CorrectionNotice } from "@/lib/content/contracts";
import { PublishedTime } from "@/components/content/story-metadata";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";

export function CorrectionNoticePanel({ notice }: { notice: CorrectionNotice }) {
  const { language } = useSitePreferences();
  return (
    <aside
      className="correction-notice"
      aria-label={language === "en" ? "Editorial correction notice" : "सम्पादकीय सुधार सूचना"}
    >
      <p className="eyebrow">
        <LocalizedText ne="सम्पादकीय सुधार" />
      </p>
      <p className="correction-notice__text">
        <LocalizedText ne={notice.text} />
      </p>
      {notice.reason ? (
        <p className="correction-notice__reason">
          <LocalizedText ne="कारण" />: <LocalizedText ne={notice.reason} />
        </p>
      ) : null}
      <PublishedTime value={notice.correctedAt} label="सुधार गरिएको" />
    </aside>
  );
}
