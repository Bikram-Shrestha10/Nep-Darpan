"use client";

import Link from "next/link";
import { LocalizedText } from "@/components/layout/site-preferences";
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  NewsroomCategory,
  NewsroomStoryKind,
  NewsroomText,
} from "@/components/newsroom/newsroom-text";
import { CorrectionForm } from "@/components/newsroom/correction-form";
import { NewsroomStatus } from "@/components/newsroom/newsroom-status";
import { useSitePreferences } from "@/components/layout/site-preferences";
import { newsroomStories } from "@/lib/newsroom/fixtures";

export type NewsroomModule =
  | "corrections"
  | "homepage"
  | "hub"
  | "categories"
  | "staff"
  | "audit"
  | "settings";

const pageContent: Record<
  NewsroomModule,
  {
    eyebrow: { ne: string; en: string };
    title: { ne: string; en: string };
    description: { ne: string; en: string };
  }
> = {
  corrections: {
    eyebrow: { ne: "प्रकाशित सामग्रीको पारदर्शिता", en: "Published content transparency" },
    title: { ne: "सुधार र अद्यावधिक", en: "Corrections & updates" },
    description: {
      ne: "प्रकाशित सामग्रीमा देखिने सुधार अभिलेख र अद्यावधिकको पूर्वावलोकन गर्नुहोस्।",
      en: "Preview how visible correction and update records are managed for published stories.",
    },
  },
  homepage: {
    eyebrow: { ne: "सम्पादकीय प्राथमिकता", en: "Editorial priorities" },
    title: { ne: "गृहपृष्ठ संयोजन", en: "Homepage curation" },
    description: {
      ne: "मुख्य समाचार र सम्पादकले छानेका गृहपृष्ठ स्थानहरूको नमुना मिलाउनुहोस्।",
      en: "Preview the lead story and editor-selected homepage placements.",
    },
  },
  hub: {
    eyebrow: { ne: "दीर्घकालीन सन्दर्भ सामग्री", en: "Evergreen reference content" },
    title: { ne: "जानकारी केन्द्र", en: "Information hub" },
    description: {
      ne: "व्याख्या, मार्गदर्शिका र तथ्य जाँचको सम्पादकीय सूची हेर्नुहोस्।",
      en: "Review the editorial collection of explainers, guides, and fact-check entries.",
    },
  },
  categories: {
    eyebrow: { ne: "साइटको संरचना", en: "Site structure" },
    title: { ne: "खण्ड र विषय", en: "Sections & topics" },
    description: {
      ne: "समाचार सूचीमा प्रयोग हुने खण्ड र विषयहरूको नमुना व्यवस्थापन गर्नुहोस्।",
      en: "Preview management of sections and topics used across story desks.",
    },
  },
  staff: {
    eyebrow: { ne: "समाचार कक्ष पहुँच", en: "Newsroom access" },
    title: { ne: "कर्मचारी र भूमिका", en: "Staff & roles" },
    description: {
      ne: "प्रस्तावित समाचार कक्ष भूमिका र जिम्मेवारीहरू हेर्नुहोस्। वास्तविक खाता जोडिएको छैन।",
      en: "Review the proposed newsroom roles. No real accounts are connected.",
    },
  },
  audit: {
    eyebrow: { ne: "सम्पादकीय जवाफदेहिता", en: "Editorial accountability" },
    title: { ne: "गतिविधि अभिलेख", en: "Activity log" },
    description: {
      ne: "अभिलेख स्क्रिनको ढाँचा हेर्नुहोस्। तलका प्रविष्टिहरू केवल नमुना हुन्।",
      en: "Preview the activity log layout. All entries below are fictional samples.",
    },
  },
  settings: {
    eyebrow: { ne: "कार्यक्षेत्र प्राथमिकता", en: "Workspace preferences" },
    title: { ne: "समाचार कक्ष सेटिङ", en: "Newsroom settings" },
    description: {
      ne: "प्रस्तावित समाचार कक्षका पूर्वनिर्धारित मान हेर्नुहोस्। नमुना परिवर्तनहरू सुरक्षित हुँदैनन्।",
      en: "Review proposed newsroom defaults. Demo changes are not saved.",
    },
  },
};

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-[var(--rule)] bg-[var(--paper-raised)] p-4 shadow-sm sm:p-6 ${className}`}
    >
      {children}
    </section>
  );
}

function ModuleHeading({ module }: { module: NewsroomModule }) {
  const content = pageContent[module];
  return (
    <header className="mb-6 border-b-2 border-[var(--ink)] pb-5 sm:mb-8">
      <p className="eyebrow text-[var(--ink-soft)]">
        <NewsroomText {...content.eyebrow} />
      </p>
      <h2 className="editorial-heading mt-2 text-3xl font-black sm:text-4xl">
        <NewsroomText {...content.title} />
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-[var(--ink-soft)]">
        <NewsroomText {...content.description} />
      </p>
    </header>
  );
}

function DemoState({ message }: { message: { ne: string; en: string } }) {
  return (
    <p
      className="mt-4 rounded-lg border-l-4 border-[var(--ink)] bg-[var(--paper-muted)] p-3 text-sm leading-6"
      role="status"
    >
      <NewsroomText {...message} />
    </p>
  );
}

function CorrectionsModule() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.8fr)]">
      <Panel>
        <h3 className="editorial-heading text-xl font-bold">
          <NewsroomText ne="सुधार नमुना बनाउनुहोस्" en="Create a correction preview" />
        </h3>
        <div className="mt-4">
          <label className="eyebrow mb-2 block" htmlFor="correction-story">
            <NewsroomText ne="सम्बन्धित नमुना समाचार" en="Related demo story" />
          </label>
          <select
            className="field"
            id="correction-story"
            defaultValue={newsroomStories.find((story) => story.status === "published")?.id}
          >
            {newsroomStories
              .filter((story) => story.status === "published")
              .map((story) => (
                <option key={story.id} value={story.id}>
                  <LocalizedText ne={story.title} />
                </option>
              ))}
          </select>
        </div>
        <CorrectionForm />
      </Panel>
      <Panel>
        <p className="eyebrow">
          <NewsroomText ne="अभिलेख नियम" en="Record principles" />
        </p>
        <h3 className="editorial-heading mt-2 text-xl font-bold">
          <NewsroomText ne="सुधार लुकाएर परिवर्तन हुँदैन" en="Corrections should remain visible" />
        </h3>
        <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-[var(--ink-soft)]">
          <li>
            <NewsroomText
              ne="सार्वजनिक सूचना, कारण र समय स्पष्ट राख्नुहोस्।"
              en="Keep the public notice, reason, and timestamp clear."
            />
          </li>
          <li>
            <NewsroomText
              ne="पुरानो सुधार इतिहासलाई मेटाएर नयाँ लेख्नु हुँदैन।"
              en="Do not erase prior correction history."
            />
          </li>
          <li>
            <NewsroomText
              ne="यहाँको फारमले वास्तविक समाचार परिवर्तन गर्दैन।"
              en="This form does not change a real story."
            />
          </li>
        </ul>
        <Link className="button-secondary mt-5" href="/corrections">
          <NewsroomText ne="सार्वजनिक सुधार पृष्ठ" en="Public corrections page" />
        </Link>
      </Panel>
    </div>
  );
}

function HomepageModule() {
  const published = newsroomStories.filter((story) => story.status === "published");
  const [lead, setLead] = useState(published[0]?.id ?? "");
  const [trending, setTrending] = useState(published.slice(0, 3).map((story) => story.id));
  const [breaking, setBreaking] = useState(false);
  const [previewed, setPreviewed] = useState(false);
  function toggleTrending(id: string) {
    setTrending((current) => {
      if (current.includes(id)) return current.filter((storyId) => storyId !== id);
      return current.length < 5 ? [...current, id] : current;
    });
    setPreviewed(false);
  }
  function moveTrending(index: number, delta: -1 | 1) {
    setTrending((current) => {
      const target = index + delta;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      const currentId = next[index];
      const targetId = next[target];
      if (!currentId || !targetId) return current;
      next[index] = targetId;
      next[target] = currentId;
      return next;
    });
    setPreviewed(false);
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,0.9fr)]">
      <Panel>
        <h3 className="editorial-heading text-xl font-bold">
          <NewsroomText ne="मुख्य स्थानहरू" en="Lead placements" />
        </h3>
        <div className="mt-5">
          <label className="eyebrow mb-2 block" htmlFor="home-lead">
            <NewsroomText ne="मुख्य समाचार" en="Lead story" />
          </label>
          <select
            className="field"
            id="home-lead"
            onChange={(event) => {
              setLead(event.target.value);
              setPreviewed(false);
            }}
            value={lead}
          >
            {published.map((story) => (
              <option key={story.id} value={story.id}>
                <LocalizedText ne={story.title} />
              </option>
            ))}
          </select>
        </div>
        <label className="mt-5 flex items-start gap-3 rounded-lg border border-[var(--rule)] p-4 text-sm leading-6">
          <input
            checked={breaking}
            onChange={(event) => {
              setBreaking(event.target.checked);
              setPreviewed(false);
            }}
            type="checkbox"
          />
          <span>
            <strong className="block">
              <NewsroomText ne="ब्रेकिङ स्थान नमुना" en="Breaking placement demo" />
            </strong>
            <NewsroomText
              ne="यसले गृहपृष्ठको वास्तविक breaking status परिवर्तन गर्दैन।"
              en="This does not change the live homepage."
            />
          </span>
        </label>
        <fieldset className="mt-5 rounded-lg border border-[var(--rule)] p-4">
          <legend className="eyebrow px-1">
            <NewsroomText
              ne="चर्चामा · अधिकतम ५ प्रकाशित कथा"
              en="Trending · up to 5 published stories"
            />
          </legend>
          <ul className="mt-2 grid gap-2">
            {published.map((story) => (
              <li
                className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-[var(--paper)] px-3 py-2"
                key={story.id}
              >
                <label className="flex min-w-0 flex-1 items-start gap-3 text-sm">
                  <input
                    checked={trending.includes(story.id)}
                    disabled={!trending.includes(story.id) && trending.length >= 5}
                    onChange={() => toggleTrending(story.id)}
                    type="checkbox"
                  />
                  <span className="font-semibold">
                    <LocalizedText ne={story.title} />
                  </span>
                </label>
                {trending.includes(story.id) ? (
                  <span className="flex shrink-0 gap-1">
                    <button
                      aria-label={`Move ${story.id} up`}
                      className="size-8 rounded border border-[var(--rule)] font-bold disabled:opacity-40"
                      disabled={trending.indexOf(story.id) === 0}
                      onClick={() => moveTrending(trending.indexOf(story.id), -1)}
                      type="button"
                    >
                      ↑
                    </button>
                    <button
                      aria-label={`Move ${story.id} down`}
                      className="size-8 rounded border border-[var(--rule)] font-bold disabled:opacity-40"
                      disabled={trending.indexOf(story.id) === trending.length - 1}
                      onClick={() => moveTrending(trending.indexOf(story.id), 1)}
                      type="button"
                    >
                      ↓
                    </button>
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </fieldset>
        <div className="mt-5 flex flex-wrap gap-3">
          <button className="button-primary" onClick={() => setPreviewed(true)} type="button">
            <NewsroomText ne="नमुना छनोट हेर्नुहोस्" en="Preview selections" />
          </button>
          <Link className="button-secondary" href="/">
            {" "}
            <NewsroomText ne="गृहपृष्ठ खोल्नुहोस्" en="Open public homepage" />
          </Link>
        </div>
        {previewed ? (
          <p
            className="mt-4 rounded-lg border-l-4 border-[var(--ink)] bg-[var(--paper-muted)] p-3 text-sm leading-6"
            role="status"
          >
            <NewsroomText
              ne="गृहपृष्ठका नमुना छनोट यो पृष्ठमा मात्र देखिन्छ; केही प्रकाशित वा सुरक्षित भएको छैन।"
              en="These homepage choices are only previewed here; nothing was published or saved."
            />
          </p>
        ) : null}
      </Panel>
      <Panel>
        <p className="eyebrow">
          <NewsroomText ne="सम्पादकीय छनोट" en="Editorial selection" />
        </p>
        <h3 className="editorial-heading mt-2 text-2xl font-bold">
          <LocalizedText ne={published.find((story) => story.id === lead)?.title ?? ""} />
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
          <LocalizedText ne={published.find((story) => story.id === lead)?.summary ?? ""} />
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <NewsroomStatus status="published" />
          {breaking ? (
            <span className="story-label story-label--breaking">
              <NewsroomText ne="ब्रेकिङ · नमुना" en="Breaking · demo" />
            </span>
          ) : null}
        </div>
        <div className="mt-5 border-t border-[var(--rule)] pt-4">
          <p className="eyebrow">
            <NewsroomText ne="चर्चामा क्रम" en="Trending order" />
          </p>
          <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm">
            {trending.map((id) => {
              const story = published.find((item) => item.id === id);
              return story ? (
                <li key={id}>
                  <LocalizedText ne={story.title} />
                </li>
              ) : null;
            })}
          </ol>
        </div>
        <p className="mt-4 text-xs leading-5 text-[var(--ink-soft)]">
          <NewsroomText
            ne="गृहपृष्ठ संयोजन सम्पादकीय रूपमा हुन्छ। पाठक लोकप्रियताले स्वचालित रूपमा समाचारलाई माथि सार्दैन।"
            en="Homepage placement is editorially curated; audience popularity does not automatically promote a story."
          />
        </p>
      </Panel>
    </div>
  );
}

function HubModule() {
  const [kind, setKind] = useState("all");
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([
    {
      title: "काल्पनिक व्याख्या: समाचार स्रोत कसरी पढ्ने",
      en: "Fictional explainer: reading a news source",
      kind: "explainer",
      slug: "demo-explainer",
    },
    {
      title: "काल्पनिक मार्गदर्शिका: सार्वजनिक सूचना बुझ्ने",
      en: "Fictional guide: understanding public information",
      kind: "guide",
      slug: "demo-guide",
    },
    {
      title: "काल्पनिक तथ्य जाँच नमुना",
      en: "Fictional fact-check layout sample",
      kind: "fact_check",
      slug: "demo-fact-check",
    },
  ]);
  const [newTitle, setNewTitle] = useState("");
  const [newKind, setNewKind] = useState("explainer");
  const [message, setMessage] = useState<{ ne: string; en: string } | null>(null);
  const visible = items.filter(
    (item) =>
      (kind === "all" || item.kind === kind) &&
      `${item.title} ${item.en}`.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
  );
  function addHubEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTitle.trim();
    if (!title) return;
    setItems((current) => [
      ...current,
      { title, en: title, kind: newKind, slug: `demo-entry-${current.length + 1}` },
    ]);
    setNewTitle("");
    setMessage({
      ne: "नयाँ hub शीर्षक यो पृष्ठमा मात्र थपियो; कुनै सामग्री सार्वजनिक वा सुरक्षित भएको छैन।",
      en: "The hub entry was added only to this page; nothing was published or saved.",
    });
  }
  return (
    <Panel>
      <div className="grid gap-3 sm:grid-cols-[minmax(12rem,1fr)_minmax(10rem,0.7fr)_auto] sm:items-end">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="hub-search">
            <NewsroomText ne="केन्द्र सामग्री खोज्नुहोस्" en="Search hub entries" />
          </label>
          <input
            className="field"
            id="hub-search"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="व्याख्या, मार्गदर्शिका..."
            value={query}
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="hub-kind">
            <NewsroomText ne="प्रकार" en="Type" />
          </label>
          <select
            className="field"
            id="hub-kind"
            onChange={(event) => setKind(event.target.value)}
            value={kind}
          >
            <option value="all">
              <NewsroomText ne="सबै प्रकार" en="All types" />
            </option>
            <option value="explainer">
              <NewsroomText ne="व्याख्या" en="Explainer" />
            </option>
            <option value="guide">
              <NewsroomText ne="मार्गदर्शिका" en="Guide" />
            </option>
            <option value="fact_check">
              <NewsroomText ne="तथ्य जाँच" en="Fact check" />
            </option>
          </select>
        </div>
        <Link className="button-primary" href="/information-hub">
          <NewsroomText ne="सार्वजनिक केन्द्र हेर्नुहोस्" en="View public hub" />
        </Link>
      </div>
      <ul className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((item) => (
          <li
            className="rounded-lg border border-[var(--rule)] bg-[var(--paper)] p-4"
            key={item.slug}
          >
            <p className="eyebrow">
              <NewsroomStoryKind value={item.kind} /> · <NewsroomText ne="नमुना" en="demo" />
            </p>
            <h3 className="editorial-heading mt-2 font-bold">{item.title}</h3>
            <p className="mt-2 text-sm text-[var(--ink-soft)]">{item.en}</p>
            <Link
              className="mt-4 inline-block text-sm font-bold underline"
              href={
                item.slug.startsWith("demo-entry-")
                  ? "/information-hub"
                  : `/information-hub/${item.slug}`
              }
            >
              <NewsroomText ne="नमुना विवरण" en="Preview example" />
            </Link>
          </li>
        ))}
      </ul>
      {!visible.length ? (
        <p className="state-panel mt-4" role="status">
          <NewsroomText ne="मिल्दो नमुना भेटिएन।" en="No matching demo entries." />
        </p>
      ) : null}
      <form
        className="mt-6 grid gap-3 border-t border-[var(--rule)] pt-5 sm:grid-cols-[minmax(0,1fr)_12rem_auto] sm:items-end"
        onSubmit={addHubEntry}
      >
        <div>
          <label className="eyebrow mb-2 block" htmlFor="new-hub-entry">
            <NewsroomText ne="नयाँ नमुना शीर्षक" en="New demo entry title" />
          </label>
          <input
            className="field"
            id="new-hub-entry"
            onChange={(event) => setNewTitle(event.target.value)}
            required
            value={newTitle}
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="new-hub-kind">
            <NewsroomText ne="सामग्री प्रकार" en="Entry type" />
          </label>
          <select
            className="field"
            id="new-hub-kind"
            onChange={(event) => setNewKind(event.target.value)}
            value={newKind}
          >
            <option value="explainer">व्याख्या / Explainer</option>
            <option value="guide">मार्गदर्शिका / Guide</option>
            <option value="fact_check">तथ्य जाँच / Fact check</option>
          </select>
        </div>
        <button className="button-secondary" type="submit">
          <NewsroomText ne="नमुना प्रविष्टि थप्नुहोस्" en="Add demo entry" />
        </button>
      </form>
      {message ? <DemoState message={message} /> : null}
      <p className="mt-4 text-xs leading-5 text-[var(--ink-soft)]">
        <NewsroomText
          ne="यी नमुना प्रविष्टिहरू वास्तविक सम्पादन वा प्रकाशन होइनन्; सामग्री र समीक्षा प्रक्रिया backend मा जोडिनेछ।"
          en="These demo entries are not real edits or publications; persistence and review will be connected in the backend."
        />
      </p>
    </Panel>
  );
}

function CategoriesModule() {
  const [categories, setCategories] = useState([
    "राजनीति",
    "अर्थतन्त्र",
    "समाज",
    "विश्व",
    "प्रविधि",
    "विचार",
  ]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState<{ ne: string; en: string } | null>(null);
  function addCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = name.trim();
    if (!next || categories.includes(next)) {
      setMessage({
        ne: "नाम खाली छ वा यो खण्ड पहिल्यै छ।",
        en: "The name is empty or this section already exists.",
      });
      return;
    }
    setCategories((current) => [...current, next]);
    setName("");
    setMessage({
      ne: "नयाँ खण्ड यस स्क्रिनमा मात्र नमुनाका रूपमा थपियो; साइटको संरचना सुरक्षित भएको छैन।",
      en: "The demo section was added on this screen only; site taxonomy was not saved.",
    });
  }
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.7fr)]">
      <Panel>
        <h3 className="editorial-heading text-xl font-bold">
          <NewsroomText ne="हालका नमुना खण्डहरू" en="Current demo sections" />
        </h3>
        <ul className="mt-4 divide-y divide-[var(--rule)]">
          {categories.map((category) => (
            <li className="flex items-center justify-between gap-4 py-3" key={category}>
              <span className="font-bold">
                <NewsroomCategory value={category} />
              </span>
              <span className="text-xs text-[var(--ink-soft)]">
                <NewsroomText
                  ne={category === "विचार" ? "विचार" : "खण्ड"}
                  en={category === "विचार" ? "Opinion" : "Section"}
                />{" "}
                · <NewsroomText ne="नमुना" en="demo" />
              </span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel>
        <h3 className="editorial-heading text-xl font-bold">
          <NewsroomText ne="खण्ड थप्ने नमुना" en="Add section preview" />
        </h3>
        <form className="mt-4 grid gap-3" onSubmit={addCategory}>
          <label className="eyebrow" htmlFor="new-category">
            <NewsroomText ne="नेपाली नाम" en="Section name" />
          </label>
          <input
            className="field"
            id="new-category"
            onChange={(event) => setName(event.target.value)}
            required
            value={name}
          />
          <button className="button-primary w-fit" type="submit">
            <NewsroomText ne="नमुना खण्ड थप्नुहोस्" en="Add demo section" />
          </button>
        </form>
        {message ? <DemoState message={message} /> : null}
        <p className="mt-4 text-xs leading-5 text-[var(--ink-soft)]">
          <NewsroomText
            ne="खण्डको slug, भाषा, क्रम र प्रकाशनयोग्यता वास्तविक backend कार्यमा व्यवस्थापन गरिनेछ।"
            en="Section slugs, locales, ordering, and publication eligibility require the backend."
          />
        </p>
      </Panel>
    </div>
  );
}

function StaffModule() {
  const roleMatrixRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const { language } = useSitePreferences();
  const permissions = [
    ["आफ्नो मस्यौदा बनाउने/सम्पादन", "Create/edit own draft", "Yes", "Limited", "Yes", "Policy"],
    ["समाचार समीक्षा", "Editorial review", "No", "No", "Yes", "Yes"],
    ["तथ्य जाँच समीक्षा", "Fact-check review", "No", "Yes", "Yes", "Yes"],
    ["स्वीकृति/समय/प्रकाशन", "Approve/schedule/publish", "No", "No", "Yes", "Yes"],
    ["सुधार/अप्रकाशित/अभिलेख", "Correct/unpublish/archive", "No", "No", "Audited", "Audited"],
    ["कर्मचारी/सेटिङ व्यवस्थापन", "Manage staff/settings", "No", "No", "No", "Yes"],
  ];

  useEffect(() => {
    const region = roleMatrixRef.current;
    if (!region) return;
    region.lang = language;

    const updateScrollControls = () => {
      const maxScrollLeft = region.scrollWidth - region.clientWidth;
      setCanScrollLeft(region.scrollLeft > 1);
      setCanScrollRight(maxScrollLeft > 1 && region.scrollLeft < maxScrollLeft - 1);
    };

    updateScrollControls();
    region.addEventListener("scroll", updateScrollControls, { passive: true });
    window.addEventListener("resize", updateScrollControls);
    return () => {
      region.removeEventListener("scroll", updateScrollControls);
      window.removeEventListener("resize", updateScrollControls);
    };
  }, [language]);

  function scrollRoleMatrix(direction: -1 | 1) {
    const region = roleMatrixRef.current;
    if (!region) return;
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    region.scrollBy({
      left: direction * Math.max(region.clientWidth * 0.75, 180),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }

  return (
    <div className="grid grid-cols-1 gap-5 min-[1400px]:grid-cols-[minmax(0,2.2fr)_minmax(18rem,0.8fr)]">
      <Panel>
        <p className="eyebrow text-[var(--ink-soft)]">
          <NewsroomText ne="भूमिका आधार" en="Role baseline" />
        </p>
        <h3 className="editorial-heading mt-2 text-xl font-bold">
          <NewsroomText
            ne="अनुमति सर्भरले लागू गर्नुपर्छ"
            en="Permissions must be enforced on the server"
          />
        </h3>
        <p className="mt-3 text-xs leading-5 text-[var(--ink-soft)]" id="role-matrix-scroll-help">
          <NewsroomText
            ne="सबै भूमिका हेर्न तालिकालाई दायाँ–बायाँ सार्नुहोस्।"
            en="Scroll the table horizontally to view every role."
          />
        </p>
        {(canScrollLeft || canScrollRight) && (
          <div className="mt-2 flex justify-end gap-2">
            <button
              aria-controls="staff-permissions-matrix"
              aria-label={
                language === "en" ? "Scroll role matrix left" : "भूमिका तालिका बायाँ सार्नुहोस्"
              }
              className="button-secondary"
              disabled={!canScrollLeft}
              onClick={() => scrollRoleMatrix(-1)}
              type="button"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              aria-controls="staff-permissions-matrix"
              aria-label={
                language === "en" ? "Scroll role matrix right" : "भूमिका तालिका दायाँ सार्नुहोस्"
              }
              className="button-secondary"
              disabled={!canScrollRight}
              onClick={() => scrollRoleMatrix(1)}
              type="button"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
        <section
          aria-describedby="role-matrix-scroll-help"
          aria-labelledby="staff-permissions-caption"
          className="mt-2 overflow-x-auto rounded-lg border border-[var(--rule)]"
          id="staff-permissions-matrix"
          ref={roleMatrixRef}
        >
          <table className="w-full min-w-[42rem] text-left text-sm">
            <caption className="sr-only" id="staff-permissions-caption">
              <NewsroomText
                ne="प्रस्तावित कर्मचारी अनुमति म्याट्रिक्स"
                en="Proposed staff permissions matrix"
              />
            </caption>
            <thead className="bg-[var(--paper-muted)]">
              <tr>
                <th className="p-3">
                  <NewsroomText ne="कार्य" en="Capability" />
                </th>
                <th className="p-3">
                  <NewsroomText ne="पत्रकार" en="Journalist" />
                </th>
                <th className="p-3">
                  <NewsroomText ne="तथ्य जाँचकर्ता" en="Fact checker" />
                </th>
                <th className="p-3">
                  <NewsroomText ne="सम्पादक" en="Editor" />
                </th>
                <th className="p-3">
                  <NewsroomText ne="प्रशासक" en="Administrator" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--rule)]">
              {permissions.map(([ne, en, journalist, checker, editor, admin]) => (
                <tr key={en}>
                  <th className="p-3 font-semibold">
                    <NewsroomText ne={ne} en={en} />
                  </th>
                  <td className="p-3">
                    <PermissionValue value={journalist} />
                  </td>
                  <td className="p-3">
                    <PermissionValue value={checker} />
                  </td>
                  <td className="p-3">
                    <PermissionValue value={editor} />
                  </td>
                  <td className="p-3">
                    <PermissionValue value={admin} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <p className="mt-3 text-xs leading-5 text-[var(--ink-soft)]">
          <NewsroomText
            ne="यो भूमिकाको प्रस्तावित आधार हो। उत्पादनमा अनुमति सर्भर र डेटाबेस तहमा जाँचिनुपर्छ।"
            en="This is the proposed role baseline. Production permissions must be enforced on the server and database."
          />
        </p>
      </Panel>
      <Panel>
        <h3 className="editorial-heading text-xl font-bold">
          <NewsroomText ne="स्टाफ खाता व्यवस्थापन" en="Staff account management" />
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-soft)]">
          <NewsroomText
            ne="यस प्रोटोटाइपमा कुनै वास्तविक कर्मचारी खाता छैन। साइन इन, निमन्त्रणा र भूमिका परिवर्तन बन्द छन्।"
            en="There are no real staff accounts in this prototype. Sign-in, invitations, and role changes are not connected."
          />
        </p>
        <Link className="button-secondary mt-5" href="/newsroom/sign-in">
          <NewsroomText ne="साइन इन पूर्वावलोकन हेर्नुहोस्" en="Open sign-in preview" />
        </Link>
      </Panel>
    </div>
  );
}

function PermissionValue({ value }: { value: string }) {
  const labels: Record<string, { ne: string; en: string }> = {
    Yes: { ne: "छ", en: "Yes" },
    Limited: { ne: "सीमित", en: "Limited" },
    No: { ne: "छैन", en: "No" },
    Policy: { ne: "नीति अनुसार", en: "Policy" },
    Audited: { ne: "अडिट सहित", en: "Audited" },
  };
  return <NewsroomText {...(labels[value] ?? { ne: value, en: value })} />;
}

function AuditModule() {
  const entries = [
    {
      actor: { ne: "सम्पादक नमुना", en: "Sample Editor" },
      action: {
        ne: "काल्पनिक समाचार समीक्षा सूची खोले",
        en: "Opened the fictional story review queue",
      },
      time: "2026-10-09 09:20",
    },
    {
      actor: { ne: "डेस्क नमुना", en: "Sample Desk" },
      action: { ne: "नमुना कथा मस्यौदा परिवर्तन", en: "Updated a sample story draft" },
      time: "2026-10-09 08:45",
    },
    {
      actor: { ne: "प्रणाली नमुना", en: "Sample System" },
      action: { ne: "यो दृश्य नमुना डेटा हो", en: "This is visual sample data" },
      time: "2026-10-08 16:10",
    },
  ];
  const [query, setQuery] = useState("");
  const filtered = entries.filter((row) =>
    `${row.actor.ne} ${row.actor.en} ${row.action.ne} ${row.action.en} ${row.time}`
      .toLocaleLowerCase()
      .includes(query.toLocaleLowerCase()),
  );
  return (
    <Panel>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="audit-search">
            <NewsroomText ne="अभिलेख खोज्नुहोस्" en="Search demo log" />
          </label>
          <input
            className="field w-full sm:w-80"
            id="audit-search"
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            value={query}
          />
        </div>
        <span className="story-label">
          <NewsroomText
            ne="नमुना प्रविष्टि · वास्तविक audit होइन"
            en="Demo entries · not an actual audit"
          />
        </span>
      </div>
      <ol className="mt-5 divide-y divide-[var(--rule)]">
        {filtered.map(({ actor, action, time }) => (
          <li
            className="grid gap-2 py-4 sm:grid-cols-[minmax(10rem,0.6fr)_minmax(0,1fr)_auto] sm:items-center"
            key={`${actor.en}-${time}`}
          >
            <strong>
              <NewsroomText {...actor} />
            </strong>
            <span className="text-sm">
              <NewsroomText {...action} />
            </span>
            <time className="text-xs text-[var(--ink-soft)]">{time}</time>
          </li>
        ))}
      </ol>
      {!filtered.length ? (
        <p className="state-panel" role="status">
          <NewsroomText ne="मिल्दो नमुना अभिलेख छैन।" en="No matching demo log entries." />
        </p>
      ) : null}
      <p className="mt-3 text-xs leading-5 text-[var(--ink-soft)]">
        <NewsroomText
          ne="वास्तविक audit trail backend मा actor, समय, वस्तु र कारणसँग append-only रूपमा सुरक्षित हुनुपर्छ।"
          en="The backend must retain a durable audit trail with actor, time, object, and reason."
        />
      </p>
    </Panel>
  );
}

function SettingsModule() {
  const [locale, setLocale] = useState("ne-NP");
  const [pageSize, setPageSize] = useState("12");
  const [message, setMessage] = useState<{ ne: string; en: string } | null>(null);
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <Panel>
        <h3 className="editorial-heading text-xl font-bold">
          <NewsroomText ne="साइटका पूर्वनिर्धारित मान" en="Site defaults" />
        </h3>
        <form
          className="mt-4 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            setMessage({
              ne: "यी प्राथमिकता यो नमुना पृष्ठमा मात्र छन्; स्थायी सेटिङ सुरक्षित भएको छैन।",
              en: "These preferences only apply on this demo screen; no settings have been saved.",
            });
          }}
        >
          <div>
            <label className="eyebrow mb-2 block" htmlFor="default-locale">
              <NewsroomText ne="मुख्य भाषा" en="Default locale" />
            </label>
            <select
              className="field"
              id="default-locale"
              onChange={(event) => setLocale(event.target.value)}
              value={locale}
            >
              <option value="ne-NP">Nepali · नेपाली (ne-NP)</option>
              <option value="en">English (en)</option>
            </select>
          </div>
          <div>
            <label className="eyebrow mb-2 block" htmlFor="default-page-size">
              <NewsroomText ne="सूचीमा देखाउने कथा" en="Stories per list page" />
            </label>
            <select
              className="field"
              id="default-page-size"
              onChange={(event) => setPageSize(event.target.value)}
              value={pageSize}
            >
              <option>8</option>
              <option>12</option>
              <option>20</option>
            </select>
          </div>
          <button className="button-primary w-fit" type="submit">
            <NewsroomText ne="नमुना सेटिङ लागू गर्नुहोस्" en="Preview settings" />
          </button>
        </form>
        {message ? <DemoState message={message} /> : null}
      </Panel>
      <Panel>
        <h3 className="editorial-heading text-xl font-bold">
          <NewsroomText ne="सेवा जडान अवस्था" en="Service connection status" />
        </h3>
        <dl className="mt-4 divide-y divide-[var(--rule)] text-sm">
          {[
            { name: "PostgreSQL", ne: "जडान गरिएको छैन", en: "Not connected" },
            { name: "Redis", ne: "जडान गरिएको छैन", en: "Not connected" },
            { name: "Cloudinary", ne: "जडान गरिएको छैन", en: "Not connected" },
            { name: "Staff authentication", ne: "जडान गरिएको छैन", en: "Not connected" },
          ].map(({ name, ne, en }) => (
            <div className="flex flex-wrap justify-between gap-3 py-3" key={name}>
              <dt className="font-bold">{name}</dt>
              <dd className="text-[var(--ink-soft)]">
                <NewsroomText ne={ne} en={en} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-xs leading-5 text-[var(--ink-soft)]">
          <NewsroomText
            ne="सेवा जडान नभएसम्म सेटिङका यी अवस्था दृश्य जानकारी मात्र हुन्।"
            en="These service states are informational until integrations are configured."
          />
        </p>
      </Panel>
    </div>
  );
}

export function NewsroomAdminModule({ module }: { module: NewsroomModule }) {
  return (
    <>
      <ModuleHeading module={module} />
      {module === "corrections" ? <CorrectionsModule /> : null}
      {module === "homepage" ? <HomepageModule /> : null}
      {module === "hub" ? <HubModule /> : null}
      {module === "categories" ? <CategoriesModule /> : null}
      {module === "staff" ? <StaffModule /> : null}
      {module === "audit" ? <AuditModule /> : null}
      {module === "settings" ? <SettingsModule /> : null}
    </>
  );
}
