import Link from "next/link";
import type { ArticleCard } from "@/lib/content/contracts";
import { AuthorByline, CategoryTag, PublishedTime } from "@/components/content/story-metadata";
import { LocalizedText, LocalizedNumber } from "@/components/layout/site-preferences";

export function LatestStoryRow({ story, number }: { story: ArticleCard; number: number }) {
  return (
    <li className="latest-feed__item">
      <span className="latest-feed__ordinal" aria-hidden="true">
        <LocalizedNumber value={number} />
      </span>
      <article className="latest-feed__story">
        <div className="latest-feed__meta">
          <CategoryTag category={story.category} />
          <PublishedTime value={story.updatedAt ?? story.publishedAt} />
        </div>
        <h3 className="latest-feed__headline">
          <Link href={story.href}>
            <LocalizedText ne={story.headline} />
          </Link>
        </h3>
        {story.summary ? (
          <p className="latest-feed__summary">
            <LocalizedText ne={story.summary} />
          </p>
        ) : null}
        <div className="latest-feed__footer">
          <AuthorByline authors={story.authors} />
          <span className="latest-feed__sample">
            <LocalizedText ne="काल्पनिक नमुना" en="Fictional sample" />
          </span>
        </div>
      </article>
    </li>
  );
}
