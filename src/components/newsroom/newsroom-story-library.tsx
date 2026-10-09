"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
import { NewsroomStatus } from "@/components/newsroom/newsroom-status";
import {
  NewsroomCategory,
  NewsroomStoryKind,
  NewsroomText,
} from "@/components/newsroom/newsroom-text";
import { useNewsroomPrototype } from "@/components/newsroom/newsroom-prototype-provider";
import { newsroomStories, type WorkflowStatus } from "@/lib/newsroom/fixtures";

const statusFilters: Array<{ value: string; ne: string; en: string }> = [
  { value: "all", ne: "सबै सामग्री", en: "All stories" },
  { value: "draft", ne: "मस्यौदा", en: "Draft" },
  { value: "in_review", ne: "समीक्षामा", en: "In review" },
  { value: "scheduled", ne: "समय तोकिएको", en: "Scheduled" },
  { value: "published", ne: "प्रकाशित नमुना", en: "Published demo" },
  { value: "approved_demo", ne: "स्वीकृत नमुना", en: "Approved demo" },
  { value: "returned_demo", ne: "फिर्ता नमुना", en: "Returned demo" },
];

export function NewsroomStoryLibrary({ initialStatus = "all" }: { initialStatus?: string }) {
  const { draft } = useNewsroomPrototype();
  const { language } = useSitePreferences();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState(
    statusFilters.some((filter) => filter.value === initialStatus) ? initialStatus : "all",
  );
  const [category, setCategory] = useState("all");
  const stories = useMemo(() => {
    const combined = [...newsroomStories];
    if (draft) {
      const index = combined.findIndex((story) => story.id === draft.id);
      if (index >= 0) combined[index] = draft;
      else combined.unshift(draft);
    }
    return combined.filter((story) => {
      const matchesQuery = `${story.title} ${story.summary} ${story.author}`
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase());
      const matchesStatus = status === "all" || story.status === status;
      const matchesCategory = category === "all" || story.category === category;
      return matchesQuery && matchesStatus && matchesCategory;
    });
  }, [category, draft, query, status]);
  const categories = [...new Set(newsroomStories.map((story) => story.category))];

  return (
    <section aria-label="Story library" className="mt-6">
      <div className="grid gap-3 rounded-xl border border-[var(--rule)] bg-[var(--paper-muted)] p-4 sm:grid-cols-2 lg:grid-cols-[minmax(14rem,1.5fr)_minmax(10rem,1fr)_minmax(10rem,1fr)_auto] lg:items-end">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="newsroom-story-search">
            <NewsroomText ne="समाचार खोज्नुहोस्" en="Search stories" />
          </label>
          <input
            className="field"
            id="newsroom-story-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder={language === "en" ? "Headline, summary, or author" : "शीर्षक, सारांश वा लेखक"}
            type="search"
            value={query}
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="newsroom-status-filter">
            <NewsroomText ne="अवस्था" en="Status" />
          </label>
          <select
            className="field"
            id="newsroom-status-filter"
            onChange={(event) => setStatus(event.target.value)}
            value={status}
          >
            {statusFilters.map((option) => (
              <option key={option.value} value={option.value}>
                <NewsroomText ne={option.ne} en={option.en} />
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="newsroom-category-filter">
            <NewsroomText ne="खण्ड" en="Section" />
          </label>
          <select
            className="field"
            id="newsroom-category-filter"
            onChange={(event) => setCategory(event.target.value)}
            value={category}
          >
            <option value="all">
              <NewsroomText ne="सबै खण्ड" en="All sections" />
            </option>
            {categories.map((item) => (
              <option key={item} value={item}>
                <LocalizedText ne={item} />
              </option>
            ))}
          </select>
        </div>
        <button
          className="button-secondary"
          onClick={() => {
            setQuery("");
            setStatus("all");
            setCategory("all");
          }}
          type="button"
        >
          <NewsroomText ne="फिल्टर हटाउनुहोस्" en="Clear filters" />
        </button>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-[var(--ink-soft)]">
          <strong>{stories.length}</strong> <NewsroomText ne="नमुना सामग्री" en="demo stories" />
        </p>
        <p className="hidden text-xs text-[var(--ink-soft)] sm:block">
          <NewsroomText
            ne="यो सूची स्थानीय नमुना डाटाबाट बनेको हो।"
            en="This list uses local demo data."
          />
        </p>
      </div>
      {stories.length ? (
        <div className="mt-3 overflow-x-auto rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)]">
          <table className="w-full min-w-[54rem] border-collapse text-left text-sm">
            <caption className="sr-only">नमुना समाचार सूची</caption>
            <thead className="bg-[var(--paper-muted)] text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4">
                  <NewsroomText ne="समाचार" en="Story" />
                </th>
                <th className="p-4">
                  <NewsroomText ne="खण्ड / विधा" en="Section / type" />
                </th>
                <th className="p-4">
                  <NewsroomText ne="लेखक" en="Author" />
                </th>
                <th className="p-4">
                  <NewsroomText ne="अवस्था" en="Status" />
                </th>
                <th className="p-4">
                  <NewsroomText ne="कार्य" en="Actions" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]">
              {stories.map((story) => (
                <tr className="align-top" key={story.id}>
                  <td className="max-w-sm p-4">
                    <Link
                      className="font-bold underline decoration-[var(--rule-strong)] underline-offset-4"
                      href={
                        story.id === "new-draft"
                          ? "/newsroom/stories/new"
                          : `/newsroom/stories/${story.id}`
                      }
                    >
                      <LocalizedText ne={story.title} />
                    </Link>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-[var(--ink-soft)]">
                      <LocalizedText ne={story.summary} />
                    </p>
                    <p className="mt-2 text-[0.68rem] text-[var(--ink-soft)]">
                      {story.id} · {story.updatedAt.slice(0, 10)}
                    </p>
                  </td>
                  <td className="p-4">
                    <span>
                      <NewsroomCategory value={story.category} />
                    </span>
                    <span className="mt-2 block text-xs text-[var(--ink-soft)]">
                      <NewsroomStoryKind value={story.kind ?? "news"} />
                    </span>
                  </td>
                  <td className="p-4">
                    <LocalizedText ne={story.author} />
                  </td>
                  <td className="p-4">
                    <NewsroomStatus status={story.status as WorkflowStatus} />
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-x-3 gap-y-2">
                      <Link
                        className="font-bold underline underline-offset-2"
                        href={
                          story.id === "new-draft"
                            ? "/newsroom/stories/new"
                            : `/newsroom/stories/${story.id}/edit`
                        }
                      >
                        <NewsroomText ne="सम्पादन" en="Edit" />
                      </Link>
                      <Link
                        className="font-bold underline underline-offset-2"
                        href={`/newsroom/preview/${story.id}`}
                      >
                        <NewsroomText ne="पूर्वावलोकन" en="Preview" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="state-panel mt-4" role="status">
          <h2 className="editorial-heading text-xl font-bold">
            <NewsroomText ne="मिल्दो सामग्री भेटिएन" en="No matching stories" />
          </h2>
          <p className="mt-2 text-sm">
            <NewsroomText
              ne="खोज वा फिल्टर परिवर्तन गरी फेरि प्रयास गर्नुहोस्।"
              en="Change your search or filters and try again."
            />
          </p>
        </div>
      )}
    </section>
  );
}
