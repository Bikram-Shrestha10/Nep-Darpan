"use client";

import Link from "next/link";
import { type FormEvent, useRef, useState } from "react";
import { LocalizedText } from "@/components/layout/site-preferences";
import { useNewsroomPrototype } from "@/components/newsroom/newsroom-prototype-provider";
import { NewsroomText } from "@/components/newsroom/newsroom-text";
import type { NewsroomStoryFixture } from "@/lib/newsroom/fixtures";

export function StoryEditorForm({ story }: { story?: NewsroomStoryFixture }) {
  const editorId = story?.id ?? "new-draft";
  const { draft, setDraft, setWorkflowStatus } = useNewsroomPrototype();
  const initial = (draft?.id === editorId ? draft : story) ?? {
    id: editorId,
    title: "",
    summary: "",
    category: "समाज",
    author: "नमुना संवाददाता",
    kind: "news" as const,
    locale: "ne-NP" as const,
    updatedAt: "2026-10-05T08:00:00.000Z",
    status: "draft" as const,
    body: "",
  };
  const [title, setTitle] = useState(initial.title);
  const [summary, setSummary] = useState(initial.summary);
  const [body, setBody] = useState(initial.body);
  const [category, setCategory] = useState(initial.category);
  const [author, setAuthor] = useState(initial.author);
  const [sourceNotes, setSourceNotes] = useState(initial.sourceNotes ?? "");
  const [kind, setKind] = useState<NonNullable<NewsroomStoryFixture["kind"]>>(
    initial.kind ?? "news",
  );
  const [locale, setLocale] = useState<"ne-NP" | "en">(initial.locale ?? "ne-NP");
  const [scheduledAt, setScheduledAt] = useState(initial.scheduledAt ?? "");
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [validation, setValidation] = useState("");
  const draftRef = useRef<NewsroomStoryFixture>(initial);

  function change(
    field: "title" | "summary" | "body" | "category" | "author" | "sourceNotes",
    setter: (value: string) => void,
    value: string,
  ) {
    setter(value);
    draftRef.current = { ...draftRef.current, [field]: value };
    setDraft(draftRef.current);
    setDirty(true);
    setMessage("");
    setValidation("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const intent = (event.nativeEvent as SubmitEvent).submitter?.getAttribute("value") ?? "draft";
    if (intent === "schedule" && !scheduledAt) {
      setValidation("समय तोक्न प्रकाशन मिति र समय छान्नुहोस्।");
      return;
    }
    const status =
      intent === "review" ? "in_review" : intent === "schedule" ? "scheduled" : "draft";
    draftRef.current = {
      ...draftRef.current,
      title,
      summary,
      body,
      category,
      author,
      sourceNotes,
      kind,
      locale,
      status,
      updatedAt: new Date().toISOString(),
      ...(intent === "schedule" ? { scheduledAt } : {}),
    };
    setDraft(draftRef.current);
    setWorkflowStatus(status);
    const action =
      intent === "review"
        ? "समीक्षाका लागि पठाइएको"
        : intent === "schedule"
          ? "समय तोकिएको"
          : "मस्यौदा बचत भएको";
    setMessage(`${action} नमुना पृष्ठमा मात्र देखाइएको छ; डाटाबेसमा बचत वा प्रकाशन भएको छैन।`);
    setDirty(false);
  }

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      {dirty ? (
        <p
          className="border-l-4 border-[var(--ink)] bg-[var(--paper-muted)] p-3 text-sm"
          role="status"
        >
          <LocalizedText ne="बचत नगरिएका नमुना परिवर्तन छन्। यो पृष्ठ रिफ्रेस गर्दा मेटिनेछन्।" />
        </p>
      ) : null}
      <div>
        <label className="eyebrow mb-2 block" htmlFor="story-title">
          <LocalizedText ne="शीर्षक" /> <span aria-hidden="true">*</span>
        </label>
        <input
          className="field"
          id="story-title"
          maxLength={180}
          onChange={(event) => change("title", setTitle, event.target.value)}
          required
          value={title}
        />
      </div>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="story-summary">
          <LocalizedText ne="सारांश" /> <span aria-hidden="true">*</span>
        </label>
        <textarea
          className="field min-h-28"
          id="story-summary"
          maxLength={360}
          onChange={(event) => change("summary", setSummary, event.target.value)}
          required
          value={summary}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="story-category">
            <LocalizedText ne="समाचार खण्ड" />
          </label>
          <select
            className="field"
            id="story-category"
            onChange={(event) => change("category", setCategory, event.target.value)}
            value={category}
          >
            <option value="समाज">
              <LocalizedText ne="समाज" />
            </option>
            <option value="राजनीति">
              <LocalizedText ne="राजनीति" />
            </option>
            <option value="अर्थतन्त्र">
              <LocalizedText ne="अर्थतन्त्र" />
            </option>
            <option value="प्रविधि">
              <LocalizedText ne="प्रविधि" />
            </option>
            <option value="विश्व">
              <LocalizedText ne="विश्व" />
            </option>
            <option value="विचार">
              <LocalizedText ne="विचार" />
            </option>
          </select>
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="story-kind">
            <LocalizedText ne="समाचार प्रकार" />
          </label>
          <select
            className="field"
            id="story-kind"
            onChange={(event) => {
              const selectedKind = event.target.value as NonNullable<NewsroomStoryFixture["kind"]>;
              setKind(selectedKind);
              draftRef.current = { ...draftRef.current, kind: selectedKind };
              setDraft(draftRef.current);
              setDirty(true);
              setMessage("");
            }}
            value={kind}
          >
            <option value="news">
              <LocalizedText ne="समाचार" />
            </option>
            <option value="analysis">
              <LocalizedText ne="विश्लेषण" />
            </option>
            <option value="opinion">
              <LocalizedText ne="विचार" />
            </option>
            <option value="explainer">
              <LocalizedText ne="व्याख्या" />
            </option>
            <option value="fact_check">
              <LocalizedText ne="तथ्य जाँच" />
            </option>
          </select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="eyebrow mb-2 block" htmlFor="story-author">
            <LocalizedText ne="लेखक / डेस्क" /> <span aria-hidden="true">*</span>
          </label>
          <input
            className="field"
            id="story-author"
            onChange={(event) => change("author", setAuthor, event.target.value)}
            required
            value={author}
          />
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="story-locale">
            <LocalizedText ne="सम्पादनको भाषा" />
          </label>
          <select
            className="field"
            id="story-locale"
            onChange={(event) => {
              const selectedLocale = event.target.value as "ne-NP" | "en";
              setLocale(selectedLocale);
              draftRef.current = { ...draftRef.current, locale: selectedLocale };
              setDraft(draftRef.current);
              setDirty(true);
              setMessage("");
            }}
            value={locale}
          >
            <option value="ne-NP">नेपाली · ne-NP</option>
            <option value="en">English · separate reviewed edition</option>
          </select>
          <p className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">
            <NewsroomText
              ne="भाषा छान्दा वास्तविक अनुवाद वा समीक्षा हुँदैन; कथा सामग्री काल्पनिक नमुना नै रहन्छ।"
              en="Selecting a locale does not create or review a translation; story copy remains a fictional sample."
            />
          </p>
        </div>
      </div>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="story-body">
          <LocalizedText ne="लेख सामग्री" /> <span aria-hidden="true">*</span>
        </label>
        <textarea
          className="field min-h-64"
          id="story-body"
          onChange={(event) => change("body", setBody, event.target.value)}
          required
          value={body}
        />
      </div>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="story-sources">
          <LocalizedText ne="स्रोत तथा सम्पादकीय सन्दर्भ" />
        </label>
        <textarea
          className="field min-h-24"
          id="story-sources"
          onChange={(event) => change("sourceNotes", setSourceNotes, event.target.value)}
          placeholder="स्रोत URL वा सम्पादकीय सन्दर्भ"
          value={sourceNotes}
        />
        <p className="mt-2 text-xs leading-5 text-[var(--ink-soft)]">
          <LocalizedText ne="नमुना चरणमा स्रोतहरू जाँच वा सुरक्षित हुँदैनन्। निजी नोट सार्वजनिक सामग्रीमा नलेख्नुहोस्।" />
        </p>
      </div>
      <div className="max-w-sm">
        <label className="eyebrow mb-2 block" htmlFor="story-schedule">
          <LocalizedText ne="प्रकाशन मिति/समय (ऐच्छिक)" />
        </label>
        <input
          className="field"
          id="story-schedule"
          onChange={(event) => {
            setScheduledAt(event.target.value);
            setDirty(true);
            setMessage("");
            setValidation("");
          }}
          type="datetime-local"
          value={scheduledAt}
        />
      </div>
      {validation ? (
        <p className="text-sm font-bold text-[var(--ink)]" role="alert">
          <LocalizedText ne={validation} />
        </p>
      ) : null}
      {message ? (
        <p className="state-panel text-sm leading-6" role="status">
          <LocalizedText ne={message} />
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 border-t border-[var(--rule)] pt-4">
        <button className="button-secondary" name="intent" type="submit" value="draft">
          <LocalizedText ne="मस्यौदाका रूपमा बचत" />
        </button>
        <button className="button-primary" name="intent" type="submit" value="review">
          <LocalizedText ne="समीक्षामा पठाउनुहोस्" />
        </button>
        <button className="button-secondary" name="intent" type="submit" value="schedule">
          <LocalizedText ne="समय तोक्नुहोस्" />
        </button>
        <Link className="button-secondary" href={`/newsroom/preview/${editorId}`}>
          <LocalizedText ne="पूर्वावलोकन" />
        </Link>
      </div>
      <p className="text-xs leading-5 text-[var(--ink-soft)]">
        <LocalizedText ne="पूर्वावलोकनले यस खुला ब्राउजर सत्रको मस्यौदा देखाउँछ। पृष्ठ रिफ्रेस गरेपछि परिवर्तन मेटिन्छन्।" />
      </p>
    </form>
  );
}
