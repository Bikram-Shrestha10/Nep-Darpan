"use client";

import { useState } from "react";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";

export function ArticleShare() {
  const { language } = useSitePreferences();
  const [message, setMessage] = useState("");

  async function shareArticle() {
    const shareData = { title: document.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setMessage(language === "en" ? "Share menu opened." : "साझा मेनु खोलियो।");
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }

    try {
      await navigator.clipboard.writeText(shareData.url);
      setMessage(language === "en" ? "Story link copied." : "समाचारको लिङ्क प्रतिलिपि गरियो।");
    } catch {
      setMessage(
        language === "en"
          ? "Could not copy the link. Share this page using the browser address."
          : "लिङ्क प्रतिलिपि गर्न सकिएन। ब्राउजर ठेगानाबाट यो पृष्ठ साझा गर्नुहोस्।",
      );
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button className="button-secondary" onClick={shareArticle} type="button">
        <LocalizedText ne="समाचार साझा गर्नुहोस्" />
      </button>
      {message ? (
        <p className="text-sm text-[var(--ink-soft)]" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
