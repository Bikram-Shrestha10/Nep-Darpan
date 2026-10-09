"use client";

import Link from "next/link";
import { LocalizedText, useSitePreferences } from "@/components/layout/site-preferences";
import { formatLocalizedDate } from "@/lib/i18n/dates";
import type {
  AuthorSummary,
  CategorySummary,
  EditorialLabel,
  StoryKind,
} from "@/lib/content/contracts";

const editorialLabels: Record<EditorialLabel, string> = {
  breaking: "ब्रेकिङ",
  opinion: "विचार",
  analysis: "विश्लेषण",
  fact_check: "तथ्य जाँच",
  sponsored: "प्रायोजित",
};

const storyKinds: Record<StoryKind, string> = {
  news: "समाचार",
  analysis: "विश्लेषण",
  opinion: "विचार",
  explainer: "व्याख्या",
  fact_check: "तथ्य जाँच",
  guide: "मार्गदर्शिका",
};

export function CategoryTag({ category }: { category: CategorySummary }) {
  return (
    <Link className="story-category" href={`/category/${encodeURIComponent(category.slug)}`}>
      <LocalizedText ne={category.name} />
    </Link>
  );
}

export function StoryKindTag({ kind }: { kind: StoryKind }) {
  return (
    <span className={`story-label story-label--${kind}`}>
      <LocalizedText ne={storyKinds[kind]} />
    </span>
  );
}

export function EditorialTags({
  labels,
  kind,
  categorySlug,
}: {
  labels: EditorialLabel[];
  kind?: StoryKind;
  categorySlug?: string;
}) {
  const { language } = useSitePreferences();
  const kindLabel: Partial<Record<StoryKind, EditorialLabel>> = {
    analysis: "analysis",
    fact_check: "fact_check",
    opinion: "opinion",
  };
  const labelsToShow = [...new Set(labels)].filter((label) => label !== (kind && kindLabel[kind]));
  const showKind = kind !== "news" && !(kind === "opinion" && categorySlug === "opinion");
  if (!(kind && showKind) && labelsToShow.length === 0) return null;

  return (
    <ul
      className="story-labels"
      aria-label={language === "en" ? "Editorial labels" : "सम्पादकीय वर्गीकरण"}
    >
      {kind && showKind ? (
        <li key={`kind-${kind}`}>
          <StoryKindTag kind={kind} />
        </li>
      ) : null}
      {labelsToShow.map((label) => (
        <li key={label}>
          <span className={`story-label story-label--${label}`}>
            <LocalizedText ne={editorialLabels[label]} />
          </span>
        </li>
      ))}
    </ul>
  );
}

export function AuthorByline({ authors }: { authors: AuthorSummary[] }) {
  if (authors.length === 0)
    return (
      <span className="story-byline">
        <LocalizedText ne="लेखक जानकारी उपलब्ध छैन" />
      </span>
    );
  return (
    <span className="story-byline">
      {authors.map((author, index) => (
        <span className="story-author" key={author.id}>
          {index > 0 ? <span aria-hidden="true">, </span> : null}
          <span>
            <LocalizedText ne={author.name} />
          </span>
          {author.roleLabel ? (
            <span className="story-author__role">
              {" "}
              · <LocalizedText ne={author.roleLabel} />
            </span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

export function PublishedTime({ value, label = "प्रकाशित" }: { value: string; label?: string }) {
  const { language } = useSitePreferences();
  const timestamp = new Date(value);
  if (!Number.isFinite(timestamp.getTime()))
    return (
      <span className="story-time">
        <LocalizedText ne={label} />: <LocalizedText ne="समय उपलब्ध छैन" />
      </span>
    );
  const formatted = formatLocalizedDate(timestamp, language, {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kathmandu",
  });
  return (
    <span className="story-time">
      <span>
        <LocalizedText ne={label} />:{" "}
      </span>
      <time dateTime={timestamp.toISOString()}>{formatted}</time>
    </span>
  );
}
