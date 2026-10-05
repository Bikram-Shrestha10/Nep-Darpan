"use client";

import Link from "next/link";
import { NewsroomStatus } from "@/components/newsroom/newsroom-status";
import { useNewsroomPrototype } from "@/components/newsroom/newsroom-prototype-provider";
import type { NewsroomStoryFixture } from "@/lib/newsroom/fixtures";

export function NewsroomPreview({ id, fixture }: { id: string; fixture?: NewsroomStoryFixture }) {
  const { draft } = useNewsroomPrototype();
  const story = draft?.id === id ? draft : fixture;
  if (!story) {
    return (
      <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
        <section className="state-panel mx-auto max-w-3xl">
          <h1 className="editorial-heading text-2xl font-bold">यो मस्यौदा सम्झनामा छैन</h1>
          <p className="mt-2 leading-7">
            नयाँ समाचारका परिवर्तन यस ब्राउजर सत्रमा मात्र थिए। रिफ्रेसपछि ती मेटिए; मस्यौदा बचत भएको छैन।
          </p>
          <Link className="button-secondary mt-4" href="/newsroom/stories/new">
            नयाँ मस्यौदा सुरु गर्नुहोस्
          </Link>
        </section>
      </main>
    );
  }
  return (
    <main id="main-content" tabIndex={-1} className="page-shell py-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b-2 border-[var(--ink)] pb-3">
          <div className="flex flex-wrap items-center gap-3">
            <p className="eyebrow">समाचार पूर्वावलोकन · नमुना</p>
            <NewsroomStatus status={story.status} />
          </div>
          <Link className="button-secondary" href={`/newsroom/stories/${story.id}/edit`}>
            सम्पादनमा फर्कनुहोस्
          </Link>
        </div>
        <article className="bg-[var(--paper-raised)] p-5 sm:p-9">
          <p className="eyebrow">{story.category} · काल्पनिक</p>
          <h1 className="editorial-heading mt-4 text-3xl font-bold leading-tight sm:text-5xl">
            {story.title || "शीर्षक नभएको मस्यौदा"}
          </h1>
          {story.summary ? (
            <p className="mt-4 text-lg leading-8 text-[var(--ink-soft)]">{story.summary}</p>
          ) : null}
          <p className="mt-5 text-sm text-[var(--ink-soft)]">{story.author} · मस्यौदा पूर्वावलोकन</p>
          <div className="article-body mt-8 border-t border-[var(--rule)] pt-6">
            {story.body ? (
              <p>{story.body}</p>
            ) : (
              <p className="text-[var(--ink-soft)]">लेख सामग्री थपिएको छैन।</p>
            )}
          </div>
        </article>
        <p className="mt-4 text-xs leading-5 text-[var(--ink-soft)]">
          यो पूर्वावलोकन हालको ब्राउजर सत्रको अस्थायी मस्यौदाबाट बनाइएको हो। रिफ्रेस गर्दा मस्यौदा मेटिन्छ। यसले
          सामग्री सार्वजनिक गर्दैन।
        </p>
      </div>
    </main>
  );
}
