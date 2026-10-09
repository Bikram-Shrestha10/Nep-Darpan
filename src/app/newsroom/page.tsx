import type { Metadata } from "next";
import Link from "next/link";
import { LocalizedText } from "@/components/layout/site-preferences";
import { NewsroomNotice } from "@/components/newsroom/newsroom-notice";
import { NewsroomStatus } from "@/components/newsroom/newsroom-status";
import {
  NewsroomCategory,
  NewsroomStoryKind,
  NewsroomText,
} from "@/components/newsroom/newsroom-text";
import { newsroomStories } from "@/lib/newsroom/fixtures";

export const metadata: Metadata = { title: "समाचार कक्ष ड्यासबोर्ड" };

const metrics = [
  {
    title: "मस्यौदा",
    en: "Drafts",
    status: "draft",
    href: "/newsroom/stories?status=draft",
    note: "सम्पादन जारी",
    enNote: "In progress",
  },
  {
    title: "समीक्षामा",
    en: "In review",
    status: "in_review",
    href: "/newsroom/review",
    note: "सम्पादकको ध्यान चाहिन्छ",
    enNote: "Needs an editor",
  },
  {
    title: "समय तोकिएको",
    en: "Scheduled",
    status: "scheduled",
    href: "/newsroom/stories?status=scheduled",
    note: "प्रकाशन नमुना",
    enNote: "Demo schedule",
  },
  {
    title: "प्रकाशित नमुना",
    en: "Published demo",
    status: "published",
    href: "/newsroom/stories?status=published",
    note: "वास्तविक समाचार होइन",
    enNote: "Not real news",
  },
] as const;

const shortcuts = [
  { ne: "सुधार र अद्यावधिक", en: "Corrections & updates", href: "/newsroom/corrections", mark: "C" },
  { ne: "गृहपृष्ठ संयोजन", en: "Homepage curation", href: "/newsroom/homepage", mark: "H" },
  { ne: "जानकारी केन्द्र", en: "Information hub", href: "/newsroom/hub", mark: "I" },
  { ne: "खण्ड र विषय", en: "Sections & topics", href: "/newsroom/categories", mark: "T" },
  { ne: "कर्मचारी र भूमिका", en: "Staff & roles", href: "/newsroom/staff", mark: "U" },
  { ne: "गतिविधि अभिलेख", en: "Activity log", href: "/newsroom/audit", mark: "A" },
];

export default function NewsroomDashboard() {
  return (
    <main id="main-content" tabIndex={-1} className="page-shell py-6 sm:py-9">
      <NewsroomNotice />
      <header className="mt-6 flex flex-wrap items-end justify-between gap-4 border-b-2 border-[var(--ink)] pb-5">
        <div>
          <p className="eyebrow text-[var(--ink-soft)]">
            <LocalizedText ne="सम्पादकीय कार्यक्षेत्र · डेमो" />
          </p>
          <h2 className="editorial-heading mt-2 text-3xl font-black sm:text-4xl">
            <LocalizedText ne="ड्यासबोर्ड" />
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-soft)]">
            <NewsroomText
              ne="डेमो भूमिका: सम्पादक · सबै संख्या स्थानीय नमुना हुन्"
              en="Demo role: editor · all counts use local sample data"
            />
          </p>
        </div>
        <Link className="button-primary" href="/newsroom/stories/new">
          <LocalizedText ne="+ नयाँ समाचार" />
        </Link>
      </header>

      <section aria-labelledby="work-summary" className="mt-6">
        <h3 className="sr-only" id="work-summary">
          <LocalizedText ne="नमुना कार्य सारांश" />
        </h3>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => {
            const count = newsroomStories.filter((story) => story.status === metric.status).length;
            return (
              <article
                className="rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)] p-5 shadow-sm"
                key={metric.status}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="eyebrow text-[var(--ink-soft)]">
                      <NewsroomText ne={metric.title} en={metric.en} />
                    </p>
                    <p className="mt-2 text-4xl font-black tabular-nums">{count}</p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="flex size-10 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--paper-muted)] text-sm font-black"
                  >
                    {metric.status === "in_review" ? "R" : metric.status.slice(0, 1).toUpperCase()}
                  </span>
                </div>
                <div className="mt-4 flex items-end justify-between gap-3">
                  <p className="text-xs leading-5 text-[var(--ink-soft)]">
                    <NewsroomText ne={metric.note} en={metric.enNote} />
                  </p>
                  <Link
                    className="shrink-0 text-xs font-bold underline underline-offset-2"
                    href={metric.href}
                  >
                    <NewsroomText ne="खोल्नुहोस्" en="Open" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid gap-5 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <section
          aria-labelledby="recent-stories"
          className="rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)] p-4 sm:p-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[var(--rule)] pb-4">
            <div>
              <p className="eyebrow">
                <NewsroomText ne="कार्य सूची" en="Work queue" />
              </p>
              <h3 id="recent-stories" className="editorial-heading mt-1 text-2xl font-bold">
                <NewsroomText ne="हालका नमुना समाचार" en="Recent demo stories" />
              </h3>
            </div>
            <Link
              className="text-sm font-bold underline underline-offset-2"
              href="/newsroom/stories"
            >
              <NewsroomText ne="सबै सामग्री" en="All stories" /> →
            </Link>
          </div>
          <ul className="divide-y divide-[var(--rule)]">
            {newsroomStories.map((story) => (
              <li className="flex flex-wrap items-center justify-between gap-3 py-4" key={story.id}>
                <div className="min-w-0">
                  <Link
                    className="font-bold underline decoration-[var(--rule)] underline-offset-4"
                    href={`/newsroom/stories/${story.id}`}
                  >
                    <LocalizedText ne={story.title} />
                  </Link>
                  <p className="mt-1 text-xs text-[var(--ink-soft)]">
                    <NewsroomCategory value={story.category} /> ·{" "}
                    <LocalizedText ne={story.author} /> ·{" "}
                    <span className="uppercase">
                      <NewsroomStoryKind value={story.kind ?? "news"} />
                    </span>
                  </p>
                </div>
                <NewsroomStatus status={story.status} />
              </li>
            ))}
          </ul>
        </section>

        <aside className="grid content-start gap-5">
          <section
            className="rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)] p-4 sm:p-5"
            aria-labelledby="quick-access-title"
          >
            <p className="eyebrow">
              <NewsroomText ne="नेभिगेसन" en="Navigation" />
            </p>
            <h3 id="quick-access-title" className="editorial-heading mt-1 text-xl font-bold">
              <NewsroomText ne="सम्पादकीय उपकरण" en="Editorial tools" />
            </h3>
            <ul className="mt-3 grid gap-1">
              {shortcuts.map((item) => (
                <li key={item.href}>
                  <Link
                    className="flex min-h-11 items-center gap-3 rounded-lg px-2 text-sm font-bold no-underline hover:bg-[var(--paper-muted)]"
                    href={item.href}
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-7 items-center justify-center rounded border border-[var(--rule)] text-xs"
                    >
                      {item.mark}
                    </span>
                    <NewsroomText ne={item.ne} en={item.en} />
                    <span aria-hidden="true" className="ml-auto">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section
            className="rounded-xl border-l-4 border-[var(--ink)] bg-[var(--paper-muted)] p-5"
            aria-labelledby="workflow-note-title"
          >
            <p className="eyebrow">
              <NewsroomText ne="प्रकाशन कार्यप्रवाह" en="Publication workflow" />
            </p>
            <h3 id="workflow-note-title" className="editorial-heading mt-1 text-xl font-bold">
              <NewsroomText ne="स्वीकृति भनेको प्रकाशन होइन" en="Approval is not publication" />
            </h3>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-soft)]">
              <NewsroomText
                ne="समाचार समीक्षा, स्वीकृति, समय निर्धारण र प्रकाशन अलग चरण हुन्। यो नमुनाले कुनै वास्तविक समाचार सार्वजनिक गर्दैन।"
                en="Review, approval, scheduling, and publication are separate steps. This prototype publishes nothing."
              />
            </p>
            <Link
              className="mt-4 inline-block text-sm font-bold underline underline-offset-2"
              href="/newsroom/review"
            >
              <NewsroomText ne="समीक्षा सूची खोल्नुहोस्" en="Open review queue" />
            </Link>
          </section>
        </aside>
      </div>
    </main>
  );
}
