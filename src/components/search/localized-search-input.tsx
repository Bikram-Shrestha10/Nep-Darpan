"use client";

import { useSitePreferences } from "@/components/layout/site-preferences";

export function LocalizedSearchInput({
  defaultValue,
  accessibleLabel,
}: {
  defaultValue: string;
  accessibleLabel?: { ne: string; en: string };
}) {
  const { language } = useSitePreferences();
  return (
    <input
      className="field search-panel__query"
      id="search-query"
      name="q"
      type="search"
      maxLength={120}
      aria-label={
        accessibleLabel ? (language === "en" ? accessibleLabel.en : accessibleLabel.ne) : undefined
      }
      placeholder={
        language === "en" ? "Search stories, topics, or headlines" : "समाचार, विषय वा शीर्षक खोज्नुहोस्"
      }
      defaultValue={defaultValue}
    />
  );
}
