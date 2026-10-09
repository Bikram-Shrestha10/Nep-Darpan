import type { Metadata } from "next";
import Link from "next/link";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { NewsroomStoryLibrary } from "@/components/newsroom/newsroom-story-library";
import { LocalizedText } from "@/components/layout/site-preferences";

export const metadata: Metadata = { title: "समाचार सूची · समाचार कक्ष" };
export default async function NewsroomStoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status = "all" } = await searchParams;
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b-4 border-[var(--ink)] pb-5">
          <div>
            <p className="eyebrow">
              <LocalizedText ne="सम्पादकीय व्यवस्थापन · काल्पनिक डाटा" />
            </p>
            <h1 className="editorial-heading mt-2 text-4xl font-bold">
              <LocalizedText ne="समाचार सूची" />
            </h1>
          </div>
          <Link className="button-primary" href="/newsroom/stories/new">
            <LocalizedText ne="+ नयाँ समाचार" />
          </Link>
        </header>
        <NewsroomStoryLibrary initialStatus={status} />
      </main>
    </>
  );
}
