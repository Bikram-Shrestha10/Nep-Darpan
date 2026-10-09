"use client";

import Link from "next/link";
import {
  LocalizedNumber,
  LocalizedText,
  useSitePreferences,
} from "@/components/layout/site-preferences";
import type { PageInfo } from "@/lib/content/contracts";

export function PageNavigation({
  pageInfo,
  label,
  labelEn,
  previousHref,
  nextHref,
}: {
  pageInfo: PageInfo;
  label: string;
  labelEn?: string;
  previousHref?: string;
  nextHref?: string;
}) {
  const { language } = useSitePreferences();
  if (pageInfo.totalPages <= 1) return null;
  return (
    <nav
      className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-4"
      aria-label={language === "en" ? `${labelEn ?? label} navigation` : label}
    >
      <p className="text-sm">
        <LocalizedText ne="पृष्ठ" /> <LocalizedNumber value={pageInfo.page} /> /{" "}
        <LocalizedNumber value={pageInfo.totalPages} />
      </p>
      <div className="flex gap-2">
        {previousHref ? (
          <Link className="button-secondary" href={previousHref}>
            ← <LocalizedText ne="अघिल्लो" />
          </Link>
        ) : null}
        {nextHref ? (
          <Link className="button-primary" href={nextHref}>
            <LocalizedText ne="अर्को" /> →
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
