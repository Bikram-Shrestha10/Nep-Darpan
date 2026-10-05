"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { useNewsroomPrototype } from "@/components/newsroom/newsroom-prototype-provider";
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
    updatedAt: "2026-10-05T08:00:00.000Z",
    status: "draft" as const,
    body: "",
  };
  const [title, setTitle] = useState(initial.title);
  const [summary, setSummary] = useState(initial.summary);
  const [body, setBody] = useState(initial.body);
  const [category, setCategory] = useState(initial.category);
  const [kind, setKind] = useState("news");
  const [scheduledAt, setScheduledAt] = useState("");
  const [dirty, setDirty] = useState(false);
  const [message, setMessage] = useState("");
  const [validation, setValidation] = useState("");
  const draftRef = useRef<NewsroomStoryFixture>(initial);

  function change(
    field: "title" | "summary" | "body" | "category",
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
      status,
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
          className="border-l-4 border-[var(--urgent-dark)] bg-[var(--paper-muted)] p-3 text-sm"
          role="status"
        >
          बचत नगरिएका नमुना परिवर्तन छन्। यो पृष्ठ रिफ्रेस गर्दा मेटिनेछन्।
        </p>
      ) : null}
      <div>
        <label className="eyebrow mb-2 block" htmlFor="story-title">
          शीर्षक <span aria-hidden="true">*</span>
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
          सारांश <span aria-hidden="true">*</span>
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
            समाचार खण्ड
          </label>
          <select
            className="field"
            id="story-category"
            onChange={(event) => change("category", setCategory, event.target.value)}
            value={category}
          >
            <option>समाज</option>
            <option>राजनीति</option>
            <option>अर्थतन्त्र</option>
            <option>प्रविधि</option>
            <option>विश्व</option>
            <option>विचार</option>
          </select>
        </div>
        <div>
          <label className="eyebrow mb-2 block" htmlFor="story-kind">
            समाचार प्रकार
          </label>
          <select
            className="field"
            id="story-kind"
            onChange={(event) => {
              setKind(event.target.value);
              setDirty(true);
              setMessage("");
            }}
            value={kind}
          >
            <option value="news">समाचार</option>
            <option value="analysis">विश्लेषण</option>
            <option value="opinion">विचार</option>
            <option value="explainer">व्याख्या</option>
            <option value="fact_check">तथ्य जाँच</option>
          </select>
        </div>
      </div>
      <div>
        <label className="eyebrow mb-2 block" htmlFor="story-body">
          लेख सामग्री <span aria-hidden="true">*</span>
        </label>
        <textarea
          className="field min-h-64"
          id="story-body"
          onChange={(event) => change("body", setBody, event.target.value)}
          required
          value={body}
        />
      </div>
      <div className="max-w-sm">
        <label className="eyebrow mb-2 block" htmlFor="story-schedule">
          प्रकाशन मिति/समय (ऐच्छिक)
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
        <p className="text-sm font-bold text-[var(--urgent-dark)]" role="alert">
          {validation}
        </p>
      ) : null}
      {message ? (
        <p className="state-panel text-sm leading-6" role="status">
          {message}
        </p>
      ) : null}
      <div className="flex flex-wrap gap-3 border-t border-[var(--rule)] pt-4">
        <button className="button-secondary" name="intent" type="submit" value="draft">
          मस्यौदाका रूपमा बचत
        </button>
        <button className="button-primary" name="intent" type="submit" value="review">
          समीक्षामा पठाउनुहोस्
        </button>
        <button className="button-secondary" name="intent" type="submit" value="schedule">
          समय तोक्नुहोस्
        </button>
        <Link className="button-secondary" href={`/newsroom/preview/${editorId}`}>
          पूर्वावलोकन
        </Link>
      </div>
      <p className="text-xs leading-5 text-[var(--ink-soft)]">
        पूर्वावलोकनले यस खुला ब्राउजर सत्रको मस्यौदा देखाउँछ। पृष्ठ रिफ्रेस गरेपछि परिवर्तन मेटिन्छन्।
      </p>
    </form>
  );
}
