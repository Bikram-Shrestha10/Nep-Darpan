import Link from "next/link";
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
      {category.name}
    </Link>
  );
}

export function StoryKindTag({ kind }: { kind: StoryKind }) {
  return <span className={`story-label story-label--${kind}`}>{storyKinds[kind]}</span>;
}

export function EditorialTags({ labels, kind }: { labels: EditorialLabel[]; kind?: StoryKind }) {
  const kindLabel: Partial<Record<StoryKind, EditorialLabel>> = {
    analysis: "analysis",
    fact_check: "fact_check",
    opinion: "opinion",
  };
  const labelsToShow = [...new Set(labels)].filter((label) => label !== (kind && kindLabel[kind]));
  return (
    <ul className="story-labels" aria-label="सम्पादकीय वर्गीकरण">
      {kind ? (
        <li key={`kind-${kind}`}>
          <StoryKindTag kind={kind} />
        </li>
      ) : null}
      {labelsToShow.map((label) => (
        <li key={label}>
          <span className={`story-label story-label--${label}`}>{editorialLabels[label]}</span>
        </li>
      ))}
    </ul>
  );
}

export function AuthorByline({ authors }: { authors: AuthorSummary[] }) {
  if (authors.length === 0) return <span className="story-byline">लेखक जानकारी उपलब्ध छैन</span>;
  return (
    <span className="story-byline">
      {authors.map((author, index) => (
        <span className="story-author" key={author.id}>
          {index > 0 ? <span aria-hidden="true">, </span> : null}
          <span>{author.name}</span>
          {author.roleLabel ? (
            <span className="story-author__role"> · {author.roleLabel}</span>
          ) : null}
        </span>
      ))}
    </span>
  );
}

export function PublishedTime({ value, label = "प्रकाशित" }: { value: string; label?: string }) {
  const timestamp = new Date(value);
  if (!Number.isFinite(timestamp.getTime()))
    return <span className="story-time">{label}: समय उपलब्ध छैन</span>;
  const formatted = new Intl.DateTimeFormat("ne-NP", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kathmandu",
  }).format(timestamp);
  return (
    <span className="story-time">
      <span>{label}: </span>
      <time dateTime={timestamp.toISOString()}>{formatted}</time>
    </span>
  );
}
