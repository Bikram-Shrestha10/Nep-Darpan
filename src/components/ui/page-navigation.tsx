import Link from "next/link";
import type { PageInfo } from "@/lib/content/contracts";

export function PageNavigation({
  pageInfo,
  label,
  hrefForPage,
}: {
  pageInfo: PageInfo;
  label: string;
  hrefForPage: (page: number) => string;
}) {
  if (pageInfo.totalPages <= 1) return null;
  const number = new Intl.NumberFormat("ne-NP");

  return (
    <nav
      className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--rule)] pt-4"
      aria-label={label}
    >
      <p className="text-sm">
        पृष्ठ {number.format(pageInfo.page)} / {number.format(pageInfo.totalPages)}
      </p>
      <div className="flex gap-2">
        {pageInfo.page > 1 ? (
          <Link className="button-secondary" href={hrefForPage(pageInfo.page - 1)}>
            ← अघिल्लो
          </Link>
        ) : null}
        {pageInfo.page < pageInfo.totalPages ? (
          <Link className="button-primary" href={hrefForPage(pageInfo.page + 1)}>
            अर्को →
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
