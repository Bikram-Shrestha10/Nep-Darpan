import type { SourceReference } from "@/lib/content/contracts";
import { useId } from "react";
import { PublishedTime } from "@/components/content/story-metadata";

function safeHttpUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : null;
  } catch {
    return null;
  }
}

export function SourceAttribution({ sources }: { sources: SourceReference[] }) {
  const headingId = useId();
  if (!sources.length) return null;
  return (
    <section className="source-attribution" aria-labelledby={headingId}>
      <h2 id={headingId} className="eyebrow">
        स्रोत र सन्दर्भ
      </h2>
      <ul className="source-attribution__list">
        {sources.map((source) => {
          const href = safeHttpUrl(source.href);
          return (
            <li className="source-attribution__item" key={`${source.label}-${source.href}`}>
              <span>
                {href ? (
                  <a href={href} rel="noreferrer noopener" target="_blank">
                    {source.label}
                  </a>
                ) : (
                  source.label
                )}
              </span>
              {source.publisher ? <span>{source.publisher}</span> : null}
              {source.accessedAt ? <PublishedTime value={source.accessedAt} label="हेरेको" /> : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
