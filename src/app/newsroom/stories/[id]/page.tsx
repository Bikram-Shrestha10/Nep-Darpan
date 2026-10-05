import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { NewsroomStatus } from "@/components/newsroom/newsroom-status";
import { CorrectionForm } from "@/components/newsroom/correction-form";
import { newsroomStories } from "@/lib/newsroom/fixtures";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const story = newsroomStories.find((item) => item.id === id);
  return { title: story ? `${story.title} · समाचार कक्ष` : "नमुना समाचार भेटिएन" };
}
export default async function NewsroomStoryDetailPage({ params }: Props) {
  const { id } = await params;
  const story = newsroomStories.find((item) => item.id === id);
  if (!story) notFound();
  return (
    <>
      <NewsroomNotice />
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <nav aria-label="ब्रेडक्रम्ब">
          <ol className="flex gap-2 text-sm">
            <li>
              <Link href="/newsroom/stories">समाचार सूची</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">विवरण</li>
          </ol>
        </nav>
        <article className="mt-6">
          <header className="border-b-4 border-[var(--ink)] pb-5">
            <div className="flex flex-wrap items-center gap-3">
              <NewsroomStatus status={story.status} />
              <span className="eyebrow">
                {story.category} · {story.author}
              </span>
            </div>
            <h1 className="editorial-heading mt-3 max-w-4xl text-3xl font-bold sm:text-5xl">
              {story.title}
            </h1>
            <p className="mt-3 max-w-3xl text-lg leading-8 text-[var(--ink-soft)]">
              {story.summary}
            </p>
            <p className="mt-3 text-xs text-[var(--ink-soft)]">
              अन्तिम सम्पादन नमुना:{" "}
              <time dateTime={story.updatedAt}>
                {new Intl.DateTimeFormat("ne-NP", {
                  dateStyle: "medium",
                  timeZone: "Asia/Kathmandu",
                }).format(new Date(story.updatedAt))}
              </time>
            </p>
          </header>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <h2 className="editorial-heading text-2xl font-bold">लेख सामग्री</h2>
              <p className="article-body mt-4">{story.body}</p>
              <section
                className="mt-9 border-t-2 border-[var(--ink)] pt-5"
                aria-labelledby="correction-title"
              >
                <p className="eyebrow">सम्पादनपछिको अभिलेख</p>
                <h2 id="correction-title" className="editorial-heading mt-1 text-2xl font-bold">
                  सुधार प्रविष्टि नमुना
                </h2>
                <CorrectionForm />
              </section>
            </div>
            <aside className="h-fit border-t-4 border-[var(--ink)] bg-[var(--paper-muted)] p-4">
              <p className="eyebrow">कार्य</p>
              <div className="mt-3 grid gap-3">
                <Link className="button-primary" href={`/newsroom/stories/${story.id}/edit`}>
                  समाचार सम्पादन
                </Link>
                <Link className="button-secondary" href={`/newsroom/preview/${story.id}`}>
                  पूर्वावलोकन खोल्नुहोस्
                </Link>
                <Link className="button-secondary" href="/newsroom/review">
                  समीक्षा सूची
                </Link>
              </div>
            </aside>
          </div>
        </article>
      </main>
    </>
  );
}
