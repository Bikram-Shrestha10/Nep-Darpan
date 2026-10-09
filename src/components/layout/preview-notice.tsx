"use client";

import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
import { MOCK_DATA_NOTICE } from "@/lib/content/mock-gateway";

export function PreviewNotice() {
  const { language } = useSitePreferences();
  return (
    <aside
      className="border-b border-[var(--rule)] bg-[var(--paper-muted)] text-[var(--ink)]"
      aria-label={language === "en" ? "Preview notice" : "पूर्वावलोकन सूचना"}
    >
      <div className="page-shell flex min-h-10 items-center gap-3 py-2 text-xs sm:text-sm">
        <strong className="shrink-0 bg-[var(--ink)] px-2 py-1 text-[0.68rem] text-[var(--paper)]">
          <LocalizedText ne="नमुना" en="Preview" />
        </strong>
        <p>
          <LocalizedText
            ne={MOCK_DATA_NOTICE}
            en="The interface and fictional sample copy are shown in English for preview. All sample content is fictional and is not verified news."
          />
        </p>
      </div>
    </aside>
  );
}
