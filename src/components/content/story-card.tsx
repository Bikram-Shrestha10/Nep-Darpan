import Link from "next/link";
import type { ArticleCard } from "@/lib/content/contracts";
import { ArticleMedia } from "@/components/content/article-media";
import {
  CategoryTag,
  EditorialTags,
  AuthorByline,
  PublishedTime,
} from "@/components/content/story-metadata";

export function StoryCard({
  article,
  density = "standard",
}: {
  article: ArticleCard;
  density?: "standard" | "compact";
}) {
  const mediaModifier = article.leadMedia ? " story-card--with-media" : "";
  return (
    <article className={`story-card story-card--${density}${mediaModifier}`}>
      {article.leadMedia ? <ArticleMedia media={article.leadMedia} /> : null}
      <div className="story-card__body">
        <div className="story-card__topline">
          <CategoryTag category={article.category} />
          <EditorialTags labels={article.labels} kind={article.kind} />
        </div>
        <h3 className="story-card__headline">
          <Link href={article.href}>{article.headline}</Link>
        </h3>
        {article.summary ? <p className="story-card__summary">{article.summary}</p> : null}
        <div className="story-card__metadata">
          <AuthorByline authors={article.authors} />
          <PublishedTime
            value={article.updatedAt ?? article.publishedAt}
            label={article.updatedAt ? "अपडेट" : "प्रकाशित"}
          />
        </div>
        {article.hasCorrection ? (
          <p className="story-card__correction">यस समाचारमा सम्पादकीय सुधार सूचना छ</p>
        ) : null}
      </div>
    </article>
  );
}

export function LeadStory({ article }: { article: ArticleCard }) {
  return (
    <article className="lead-story" aria-labelledby={`lead-${article.id}`}>
      <div className="lead-story__copy">
        <div className="lead-story__labels">
          <CategoryTag category={article.category} />
          <EditorialTags labels={article.labels} kind={article.kind} />
        </div>
        <h2 id={`lead-${article.id}`} className="editorial-heading lead-story__headline">
          <Link href={article.href}>{article.headline}</Link>
        </h2>
        {article.summary ? <p className="lead-story__summary">{article.summary}</p> : null}
        <div className="lead-story__metadata">
          <AuthorByline authors={article.authors} />
          <PublishedTime
            value={article.updatedAt ?? article.publishedAt}
            label={article.updatedAt ? "अपडेट" : "प्रकाशित"}
          />
        </div>
        {article.hasCorrection ? (
          <p className="story-card__correction">यस समाचारमा सम्पादकीय सुधार सूचना छ</p>
        ) : null}
      </div>
      {article.leadMedia ? (
        <ArticleMedia media={article.leadMedia} />
      ) : (
        <div className="lead-story__media-empty" role="img" aria-label="यस नमुना समाचारसँग तस्बिर छैन">
          तस्बिर उपलब्ध छैन
        </div>
      )}
    </article>
  );
}
