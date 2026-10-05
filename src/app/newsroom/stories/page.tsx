import type { Metadata } from "next";
import Link from "next/link";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { NewsroomStatus } from "@/components/newsroom/newsroom-status";
import { newsroomStories } from "@/lib/newsroom/fixtures";

export const metadata: Metadata = { title: "समाचार सूची · समाचार कक्ष" };
type Props = { searchParams: Promise<{ status?: string }> };
export default async function NewsroomStoriesPage({ searchParams }: Props) {
  const { status } = await searchParams;
  const stories =
    status && ["draft", "in_review", "scheduled", "published"].includes(status)
      ? newsroomStories.filter((story) => story.status === status)
      : newsroomStories;
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <header className="flex flex-wrap items-end justify-between gap-3 border-b-4 border-[var(--ink)] pb-5">
          <div>
            <p className="eyebrow">सम्पादकीय व्यवस्थापन · काल्पनिक डाटा</p>
            <h1 className="editorial-heading mt-2 text-4xl font-bold">समाचार सूची</h1>
          </div>
          <Link className="button-primary" href="/newsroom/stories/new">
            + नयाँ समाचार
          </Link>
        </header>
        <nav className="mt-5 flex flex-wrap gap-2" aria-label="स्थिति फिल्टर">
          {[
            ["सबै", "/newsroom/stories"],
            ["मस्यौदा", "?status=draft"],
            ["समीक्षा", "?status=in_review"],
            ["समय तोकिएको", "?status=scheduled"],
            ["प्रकाशित", "?status=published"],
          ].map(([label, href]) => (
            <Link
              className="story-category"
              href={href.startsWith("?") ? `/newsroom/stories${href}` : href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        {stories.length ? (
          <div className="mt-5 overflow-x-auto border border-[var(--rule)]">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="sr-only">काल्पनिक समाचारको स्थिति सूची</caption>
              <thead className="bg-[var(--paper-muted)]">
                <tr>
                  <th className="p-3">शीर्षक</th>
                  <th className="p-3">खण्ड</th>
                  <th className="p-3">लेखक</th>
                  <th className="p-3">स्थिति</th>
                  <th className="p-3">कार्य</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((story) => (
                  <tr key={story.id} className="border-t border-[var(--rule)]">
                    <td className="p-3 font-bold">{story.title}</td>
                    <td className="p-3">{story.category}</td>
                    <td className="p-3">{story.author}</td>
                    <td className="p-3">
                      <NewsroomStatus status={story.status} />
                    </td>
                    <td className="p-3">
                      <Link className="font-bold underline" href={`/newsroom/stories/${story.id}`}>
                        विवरण
                      </Link>
                      <span aria-hidden="true"> · </span>
                      <Link
                        className="font-bold underline"
                        href={`/newsroom/stories/${story.id}/edit`}
                      >
                        सम्पादन
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <section className="state-panel mt-5">
            <h2 className="editorial-heading text-xl font-bold">यो स्थितिमा सामग्री छैन</h2>
            <p className="mt-2 text-sm">अर्को फिल्टर छानेर हेर्नुहोस्।</p>
          </section>
        )}
      </main>
    </>
  );
}
